#include "RoboRunEvents.hpp"
#include "RoboRunModule.hpp"
#include "RoboRunTypes.hpp"

#include <ChangeableScene/ChangeableSceneEvents.hpp>

#include <Hiber3D/Asset/AssetServer.hpp>
#include <Hiber3D/BaseAssets/Cubemap.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Gltf/GltfLabel.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Renderer/Camera.hpp>
#include <Hiber3D/Renderer/RenderEnvironment.hpp>
#include <Hiber3D/Renderer/ScreenInfo.hpp>
#include <Hiber3D/Scene/SceneManager.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>
#include <Hiber3D/Scripting/ScriptInstance.hpp>

#include <string>
#include <unordered_map>

static void resetSingletons(
    Hiber3D::Singleton<GameState> gameState) {
    *gameState = GameState{};
}

static void handleGameRestarted(
    Hiber3D::EventView<GameRestarted> events,
    Hiber3D::Singleton<GameState>     gameState) {
    for (const auto& event : events) {
        const auto autoStart = gameState->autoStart;
        resetSingletons(gameState);
        gameState->autoStart = autoStart;
        return;
    }
}

// TODO: Move to some SceneModule
void loadEnvironment(
    Hiber3D::Singleton<Hiber3D::RenderEnvironment>        renderEnvironment,
    Hiber3D::Singleton<Hiber3D::AssetServer>              assetServer,
    Hiber3D::Singleton<Hiber3D::Assets<Hiber3D::Cubemap>> cubemaps) {
    auto skybox = assetServer->loadProcedural<Hiber3D::Cubemap>(
        Hiber3D::AssetPath("skybox"),
        [](Hiber3D::AssetLoadContext& ctx) -> Hiber3D::Cubemap {
            return Hiber3D::Cubemap{
                .posX = ctx.load<Hiber3D::Texture>("environments/skybox_posx.png"),
                .negX = ctx.load<Hiber3D::Texture>("environments/skybox_negx.png"),
                .posY = ctx.load<Hiber3D::Texture>("environments/skybox_posy.png"),
                .negY = ctx.load<Hiber3D::Texture>("environments/skybox_negy.png"),
                .posZ = ctx.load<Hiber3D::Texture>("environments/skybox_posz.png"),
                .negZ = ctx.load<Hiber3D::Texture>("environments/skybox_negz.png"),
            };
        });
    auto lightbox = assetServer->loadProcedural<Hiber3D::Cubemap>(
        Hiber3D::AssetPath("lightbox"),
        [](Hiber3D::AssetLoadContext& ctx) -> Hiber3D::Cubemap {
            return Hiber3D::Cubemap{
                .posX = ctx.load<Hiber3D::Texture>("environments/lightbox_posx.png"),
                .negX = ctx.load<Hiber3D::Texture>("environments/lightbox_negx.png"),
                .posY = ctx.load<Hiber3D::Texture>("environments/lightbox_posy.png"),
                .negY = ctx.load<Hiber3D::Texture>("environments/lightbox_negy.png"),
                .posZ = ctx.load<Hiber3D::Texture>("environments/lightbox_posz.png"),
                .negZ = ctx.load<Hiber3D::Texture>("environments/lightbox_negz.png"),
            };
        });

    renderEnvironment->exposureCompensation = 0.8f;

    renderEnvironment->skybox.cubemap = skybox;

    renderEnvironment->lightbox.brightness = 0.1f;
    renderEnvironment->lightbox.cubemap    = lightbox;

    renderEnvironment->reflectionbox.brightness = 1.0f;
    renderEnvironment->reflectionbox.cubemap    = skybox;

    renderEnvironment->fog.enabled        = true;
    renderEnvironment->fog.density        = 0.00005f;
    renderEnvironment->fog.height         = 100000.0f;
    renderEnvironment->fog.color          = Hiber3D::float3{0.1f, 0.17f, 0.2f};
    renderEnvironment->fog.skyboxAlpha    = 1.0f;
    renderEnvironment->fog.skyboxGradient = 0.01f;

    renderEnvironment->bloom.enabled            = true;
    renderEnvironment->bloom.brightnessTreshold = 0.85f;
    renderEnvironment->bloom.blendAlpha         = 0.35f;

    renderEnvironment->colorGrading.enabled    = true;
    renderEnvironment->colorGrading.saturation = 1.08f;
    renderEnvironment->colorGrading.contrast   = 1.02f;

    renderEnvironment->sun.strength    = 0.0f;
    renderEnvironment->sun.directionWS = Hiber3D::float3{-0.5f, 0.7f, 0.5f};
    renderEnvironment->sun.color       = Hiber3D::float3{1.0f, 1.0f, 1.0f};
}

static void handleRestartGame(
    Hiber3D::EventView<RestartGame>       events,
    Hiber3D::Singleton<GameState>         gameState,
    Hiber3D::EventWriter<ChangeScene>&    changeSceneWriter,
    Hiber3D::EventWriter<GameRestarting>& gameRestartingWriter) {
    for (const auto& event : events) {
        changeSceneWriter.writeEvent({.path = "scenes/restart/Restart.scene"});
        gameRestartingWriter.writeEvent({});
        gameState->autoStart = event.autoStart;
        return;
    }
}

void RoboRunModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_EXIT, resetSingletons);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleGameRestarted);
    context.addSystem(Hiber3D::Schedule::ON_START, loadEnvironment);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleRestartGame);

    context.registerSingleton<GameState>();

    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        context.getModule<Hiber3D::EditorModule>().registerComponent<DeathScene>(context);
    }

    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerSingleton<GameState>(context);

        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<DeathScene>(context);

        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<RestartGame>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<GameRestarting>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<GameRestarted>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerCreated>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<KillPlayer>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerDied>(context);

        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/QuatUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/RegUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/RoboRunUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/ScalarUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/SegUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/SplineUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/VectorUtils.js");
    }

    if (context.isModuleRegistered<Hiber3D::SceneModule>()) {
        context.getModule<Hiber3D::SceneModule>().registerComponent<DeathScene>(context);
    }
}