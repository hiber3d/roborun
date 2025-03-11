#pragma once

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>

// Sent when player reaches a new Step
struct NewStepEvent {
};

HIBER3D_REFLECT(HIBER3D_TYPE(NewStepEvent));

// Sent when player reaches a new Segment
struct NewSegmentEvent {
};

HIBER3D_REFLECT(HIBER3D_TYPE(NewSegmentEvent));