cmake_minimum_required(VERSION 3.11 FATAL_ERROR)


project("GameTemplate" LANGUAGES CXX C)
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 20)
set(TARGET_NAME "GameTemplate")

include(FetchContent)
FetchContent_Declare(
    Hiber3D_zip
    DOWNLOAD_EXTRACT_TIMESTAMP TRUE
    URL https://storage.googleapis.com/bkt-hiberworld-cdn-prod/hiber2/web/hib-33640-reflect-touch/v1.103.0-hib-33640-reflect-touch/Hiber3D_v1.103.0-hib-33640-reflect-touch.0%2B9ea57a39b.zip
)
FetchContent_MakeAvailable(Hiber3D_zip)

# Executable (Desktop for IDE auto-complete + Emscripten for web build)
set(GAME_FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Main.cpp

    ${CMAKE_CURRENT_SOURCE_DIR}/game/Animated/AnimatedEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Animated/AnimatedModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Animated/AnimatedModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Animated/AnimatedTypes.hpp
    
    ${CMAKE_CURRENT_SOURCE_DIR}/game/RoboRun/InputEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/RoboRun/RoboRunEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/RoboRun/RoboRunModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/RoboRun/RoboRunModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/RoboRun/RoboRunTypes.hpp
)

hiber3d_add_game(GameTemplate "${GAME_FILES}")
hiber3d_game_include_directories(GameTemplate ${CMAKE_CURRENT_SOURCE_DIR}/game)

if(DEFINED EMSCRIPTEN)
    hiber3d_game_add_interop(GameTemplate)
endif()
