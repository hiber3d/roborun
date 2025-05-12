#pragma once

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>
#include <Hiber3D/Math/LinalgTypes.hpp>

struct GameState {
    float           difficulty   = 0.0f;
    float           tiltFactor   = 0.0f;  // TODO: split off
    bool            paused       = true;
    bool            alive        = true;  // TODO: split off
    bool            onPath       = true;  // TODO: split off
    Hiber3D::Entity playerEntity = Hiber3D::NULL_ENTITY;
    Hiber3D::float3 direction    = Hiber3D::float3{0.0f, 0.0f, -1.0f};  // TODO: split off
    bool            autoStart    = false;
};

HIBER3D_REFLECT(HIBER3D_TYPE(GameState), HIBER3D_MEMBER(difficulty), HIBER3D_MEMBER(tiltFactor), HIBER3D_MEMBER(paused), HIBER3D_MEMBER(onPath), HIBER3D_MEMBER(alive), HIBER3D_MEMBER(playerEntity), HIBER3D_MEMBER(direction), HIBER3D_MEMBER(autoStart));

// TODO: Move somewhere else
struct DeathScene {
    std::string path;
};

HIBER3D_REFLECT(HIBER3D_TYPE(DeathScene), HIBER3D_MEMBER(path));