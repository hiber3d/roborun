#pragma once

#include "RoboRunTypes.hpp"

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>

#include <string>

struct PlayerCreated {
    Hiber3D::Entity entity;
};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayerCreated), HIBER3D_MEMBER(entity));

struct BroadcastPlayerStats {
    Stats stats;
};

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastPlayerStats), HIBER3D_MEMBER(stats));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastPlayerStats);

struct KillPlayer {
};

HIBER3D_REFLECT(HIBER3D_TYPE(KillPlayer));

struct PlayerDied {
    Stats stats;
};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayerDied), HIBER3D_MEMBER(stats));
HIBER3D_INTEROP_SEND_TO_JS(PlayerDied);

struct PlayerJumped {
};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayerJumped));

struct PlayerLanded {
};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayerLanded));

struct PlayAnimation {
    Hiber3D::Entity entity;
    std::string     name;
    bool            loop;
};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayAnimation), HIBER3D_MEMBER(entity), HIBER3D_MEMBER(name), HIBER3D_MEMBER(loop));

struct NewStepEvent {
};

HIBER3D_REFLECT(HIBER3D_TYPE(NewStepEvent));

struct NewSegmentEvent {
};

HIBER3D_REFLECT(HIBER3D_TYPE(NewSegmentEvent));