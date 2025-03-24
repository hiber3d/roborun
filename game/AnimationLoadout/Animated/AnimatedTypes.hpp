#pragma once

#include <Hiber3D/Animation/Animation.hpp>
#include <Hiber3D/Asset/Assets.hpp>
#include <Hiber3D/Interop/Defines.hpp>

#include <optional>

// TODO: The "std::optional"s are not reflected

// Duplicate in RoboRun.js
enum class AnimationLayer : uint8_t {
    UNDEFINED = 0,
    BASE,
    FALL,
    ACTION,  // "Default"
    ROLL,
    DEAD,
    DYING
};

struct AnimationData {
    Hiber3D::AssetHandle<Hiber3D::Animation> handle = Hiber3D::AssetHandle<Hiber3D::Animation>::Invalid();

    AnimationLayer animationLayer = AnimationLayer::UNDEFINED;

    float                transitionTimeTo   = 0.0f;
    std::optional<float> transitionTimeFrom = std::nullopt;  // If both, 'from' takes precedence

    float animationSpeed = 1.0f;

    bool destroyEntityAfterAnimationFinishes = false;

    bool loop = false;
};

//HIBER3D_REFLECT(HIBER3D_TYPE(AnimationData), HIBER3D_MEMBER(handle), HIBER3D_MEMBER(transitionTimeTo), HIBER3D_MEMBER(animationSpeed), HIBER3D_MEMBER(destroyEntityAfterAnimationFinishes));

// Consumers shouldn't modify members, use PlayAnimationEvent instead
struct Animated {
    AnimationData  currentAnimationData;

    std::optional<AnimationData> queuedAnimationData;
    AnimationData  baseAnimationData;
};

//HIBER3D_REFLECT(HIBER3D_TYPE(Animated), HIBER3D_MEMBER(animationLayer), HIBER3D_MEMBER(animationData), HIBER3D_MEMBER(baseAnimationData));