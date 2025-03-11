#pragma once

#include <Path/PathTypes.hpp>

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>


struct BroadcastPlayerStats {
    Stats stats;
};

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastPlayerStats), HIBER3D_MEMBER(stats));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastPlayerStats);