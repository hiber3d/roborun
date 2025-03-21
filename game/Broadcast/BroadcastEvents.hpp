#pragma once

#include <Path/PathTypes.hpp>

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>

struct BroadcastPlayerStats {
    Stats stats;
};

struct BroadcastCollectiblePickup {};
struct BroadcastGameStarted {};
struct BroadcastPowerupPickup {};
struct BroadcastPerfectCollectiblePickup {};
struct BroadcastTilted {};
struct BroadcastSlided {};
struct BroadcastTurned {};

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastPlayerStats), HIBER3D_MEMBER(stats));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastPlayerStats);

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastCollectiblePickup));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastCollectiblePickup);

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastGameStarted));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastGameStarted);

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastPowerupPickup));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastPowerupPickup);

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastPerfectCollectiblePickup));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastPerfectCollectiblePickup);

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastTilted));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastTilted);

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastSlided));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastSlided);

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastTurned));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastTurned);