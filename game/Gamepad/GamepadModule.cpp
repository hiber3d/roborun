#include <Hiber3D/Core/EventReader.hpp>
#include <Hiber3D/Core/EventWriter.hpp>
#include <Hiber3D/Core/FixedStringFormat.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>

#include <Gamepad/GamepadModule.hpp>
#include <Gamepad/GamepadTypes.hpp>

#include <emscripten.h>
#include <emscripten/html5.h>

static GamepadState updateGamepadState(GamepadState& gamepadState, const EmscriptenGamepadEvent& ge) {
    gamepadState.isConnected = ge.connected;
    if (gamepadState.isConnected) {
        gamepadState.numberOfAxes = ge.numAxes;
        for (int i = 0; i < MAX_NUM_GAMEPAD_AXES && i < ge.numAxes; ++i) {
            gamepadState.axes[i] = ge.axis[i];
        }

        gamepadState.numberOfButtons = ge.numAxes;
        for (int i = 0; i < MAX_NUM_GAMEPAD_BUTTONS && i < ge.numButtons; ++i) {
            gamepadState.analogButtons[i] = ge.analogButton[i];
            gamepadState.digitalButtons[i].set(ge.digitalButton[i]);
        }
    }
    return gamepadState;
}

static void updateGamepad(
    Hiber3D::Singleton<GamepadsState> gamepadsState) {
    // TODO: This code is "noisy". Find a way to clean it up and make it nicer to read
    EMSCRIPTEN_RESULT res         = emscripten_sample_gamepad_data();
    LOG_DEBUG("Updating gamepads! Res = {}", static_cast<int>(res));
    // numGamepads doesn't actually say how many gamepads are connected, but rather
    // the highest index of the connected controllers
    // TODO: We shouldn't need this now that we have the connection events...
    int               numGamepads = emscripten_get_num_gamepads();
    for (int i = 0; i < numGamepads && i < MAX_NUM_GAMEPADS; ++i) {
        int ret = -1;
        EmscriptenGamepadEvent ge;
        ret = emscripten_get_gamepad_status(i, &ge);
        if (ret == EMSCRIPTEN_RESULT_SUCCESS && ge.connected) {
            gamepadsState->gamepadStates[i].decay();
            LOG_DEBUG("Gamepad {} connected", i);
            updateGamepadState(gamepadsState->gamepadStates[i], ge);
        }
    }
}

void GamepadModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_PRE_FRAME, updateGamepad);

    context.registerSingleton<GamepadsState>();

    // Show in editor inspector
    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        // context.getModule<Hiber3D::EditorModule>().registerComponent<ExampleComponent>(context);
    }

    // Make available in scripts
    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerSingleton<GamepadsState>(context);
    }

    // Saved to scene file
    if (context.isModuleRegistered<Hiber3D::SceneModule>()) {
        // context.getModule<Hiber3D::SceneModule>().registerComponent<ExampleComponent>(context);
    }
}
