cmake_minimum_required(VERSION 3.11 FATAL_ERROR)


project("GameTemplate" LANGUAGES CXX C)
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 20)
set(TARGET_NAME "GameTemplate")

include(FetchContent)
FetchContent_Declare(
    Hiber3D_zip
    DOWNLOAD_EXTRACT_TIMESTAMP FALSE
    URL https://cdn.hiberworld.com/hiber2/web/hiberik-quick-js-ng/v0.115.0-hiberik-quick-js-ng/Hiber3D_v0.115.0-hiberik-quick-js-ng.0%2Be068c7841.zip
)
FetchContent_MakeAvailable(Hiber3D_zip)

# Executable (Desktop for IDE auto-complete + Emscripten for web build)
set(GAME_FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Main.cpp

    
    ${CMAKE_CURRENT_SOURCE_DIR}/game/AnimationLoadout/Animated/AnimatedEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/AnimationLoadout/Animated/AnimatedModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/AnimationLoadout/Animated/AnimatedModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/AnimationLoadout/Animated/AnimatedTypes.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/AnimationLoadout/AnimationLoadoutEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/AnimationLoadout/AnimationLoadoutModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/AnimationLoadout/AnimationLoadoutModule.cpp
    
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Broadcast/BroadcastEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Broadcast/BroadcastModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Broadcast/BroadcastModule.cpp
    
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Input/InputEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Input/InputModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Input/InputModule.cpp

    ${CMAKE_CURRENT_SOURCE_DIR}/game/Path/PathEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Path/PathModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Path/PathModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Path/PathTypes.hpp
    
    ${CMAKE_CURRENT_SOURCE_DIR}/game/RoboRun/RoboRunEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/RoboRun/RoboRunModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/RoboRun/RoboRunModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/RoboRun/RoboRunTypes.hpp
    
    ${CMAKE_CURRENT_SOURCE_DIR}/game/ChangeableScene/ChangeableSceneEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/ChangeableScene/ChangeableSceneModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/ChangeableScene/ChangeableSceneModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/ChangeableScene/ChangeableSceneTypes.hpp

    ${CMAKE_CURRENT_SOURCE_DIR}/game/Segment/SegmentEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Segment/SegmentModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Segment/SegmentModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Segment/SegmentTypes.hpp
)

hiber3d_add_game(GameTemplate "${GAME_FILES}")
target_include_directories(GameTemplate PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/game)

if(DEFINED EMSCRIPTEN)
    hiber3d_game_add_interop(GameTemplate)
endif()
