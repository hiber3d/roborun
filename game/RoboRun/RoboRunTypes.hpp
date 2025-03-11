#pragma once

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>
#include <Hiber3D/Math/LinalgTypes.hpp>
#include <Hiber3D/Math/Quaternion.hpp>

struct Step {
    int   indexForward    = -1;
    int   indexLeft       = -1;
    int   indexRight      = -1;
    float laneOffsetLeft  = 1.0f;
    float laneOffsetRight = 1.0f;
    float wallOffsetLeft  = 1.5f;
    float wallOffsetRight = 1.5f;
};

HIBER3D_REFLECT(HIBER3D_TYPE(Step), HIBER3D_MEMBER(indexForward), HIBER3D_MEMBER(indexLeft), HIBER3D_MEMBER(indexRight), HIBER3D_MEMBER(laneOffsetLeft), HIBER3D_MEMBER(laneOffsetRight), HIBER3D_MEMBER(wallOffsetLeft), HIBER3D_MEMBER(wallOffsetRight));

struct SegmentScene {
    Hiber3D::Entity prev;
    Hiber3D::Entity next;
};

HIBER3D_REFLECT(HIBER3D_TYPE(SegmentScene), HIBER3D_MEMBER(prev), HIBER3D_MEMBER(next));

struct SegmentsState {
    Hiber3D::Entity segmentsSceneEntity       = Hiber3D::NULL_ENTITY;
    Hiber3D::Entity currentSegmentSceneEntity = Hiber3D::NULL_ENTITY;
    int             currentStepIndex          = 0;
    float           distanceFromCurrentStep   = 0.0f;  // TODO: Easy to forget resetting this
};

HIBER3D_REFLECT(HIBER3D_TYPE(SegmentsState), HIBER3D_MEMBER(segmentsSceneEntity), HIBER3D_MEMBER(currentSegmentSceneEntity), HIBER3D_MEMBER(currentStepIndex), HIBER3D_MEMBER(distanceFromCurrentStep));

struct OnPath {
    bool dummy;
};

HIBER3D_REFLECT(HIBER3D_TYPE(OnPath), HIBER3D_MEMBER(dummy));

struct AutoTurn {
    bool dummy;
};

HIBER3D_REFLECT(HIBER3D_TYPE(AutoTurn), HIBER3D_MEMBER(dummy));


struct Jumping {
    float deltaHeight;
    float startHeight;
    float timeSinceJumped = 0.0f;
};

HIBER3D_REFLECT(HIBER3D_TYPE(Jumping), HIBER3D_MEMBER(deltaHeight), HIBER3D_MEMBER(startHeight), HIBER3D_MEMBER(timeSinceJumped));

struct Diving {
    bool dummy;
};

HIBER3D_REFLECT(HIBER3D_TYPE(Diving), HIBER3D_MEMBER(dummy));

struct Sliding {
    bool dummy;
};

HIBER3D_REFLECT(HIBER3D_TYPE(Sliding), HIBER3D_MEMBER(dummy));

struct Stats {
    float points       = 0.0f;
    float meters       = 0.0f;
    float multiplier   = 1.0f;
    int   collectibles = 0;
};

HIBER3D_REFLECT(HIBER3D_TYPE(Stats), HIBER3D_MEMBER(points), HIBER3D_MEMBER(meters), HIBER3D_MEMBER(multiplier), HIBER3D_MEMBER(collectibles));

struct SplineData {
    Hiber3D::float3 position;
    Hiber3D::Quaternion rotation;
};

HIBER3D_REFLECT(HIBER3D_TYPE(SplineData), HIBER3D_MEMBER(position), HIBER3D_MEMBER(rotation));

// TODO: Split when necessary
struct GameState {
    float           difficulty   = 0.0f;
    float           tiltFactor   = 0.0f;
    bool            paused       = true;
    bool            alive        = true;
    bool            onPath       = true;
    Hiber3D::Entity playerEntity = Hiber3D::NULL_ENTITY;
    Hiber3D::float3 direction    = Hiber3D::float3{0.0f, 0.0f, -1.0f};
};

HIBER3D_REFLECT(HIBER3D_TYPE(GameState), HIBER3D_MEMBER(difficulty), HIBER3D_MEMBER(tiltFactor), HIBER3D_MEMBER(paused), HIBER3D_MEMBER(onPath), HIBER3D_MEMBER(alive), HIBER3D_MEMBER(playerEntity), HIBER3D_MEMBER(direction));
