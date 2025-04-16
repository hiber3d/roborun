#include "RoboRunEvents.hpp"
#include "RoboRunModule.hpp"
#include "RoboRunTypes.hpp"

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
        resetSingletons(gameState);
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
    renderEnvironment->fog.color          = Hiber3D::float3{0.2f, 0.35f, 0.4f};
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
    Hiber3D::EventView<RestartGame>           events,
    Hiber3D::Singleton<Hiber3D::AssetServer>  assetServer,
    Hiber3D::Singleton<Hiber3D::SceneManager> sceneManager,
    Hiber3D::EventWriter<GameRestarted>&      writer) {
    for (const auto& event : events) {
        sceneManager->changeScene(assetServer->load<Hiber3D::Scene>("scenes/RoboRun.scene"));
        writer.writeEvent({});
        return;
    }
}


// TODO: Move elsewhere
static void showDebugLines(Hiber3D::Singleton<Hiber3D::Editor> editor) {
    editor->setSettings(Hiber3D::EditorSettings{
        .physicsVisualization = Hiber3D::PhysicsSettings::DebugVisualization{
            .enabled              = true,
            .drawWireFrame        = true,
            .drawVelocity         = true,
            .drawSupportDirection = false,
            .drawBoundingBox      = false,
            .drawCenterOfMass     = true,
        },
    });
}

static void hideDebugLines(Hiber3D::Singleton<Hiber3D::Editor> editor) {
    editor->setSettings(Hiber3D::EditorSettings{
        .physicsVisualization = Hiber3D::PhysicsSettings::DebugVisualization{
            .enabled              = false,
            .drawWireFrame        = false,
            .drawVelocity         = false,
            .drawSupportDirection = false,
            .drawBoundingBox      = false,
            .drawCenterOfMass     = false,
        },
    });
}

void RoboRunModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_EXIT, resetSingletons);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleGameRestarted);
    context.addSystem(Hiber3D::Schedule::ON_START, loadEnvironment);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleRestartGame);

    // For debugging
    // context.addSystem(Hiber3D::Schedule::ON_START_EDIT, showDebugLines);
    // context.addSystem(Hiber3D::Schedule::ON_START, showDebugLines);
    // context.addSystem(Hiber3D::Schedule::ON_START, hideDebugLines);

    context.registerSingleton<GameState>();

    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerSingleton<GameState>(context);

        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<RestartGame>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerCreated>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<KillPlayer>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerDied>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<StartTransition>(context);

        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/QuatUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/RegUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/RoboRunUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/ScalarUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/SegUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/SplineUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/VectorUtils.js");
    }
}