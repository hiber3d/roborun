#pragma once

#include <Hiber3D/Interop/Defines.hpp>

struct ToggleMuteAudio {
    bool mute = true;
};

HIBER3D_REFLECT(HIBER3D_TYPE(ToggleMuteAudio), HIBER3D_MEMBER(mute));
HIBER3D_INTEROP_RECEIVE_FROM_JS(ToggleMuteAudio);

struct BroadcastRequestMuteState {};

HIBER3D_REFLECT(HIBER3D_TYPE(BroadcastRequestMuteState));
HIBER3D_INTEROP_SEND_TO_JS(BroadcastRequestMuteState);

struct PlayButtonPressAudio {};

HIBER3D_REFLECT(HIBER3D_TYPE(PlayButtonPressAudio));
HIBER3D_INTEROP_RECEIVE_FROM_JS(PlayButtonPressAudio);
