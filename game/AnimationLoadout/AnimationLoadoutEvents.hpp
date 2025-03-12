#pragma once 

#include <AnimationLoadout/Animated/AnimatedTypes.hpp>

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>

struct PlayAnimation {
    Hiber3D::Entity entity;
    std::string     name;
    AnimationLayer  layer;
    bool            loop = true;
};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayAnimation), HIBER3D_MEMBER(entity), HIBER3D_MEMBER(name), HIBER3D_MEMBER(layer), HIBER3D_MEMBER(loop));

struct CancelAnimation {
    Hiber3D::Entity entity;
    std::string     name;
};

HIBER3D_REFLECT(HIBER3D_TYPE(CancelAnimation), HIBER3D_MEMBER(entity), HIBER3D_MEMBER(name));

struct AnimationFinished {
    Hiber3D::Entity entity;
    std::string     name;
};

HIBER3D_REFLECT(HIBER3D_TYPE(AnimationFinished), HIBER3D_MEMBER(entity), HIBER3D_MEMBER(name));