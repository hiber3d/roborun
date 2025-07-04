#pragma once

#include <Hiber3D/Core/FixedArray.hpp>
#include <Hiber3D/Core/TypeAlias.hpp>
#include <Hiber3D/Input/Types.hpp>
#include <Hiber3D/Interop/Defines.hpp>

constexpr int MAX_NUM_GAMEPADS = 4;
// There could be more than 16 axes (Emscripten supports 64)
constexpr int MAX_NUM_GAMEPAD_AXES = 16;
// There could be more than 16 buttons (Emscripten supports 64)
constexpr int MAX_NUM_GAMEPAD_BUTTONS = 16;

enum class GamepadButton {
    XBOX_GAMEPAD_BUTTON_A = 0,
    XBOX_GAMEPAD_BUTTON_B,
    XBOX_GAMEPAD_BUTTON_X,
    XBOX_GAMEPAD_BUTTON_Y,
    XBOX_GAMEPAD_BUTTON_LEFT_BUMPER,
    XBOX_GAMEPAD_BUTTON_RIGHT_BUMPER,
    XBOX_GAMEPAD_BUTTON_LEFT_TRIGGER,
    XBOX_GAMEPAD_BUTTON_RIGHT_TRIGGER,
    XBOX_GAMEPAD_BUTTON_BACK,
    XBOX_GAMEPAD_BUTTON_VIEW = 8,
    XBOX_GAMEPAD_BUTTON_START,
    XBOX_GAMEPAD_BUTTON_MENU = 9,
    XBOX_GAMEPAD_BUTTON_LEFT_THUMB,
    XBOX_GAMEPAD_BUTTON_RIGHT_THUMB,
    XBOX_GAMEPAD_BUTTON_DPAD_UP,
    XBOX_GAMEPAD_BUTTON_DPAD_DOWN,
    XBOX_GAMEPAD_BUTTON_DPAD_LEFT,
    XBOX_GAMEPAD_BUTTON_DPAD_RIGHT,
    XBOX_GAMEPAD_BUTTON_GUIDE,
    XBOX_GAMEPAD_BUTTON_HOME = 16,
    XBOX_GAMEPAD_BUTTON_XBOX = 16,
    XBOX_GAMEPAD_BUTTON_SHARE,
    DUALSHOCK_BUTTON_CROSS = 0,
    DUALSHOCK_BUTTON_CIRCLE,
    DUALSHOCK_BUTTON_SQUARE,
    DUALSHOCK_BUTTON_TRIANGLE,
    DUALSHOCK_BUTTON_L1,
    DUALSHOCK_BUTTON_R1,
    DUALSHOCK_BUTTON_L2,
    DUALSHOCK_BUTTON_R2,
    DUALSHOCK_BUTTON_SELECT,
    DUALSHOCK_BUTTON_SHARE = 8,
    DUALSHOCK_BUTTON_OPTIONS,
    DUALSHOCK_BUTTON_START = 9,
    DUALSHOCK_BUTTON_L3,
    DUALSHOCK_BUTTON_R3,
    DUALSHOCK_BUTTON_DPAD_UP,
    DUALSHOCK_BUTTON_DPAD_DOWN,
    DUALSHOCK_BUTTON_DPAD_LEFT,
    DUALSHOCK_BUTTON_DPAD_RIGHT,
    DUALSHOCK_BUTTON_PS,
    DUALSHOCK_BUTTON_TOUCHPAD
};

struct GamepadState {
    bool   isConnected = false;
    double timestamp   = 0.0;

    Hiber3D::FixedString<64> id;
    Hiber3D::FixedString<64> mapping;
    int                      numberOfAxes    = MAX_NUM_GAMEPAD_AXES;
    int                      numberOfButtons = MAX_NUM_GAMEPAD_BUTTONS;

    // TODO: Emscripten calls these arrays by the singular, i.e. axis, not axes.
    // Need to check what the convention is in our codebase...
    std::array<float, MAX_NUM_GAMEPAD_AXES>                   axes           = {};
    std::array<float, MAX_NUM_GAMEPAD_BUTTONS>                analogButtons  = {};
    std::array<Hiber3D::ButtonState, MAX_NUM_GAMEPAD_BUTTONS> digitalButtons = {};
    // NOTE: In the browser's Gamepad API, all buttons are analog,
    // but only a few of them can have non-integer values (i.e. values between 0.0 and 1.0).
    // For instance, the "face buttons" on DualShock2 and 3 are analog, hardware-wise,
    // but the API only reports integer values for these buttons, at least on Windows.
    // Only the trigger buttons report non-integer values. Could be up to the driver, maybe?

    Hiber3D::float2 leftThumbstick() const {
        return Hiber3D::float2(axes[0], axes[1]);
    }

    Hiber3D::float2 rightThumbstick() const {
        return Hiber3D::float2(axes[2], axes[3]);
    }

    bool isPressed(GamepadButton button) const {
        return digitalButtons[static_cast<size_t>(button)].isPressed();
    }

    bool justPressed(GamepadButton button) const {
        return digitalButtons[static_cast<size_t>(button)].justPressed();
    }

    bool justReleased(GamepadButton button) const {
        return digitalButtons[static_cast<size_t>(button)].justReleased();
    }

    void decay() {
        for (int i = 0; i < numberOfAxes && i < MAX_NUM_GAMEPAD_AXES; ++i) {
            axes[i] = 0.0f;
        }
        for (int i = 0; i < numberOfButtons && i < MAX_NUM_GAMEPAD_BUTTONS; ++i) {
            analogButtons[i] = 0.0f;
            digitalButtons[i].decay();
        }
    }
};

struct GamepadsState {
    std::array<GamepadState, MAX_NUM_GAMEPADS> gamepadStates = {};
};

HIBER3D_REFLECT(HIBER3D_TYPE(GamepadState), HIBER3D_MEMBER(isConnected), HIBER3D_MEMBER(id), HIBER3D_MEMBER(mapping), HIBER3D_MEMBER(numberOfAxes), HIBER3D_MEMBER(numberOfButtons), HIBER3D_MEMBER(axes), HIBER3D_MEMBER(analogButtons), HIBER3D_MEMBER(digitalButtons));
HIBER3D_REFLECT(HIBER3D_TYPE(GamepadsState), HIBER3D_MEMBER(gamepadStates));
