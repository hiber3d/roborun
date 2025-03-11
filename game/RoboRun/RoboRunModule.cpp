#include "InputEvents.hpp"
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
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>
#include <Hiber3D/Scripting/ScriptInstance.hpp>

#include <string>
#include <unordered_map>

static void resetSingletons(
    Hiber3D::Singleton<GameState> gameState) {
    *gameState = GameState{};
}

// TODO: Move to SceneModule
void loadEnvironment(
    Hiber3D::Singleton<Hiber3D::RenderEnvironment>        renderEnvironment,
    Hiber3D::Singleton<Hiber3D::AssetServer>              assetServer,
    Hiber3D::Singleton<Hiber3D::Assets<Hiber3D::Cubemap>> cubemaps) {
    auto skybox = assetServer->loadProcedural<Hiber3D::Cubemap>(
        Hiber3D::AssetPath("skybox"),
        [](Hiber3D::AssetLoadContext& ctx) -> Hiber3D::Cubemap {
            return Hiber3D::Cubemap{
                .posX = ctx.load<Hiber3D::Texture>("environments/skybox_posx.ktx2"),
                .negX = ctx.load<Hiber3D::Texture>("environments/skybox_negx.ktx2"),
                .posY = ctx.load<Hiber3D::Texture>("environments/skybox_posy.ktx2"),
                .negY = ctx.load<Hiber3D::Texture>("environments/skybox_negy.ktx2"),
                .posZ = ctx.load<Hiber3D::Texture>("environments/skybox_posz.ktx2"),
                .negZ = ctx.load<Hiber3D::Texture>("environments/skybox_negz.ktx2"),
            };
        });
    auto lightbox = assetServer->loadProcedural<Hiber3D::Cubemap>(
        Hiber3D::AssetPath("lightbox"),
        [](Hiber3D::AssetLoadContext& ctx) -> Hiber3D::Cubemap {
            return Hiber3D::Cubemap{
                .posX = ctx.load<Hiber3D::Texture>("environments/lightbox_posx.ktx2"),
                .negX = ctx.load<Hiber3D::Texture>("environments/lightbox_negx.ktx2"),
                .posY = ctx.load<Hiber3D::Texture>("environments/lightbox_posy.ktx2"),
                .negY = ctx.load<Hiber3D::Texture>("environments/lightbox_negy.ktx2"),
                .posZ = ctx.load<Hiber3D::Texture>("environments/lightbox_posz.ktx2"),
                .negZ = ctx.load<Hiber3D::Texture>("environments/lightbox_negz.ktx2"),
            };
        });

    renderEnvironment->exposureCompensation = 0.5f;

    renderEnvironment->skybox.cubemap = skybox;

    renderEnvironment->lightbox.brightness = 0.3f;
    renderEnvironment->lightbox.cubemap    = lightbox;

    renderEnvironment->reflectionbox.brightness = 1.0f;
    renderEnvironment->reflectionbox.cubemap    = lightbox;

    renderEnvironment->fog.enabled        = true;
    renderEnvironment->fog.density        = 0.00010f;
    renderEnvironment->fog.height         = 30.0f;
    renderEnvironment->fog.color          = Hiber3D::float3{0.2f, 0.35f, 0.4f};
    renderEnvironment->fog.skyboxAlpha    = 1.0f;
    renderEnvironment->fog.skyboxGradient = 0.01f;

    renderEnvironment->bloom.enabled            = false;
    renderEnvironment->bloom.brightnessTreshold = 0.65f;
    renderEnvironment->bloom.blendAlpha         = 1.0f;

    renderEnvironment->colorGrading.enabled    = true;
    renderEnvironment->colorGrading.saturation = 1.0f;
    renderEnvironment->colorGrading.contrast   = 1.01f;

    renderEnvironment->sun.strength    = 0.0f;
    renderEnvironment->sun.directionWS = Hiber3D::float3{-0.5f, 0.7f, 0.5f};
    renderEnvironment->sun.color       = Hiber3D::float3{1.0f, 1.0f, 1.0f};
}

// TODO: Get this into hiber2/
static void updateCameraAspectRatio(
    Hiber3D::View<Hiber3D::Camera>          cameras,
    Hiber3D::Singleton<Hiber3D::ScreenInfo> screenInfo) {
    for (auto [entity, camera] : cameras.each()) {
        camera.aspect = screenInfo->getAspectRatio();
    }
}

void RoboRunModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_EXIT, resetSingletons);
    context.addSystem(Hiber3D::Schedule::ON_START, loadEnvironment);
    context.addSystem(Hiber3D::Schedule::ON_TICK, updateCameraAspectRatio);

    context.registerSingleton<GameState>();

    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerSingleton<GameState>(context);

        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<SwipedLeft>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<SwipedRight>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<SwipedUp>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<SwipedDown>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<LeftTapped>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<RightTapped>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<Tilted>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<StartInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PauseInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<TiltLeftInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<TiltStraightInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<TiltRightInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<JumpInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<DiveInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<SlideInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<TurnLeftInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<TurnRightInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<ToggleAutoRunDebugInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<ToggleAutoRunDebugInput>(context);

        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerCreated>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<KillPlayer>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerDied>(context);

        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/CollisionUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/QuatUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/RegUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/RoboRunUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/ScalarUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/SegUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/SplineUtils.js");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/VectorUtils.js");
    }
}