#pragma once

#include <Hiber3D/Interop/Defines.hpp>

struct MuteAudio {
    bool doMute = true;
};

HIBER3D_REFLECT(HIBER3D_TYPE(MuteAudio), HIBER3D_MEMBER(doMute));
HIBER3D_INTEROP_RECEIVE_FROM_JS(MuteAudio);
