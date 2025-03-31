#include "AnimatedEvents.hpp"
#include "AnimatedModule.hpp"
#include "AnimatedTypes.hpp"

#include <Hiber3D/Animation/Animation.hpp>
#include <Hiber3D/Animation/AnimationBlend.hpp>
#include <Hiber3D/Animation/AnimationTransition.hpp>
#include <Hiber3D/Asset/Assets.hpp>
#include <Hiber3D/Core/InitContext.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Hierarchy/Hierarchy.hpp>

static void updateAnimations(
    Hiber3D::Registry&                                                             registry,
    Hiber3D::View<Hiber3D::AnimationBlend, Hiber3D::AnimationTransition, Animated> animateds,
    Hiber3D::Singleton<Hiber3D::Assets<Hiber3D::Animation>>                        animationAssets,
    Hiber3D::EventWriter<CancelAnimationEvent>&                                    cancelWriter) {
    for (auto [entity, animationBlend, animationTransition, animated] : animateds.each()) {
        if (const auto* animation = animationAssets->get(animationBlend.layers[0].animation)) {
            const auto currentTime      = animationBlend.layers[0].animationTime;
            const auto transitionTime   = Hiber3D::Time::fromSeconds(animated.currentAnimationData.transitionTimeFrom.value_or(animated.baseAnimationData.transitionTimeTo));
            const auto compensationTime = Hiber3D::Time::fromSeconds(2.0f / 60.0f); // Needed to prevent animation to re-loop
            const auto maxTime          = animation->duration() - transitionTime - compensationTime;
            if (currentTime >= maxTime && animated.currentAnimationData.loop == false) {
                if (animated.currentAnimationData.destroyEntityAfterAnimationFinishes) {
                    destroyEntityWithChildrenRecursive(registry, entity);
                } else {
                    cancelWriter.writeEvent(CancelAnimationEvent{.entity = entity, .animationData = animated.currentAnimationData});
                }
            }
        }
    }
}

static void handleCancelAnimationEvent(
    Hiber3D::EventView<CancelAnimationEvent>              events,
    Hiber3D::View<Hiber3D::AnimationTransition, Animated> animateds,
    Hiber3D::EventWriter<AnimationFinishedEvent>&         writer) {
    for (const auto& event : events) {
        animateds.withComponent(event.entity, [&](Hiber3D::AnimationTransition& animationTransition, Animated& animated) {

            if (animated.queuedAnimationData.has_value() && animated.queuedAnimationData.value().handle == event.animationData.handle) {
                animated.queuedAnimationData = std::nullopt;
			}
            if (animated.currentAnimationData.handle == event.animationData.handle) {

                const auto& newAnimationData = animated.queuedAnimationData.value_or(animated.baseAnimationData);
                animated.queuedAnimationData = std::nullopt;

                const auto transitionTime = Hiber3D::Time::fromSeconds(animated.currentAnimationData.transitionTimeFrom.value_or(newAnimationData.transitionTimeTo));
                animationTransition.startTransition(newAnimationData.handle, transitionTime, newAnimationData.animationSpeed);
                animated.currentAnimationData = newAnimationData;

                writer.writeEvent(AnimationFinishedEvent{.entity = event.entity, .animationData = event.animationData});
            }
        });
    }
}

static void handlePlayAnimationEvent(
    Hiber3D::EventView<PlayAnimationEvent>                events,
    Hiber3D::View<Hiber3D::AnimationTransition, Animated> animateds) {
    for (const auto& event : events) {
        animateds.withComponent(event.entity, [&](Hiber3D::AnimationTransition& animationTransition, Animated& animated) {
            if (event.animationData.animationLayer >= animated.currentAnimationData.animationLayer) {
                const auto transitionTime = Hiber3D::Time::fromSeconds(animated.currentAnimationData.transitionTimeFrom.value_or(event.animationData.transitionTimeTo));
                animationTransition.startTransition(event.animationData.handle, transitionTime, event.animationData.animationSpeed);
                animated.currentAnimationData = event.animationData;
            }
            if (event.animationData.animationLayer == AnimationLayer::BASE) {
                animated.baseAnimationData = event.animationData;
            }
        });
    }
}

void AnimatedModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_TICK, updateAnimations);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleCancelAnimationEvent);  // after updateAnimations
    context.addSystem(Hiber3D::Schedule::ON_TICK, handlePlayAnimationEvent);    // after updateAnimations
}
