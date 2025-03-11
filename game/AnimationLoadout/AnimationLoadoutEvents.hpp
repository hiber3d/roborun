#pragma once 

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>

struct PlayAnimation {
    Hiber3D::Entity entity;
    std::string     name;
    bool            loop;
};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayAnimation), HIBER3D_MEMBER(entity), HIBER3D_MEMBER(name), HIBER3D_MEMBER(loop));

struct AnimationFinished {
    Hiber3D::Entity entity;
    std::string     name;
};

HIBER3D_REFLECT(HIBER3D_TYPE(AnimationFinished), HIBER3D_MEMBER(entity), HIBER3D_MEMBER(name));