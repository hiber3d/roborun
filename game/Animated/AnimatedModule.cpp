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

constexpr auto ANIMATION_TRANSITION_TIME = Hiber3D::Time::fromSeconds(0.1f);

static void updateAnimations(
    Hiber3D::Registry&                                                             registry,
    Hiber3D::View<Hiber3D::AnimationBlend, Hiber3D::AnimationTransition, Animated> animateds,
    Hiber3D::Singleton<Hiber3D::Assets<Hiber3D::Animation>>                        animationAssets,
    Hiber3D::EventWriter<CancelAnimationEvent>&                                     cancelWriter) {
    for (auto [entity, animationBlend, animationTransition, animated] : animateds.each()) {
        if (const auto* animation = animationAssets->get(animationBlend.layers[0].animation)) {
            const auto currentTime = animationBlend.layers[0].animationTime;
            const auto maxTime     = animation->duration() - ANIMATION_TRANSITION_TIME;

            const auto hackyCompensation = Hiber3D::Time::fromSeconds(2.0f / 60.0f);  // TODO
            if ((currentTime + hackyCompensation) >= maxTime) {
                if (animated.animationData.destroyEntityAfterAnimationFinishes) {
                    destroyEntityWithChildrenRecursive(registry, entity);
                } else {
                    cancelWriter.writeEvent(CancelAnimationEvent{.entity = entity, .animationData = animated.animationData});
                }
            }
        }
    }
}

static void handleCancelAnimationEvent(
    Hiber3D::EventView<CancelAnimationEvent>              events,
    Hiber3D::View<Hiber3D::AnimationTransition, Animated> animateds) {
    for (const auto& event : events) {
        animateds.withComponent(event.entity, [&](Hiber3D::AnimationTransition& animationTransition, Animated& animated) {
            if (event.animationData.handle == animated.animationData.handle) {
                animationTransition.startTransition(animated.baseAnimationData.handle, ANIMATION_TRANSITION_TIME, animated.baseAnimationData.animationSpeed);
                animated.animationLayer = AnimationLayer::BASE;
                animated.animationData  = animated.baseAnimationData;
            }
        });
    }
}

static void handlePlayAnimationEvent(
    Hiber3D::EventView<PlayAnimationEvent>                events,
    Hiber3D::View<Hiber3D::AnimationTransition, Animated> animateds) {
    for (const auto& event : events) {
        animateds.withComponent(event.entity, [&](Hiber3D::AnimationTransition& animationTransition, Animated& animated) {
            if (event.animationLayer >= animated.animationLayer) {
                const auto transitionTime = Hiber3D::Time::fromSeconds(animated.animationData.transitionTimeFrom.value_or(event.animationData.transitionTimeTo));
                animationTransition.startTransition(event.animationData.handle, transitionTime, event.animationData.animationSpeed);
                animated.animationLayer = event.animationLayer;
                animated.animationData  = event.animationData;
            }
            if (event.animationLayer == AnimationLayer::BASE) {
                animated.baseAnimationData = event.animationData;
            }
        });
    }
}

void AnimatedModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_TICK, updateAnimations);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleCancelAnimationEvent); // after updateAnimations
    context.addSystem(Hiber3D::Schedule::ON_TICK, handlePlayAnimationEvent);  // after updateAnimations
}
