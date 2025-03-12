#include "AnimationLoadoutEvents.hpp"
#include "AnimationLoadoutModule.hpp"

#include <AnimationLoadout/Animated/AnimatedEvents.hpp>
#include <AnimationLoadout/Animated/AnimatedModule.hpp>
#include <AnimationLoadout/Animated/AnimatedTypes.hpp>

#include <Hiber3D/Animation/AnimationBlend.hpp>
#include <Hiber3D/Animation/AnimationTransition.hpp>
#include <Hiber3D/Asset/AssetServer.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Gltf/GltfLabel.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>
#include <Hiber3D/Scripting/ScriptInstance.hpp>

#include <RoboRun/RoboRunEvents.hpp>
#include <RoboRun/RoboRunTypes.hpp>

constexpr auto PLAYER_ANIMATION_GLB = "glbs/player.glb";

struct AnimationLoadout {
    std::unordered_map<std::string, std::vector<AnimationData>> animations;
};

static void loadAnimation(Hiber3D::Singleton<Hiber3D::AssetServer> assetServer, const std::string& name, const int index, AnimationLoadout& animationLoadout, float to, std::optional<float> from, float animationSpeed) {
    auto newAnimationData               = AnimationData{};
    newAnimationData.handle             = assetServer->load<Hiber3D::Animation>(Hiber3D::GltfLabel::animation(index).toPath(PLAYER_ANIMATION_GLB));
    newAnimationData.transitionTimeTo   = to;
    newAnimationData.transitionTimeFrom = from;
    newAnimationData.animationSpeed     = animationSpeed;

    animationLoadout.animations[name].emplace_back(newAnimationData);
}

static void handlePlayerCreated(
    Hiber3D::Registry&                       registry,
    Hiber3D::Singleton<GameState>            gameState,
    Hiber3D::Singleton<Hiber3D::AssetServer> assetServer,
    Hiber3D::EventView<PlayerCreated>        events) {
    for (const auto& event : events) {
        const auto entity = event.entity;
        if (gameState->playerEntity != Hiber3D::NULL_ENTITY) {
            LOG_ERROR("AnimationLoadoutModule::handlePlayerCreated() - Received PlayerCreatedEvent with new entity:'{}' but playerEntity:'{}' already exists", entity, gameState->playerEntity);
        }
        gameState->playerEntity = entity;

        auto& animationLoadout = registry.emplace<AnimationLoadout>(entity);

        // loadAnimation(assetServer, "idle", ?, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "run", 5, animationLoadout, 0.2f, std::nullopt, 1.25f);
        loadAnimation(assetServer, "dying", 0, animationLoadout, 0.0f, std::nullopt, 0.75f);
        // loadAnimation(assetServer, "dead", ?, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "slide", 12, animationLoadout, 0.1f, 0.2f, 1.0f);
        loadAnimation(assetServer, "jump", 1, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "jump", 2, animationLoadout, 0.0f, std::nullopt, 1.0f);
        // loadAnimation(assetServer, "jump", 3, animationLoadout, 0.0f, std::nullopt, 1.0f);
        //  loadAnimation(assetServer, "jumpIdle", 14, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "fall", 0, animationLoadout, 0.0f, std::nullopt, 1.0f);
        // loadAnimation(assetServer, "fallIdle", 15, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "land", 4, animationLoadout, 0.05f, 0.3f, 1.25f);
        // loadAnimation(assetServer, "landIdle", 16, animationLoadout, 0.0f, std::nullopt, 1.0f);
        loadAnimation(assetServer, "dive", 12, animationLoadout, 0.05f, 0.15f, 1.0f);
        loadAnimation(assetServer, "tiltLeft", 7, animationLoadout, 0.03f, 0.1f, 1.0f);
        loadAnimation(assetServer, "tiltRight", 8, animationLoadout, 0.03f, 0.1f, 1.0f);
        loadAnimation(assetServer, "turnLeft", 9, animationLoadout, 0.1f, 0.25f, 1.25f);
        loadAnimation(assetServer, "turnRight", 10, animationLoadout, 0.1f, 0.25f, 1.25f);
    }
}

static void handlePlayAnimation(
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
            if (animationLoadout.animations.find(event.name) == animationLoadout.animations.end()) {
                LOG_ERROR("AnimationLoadoutModule::handlePlayAnimation() - Animation:'{}' not found in animationLoadout", event.name);
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

static void handleCancelAnimation(
	Hiber3D::EventView<CancelAnimation> events,
	Hiber3D::View<Animated>             animateds,
	Hiber3D::EventWriter<CancelAnimationEvent>& writer) {
	for (const auto& event : events) {
		const auto entity = event.entity;
        animateds.withComponent(entity, [&](const Animated& animated) {
            writer.writeEvent({.entity = entity, .animationData = animated.animationData});
		});
	}
}

static void handleAnimationFinished(
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

void AnimationLoadoutModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_TICK, handlePlayerCreated);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handlePlayAnimation);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleCancelAnimation);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleAnimationFinished);

    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PlayAnimation>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<CancelAnimation>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<AnimationFinished>(context);
    }

    context.registerModule<AnimatedModule>();
}
