#pragma once

#include "AnimatedTypes.hpp"

#include <Hiber3D/Core/Registry.hpp>

struct PlayAnimationEvent {
    Hiber3D::Entity entity;

    AnimationData  animationData;
};

struct CancelAnimationEvent {
    Hiber3D::Entity entity;

    AnimationData animationData;
};

struct AnimationFinishedEvent {
	Hiber3D::Entity entity;

	AnimationData animationData;
};