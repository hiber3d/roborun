#pragma once

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>
#include <Path/PathTypes.hpp>


// TODO: Move out of here

struct PlayerCreated {
    Hiber3D::Entity entity;
};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayerCreated), HIBER3D_MEMBER(entity));

struct KillPlayer {
};

HIBER3D_REFLECT(HIBER3D_TYPE(KillPlayer));

struct PlayerDied {
    Stats stats;
};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayerDied), HIBER3D_MEMBER(stats));
HIBER3D_INTEROP_SEND_TO_JS(PlayerDied);