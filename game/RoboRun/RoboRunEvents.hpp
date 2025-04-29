#pragma once

#include <Path/PathTypes.hpp>

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>

struct RestartGame {
    bool autoStart = false;
};

HIBER3D_REFLECT(HIBER3D_TYPE(RestartGame), HIBER3D_MEMBER(autoStart));
HIBER3D_INTEROP_RECEIVE_FROM_JS(RestartGame);

struct GameRestarting {
    bool dummy = false;
};

HIBER3D_REFLECT(HIBER3D_TYPE(GameRestarting), HIBER3D_MEMBER(dummy));
HIBER3D_INTEROP_SEND_TO_JS(GameRestarting);

struct GameRestarted {
    bool dummy = false;
};

HIBER3D_REFLECT(HIBER3D_TYPE(GameRestarted), HIBER3D_MEMBER(dummy));
HIBER3D_INTEROP_SEND_TO_JS(GameRestarted);

// TODO: Move these out of here

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