#pragma once

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>
#include <Hiber3D/Math/LinalgTypes.hpp>

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
