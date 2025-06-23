#pragma once

#include <Hiber3D/Interop/Defines.hpp>

struct MuteAudio {
    bool doMute = true;
};

HIBER3D_REFLECT(HIBER3D_TYPE(MuteAudio), HIBER3D_MEMBER(doMute));
HIBER3D_INTEROP_RECEIVE_FROM_JS(MuteAudio);

struct BroadcastRequestMuteState {};

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastRequestMuteState));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastRequestMuteState);

struct PlayButtonPressAudio {};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayButtonPressAudio));
HIBER3D_INTEROP_RECEIVE_FROM_JS(PlayButtonPressAudio);
