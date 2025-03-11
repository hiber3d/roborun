#include "InputEvents.hpp"
#include "RoboRunEvents.hpp"
#include "RoboRunModule.hpp"
#include "RoboRunTypes.hpp"

#include <Animated/AnimatedEvents.hpp>
#include <Animated/AnimatedModule.hpp>
#include <Animated/AnimatedTypes.hpp>

#include <Hiber3D/Animation/AnimationBlend.hpp>
#include <Hiber3D/Animation/AnimationTransition.hpp>
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

struct AnimationLoadout {
    std::unordered_map<std::string, std::vector<AnimationData>> animations;
};

constexpr auto PLAYER_ANIMATION_GLB = "glbs/player.glb";

static void resetSingletons(
    Hiber3D::Singleton<SegmentsState> segmentsState,
    Hiber3D::Singleton<GameState>     gameState) {
    *segmentsState = SegmentsState{};
    *gameState     = GameState{};
}

void loadEnvironment(
    Hiber3D::Singleton<Hiber3D::RenderEnvironment>        renderEnvironment,
    Hiber3D::Singleton<Hiber3D::AssetServer>              assetServer,
    Hiber3D::Singleton<Hiber3D::Assets<Hiber3D::Cubemap>> cubemaps) {
    auto lightbox = assetServer->loadProcedural<Hiber3D::Cubemap>(
        Hiber3D::AssetPath("lightbox"),
        [](Hiber3D::AssetLoadContext& ctx) -> Hiber3D::Cubemap {
            return Hiber3D::Cubemap{
                .posX = ctx.load<Hiber3D::Texture>("environments/night_light_posx.ktx2"),
                .negX = ctx.load<Hiber3D::Texture>("environments/night_light_negx.ktx2"),
                .posY = ctx.load<Hiber3D::Texture>("environments/night_light_posy.ktx2"),
                .negY = ctx.load<Hiber3D::Texture>("environments/night_light_negy.ktx2"),
                .posZ = ctx.load<Hiber3D::Texture>("environments/night_light_posz.ktx2"),
                .negZ = ctx.load<Hiber3D::Texture>("environments/night_light_negz.ktx2"),
            };
        });

    renderEnvironment->exposureCompensation = 0.5f;

    renderEnvironment->skybox.cubemap = lightbox;

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

static void loadAnimation(Hiber3D::Singleton<Hiber3D::AssetServer> assetServer, const std::string& name, const int index, AnimationLoadout& animationLoadout, float to, std::optional<float> from, float animationSpeed) {
    auto newAnimationData               = AnimationData{};
    newAnimationData.handle             = assetServer->load<Hiber3D::Animation>(Hiber3D::GltfLabel::animation(index).toPath(PLAYER_ANIMATION_GLB));
    newAnimationData.transitionTimeTo   = to;
    newAnimationData.transitionTimeFrom = from;
    newAnimationData.animationSpeed     = animationSpeed;

    animationLoadout.animations[name].emplace_back(newAnimationData);
}

void handlePlayerCreated(
    Hiber3D::Registry&                       registry,
    Hiber3D::Singleton<GameState>            gameState,
    Hiber3D::Singleton<Hiber3D::AssetServer> assetServer,
    Hiber3D::EventView<PlayerCreated>        events) {
    for (const auto& event : events) {
        const auto entity = event.entity;
        if (gameState->playerEntity != Hiber3D::NULL_ENTITY) {
            LOG_ERROR("RoboRunModule::handlePlayerCreated() - Received PlayerCreatedEvent with new entity:'{}' but playerEntity:'{}' already exists", entity, gameState->playerEntity);
        }
        gameState->playerEntity = entity;

        auto& animationLoadout = registry.emplace<AnimationLoadout>(entity);

        // loadAnimation(assetServer, "idle", ?, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "run", 5, animationLoadout, 0.0f, std::nullopt, 1.25f);
        loadAnimation(assetServer, "dying", 11, animationLoadout, 0.0f, std::nullopt, 0.75f);
        // loadAnimation(assetServer, "dead", ?, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "slide", 6, animationLoadout, 0.25f, 0.25f, 1.5f);
        loadAnimation(assetServer, "jump", 1, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "jump", 2, animationLoadout, 0.0f, std::nullopt, 1.0f);
        // loadAnimation(assetServer, "jump", 3, animationLoadout, 0.0f, std::nullopt, 1.0f);
        //  loadAnimation(assetServer, "jumpIdle", 14, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "fall", 0, animationLoadout, 0.0f, std::nullopt, 1.0f);
        // loadAnimation(assetServer, "fallIdle", 15, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "land", 4, animationLoadout, 0.0f, std::nullopt, 1.25f);
        // loadAnimation(assetServer, "landIdle", 16, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "dive", 3, animationLoadout, 0.0f, std::nullopt, 1.5f);
        loadAnimation(assetServer, "tiltLeft", 7, animationLoadout, 0.2f, std::nullopt, 1.5f);
        loadAnimation(assetServer, "tiltRight", 8, animationLoadout, 0.2f, std::nullopt, 1.5f);
        loadAnimation(assetServer, "turnLeft", 9, animationLoadout, 0.15f, 0.3f, 1.25f);
        loadAnimation(assetServer, "turnRight", 10, animationLoadout, 0.15f, 0.3f, 1.25f);
    }
}

void handlePlayAnimation(
    Hiber3D::Registry&                          registry,
    Hiber3D::EventView<PlayAnimation>           events,
    Hiber3D::EventWriter<PlayAnimationEvent>&   writer,
    Hiber3D::View<AnimationLoadout>             animationLoadouts,
    Hiber3D::View<Animated>                     animateds,
    Hiber3D::View<Hiber3D::AnimationBlend>      animationBlends,
    Hiber3D::View<Hiber3D::AnimationTransition> animationTransitions) {
    for (const auto& event : events) {
        const auto entity = event.entity;
        animationLoadouts.withComponent(entity, [&](const AnimationLoadout& animationLoadout) {
            // LOG_INFO("RoboRunModule::handlePlayAnimation() - entity:'{}', name:'{}', loop:'{}'", entity, event.name, event.loop);
            if (animationLoadout.animations.find(event.name) == animationLoadout.animations.end()) {
                LOG_ERROR("RoboRunModule::handlePlayAnimation() - Animation:'{}' not found in animationLoadout", event.name);
                return;
            }
            if (!animateds.contains(entity)) {
                registry.emplace<Animated>(entity);
            }
            if (!animationBlends.contains(entity)) {
                registry.emplace<Hiber3D::AnimationBlend>(entity);
            }
            if (!animationTransitions.contains(entity)) {
                registry.emplace<Hiber3D::AnimationTransition>(entity);
            }
            const auto& animationDatas = animationLoadout.animations.at(event.name);
            const auto  index          = rand() % animationDatas.size();
            const auto& animationData  = animationDatas.at(index);
            writer.writeEvent({.entity = entity, .animationData = animationData, .animationLayer = event.loop ? AnimationLayer::BASE : AnimationLayer::ACTION});
        });
    }
}

void handleAnimationFinished(
    Hiber3D::EventView<AnimationFinishedEvent> events,
    Hiber3D::View<AnimationLoadout>            animationLoadouts,
    Hiber3D::EventWriter<AnimationFinished>&   writer) {
    for (const auto& event : events) {
        const auto entity = event.entity;
        animationLoadouts.withComponent(entity, [&](const AnimationLoadout& animationLoadout) {
            const auto& handle = event.animationData.handle;
            for (const auto& [name, animationDatas] : animationLoadout.animations) {
                for (const auto& animationData : animationDatas) {
                    if (animationData.handle == handle) {
						writer.writeEvent({.entity = entity, .name = name});
						return;
					}
				}
			}
        });
    }
}

static void updateCameraAspectRatio(
    Hiber3D::View<Hiber3D::Camera>          cameras,
    Hiber3D::Singleton<Hiber3D::ScreenInfo> screenInfo) {
    for (auto [entity, camera] : cameras.each()) {
        camera.aspect = screenInfo->getAspectRatio();
    }
}

void broadcastStats(
    Hiber3D::Singleton<GameState>               gameState,
    Hiber3D::View<Stats>                        stats,
    Hiber3D::EventWriter<BroadcastPlayerStats>& writer) {
    const auto playerEntity = gameState->playerEntity;
    stats.withComponent(playerEntity, [&](const Stats& stats) {
        writer.writeEvent({.stats = stats});
    });
}

void RoboRunModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_EXIT, resetSingletons);
    context.addSystem(Hiber3D::Schedule::ON_START, loadEnvironment);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handlePlayerCreated);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handlePlayAnimation);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleAnimationFinished);
    context.addSystem(Hiber3D::Schedule::ON_TICK, updateCameraAspectRatio);
    context.addSystem(Hiber3D::Schedule::ON_TICK, broadcastStats);

    context.registerSingleton<GameState>();
    context.registerSingleton<SegmentsState>();

    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        context.getModule<Hiber3D::EditorModule>().registerComponent<Stats>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<SplineData>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<SegmentScene>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<Step>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<OnPath>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<AutoTurn>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<Jumping>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<Diving>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<Sliding>(context);
    }

    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerSingleton<GameState>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerSingleton<SegmentsState>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Stats>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<SplineData>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<SegmentScene>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Step>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<OnPath>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<AutoTurn>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Jumping>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Diving>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Sliding>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<AnimationFinished>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<KillPlayer>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayAnimation>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerCreated>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerDied>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerJumped>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayerLanded>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<NewStepEvent>(context);
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<NewSegmentEvent>(context);
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
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/CollisionUtils.js");
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/QuatUtils.js");
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/RegUtils.js");
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/RoboRunUtils.js");
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/ScalarUtils.js");
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/SegUtils.js");
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/SplineUtils.js");
    context.getModule<Hiber3D::JavaScriptScriptingModule>().registerRequiredScript(context, "scripts/utils/VectorUtils.js");
    context.getModule<Hiber3D::SceneModule>().registerComponent<SplineData>(context);
    context.getModule<Hiber3D::SceneModule>().registerComponent<SegmentScene>(context);
    context.getModule<Hiber3D::SceneModule>().registerComponent<Step>(context);

    context.registerModule<AnimatedModule>();
}
