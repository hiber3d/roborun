#pragma once

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>

#include <string>

// ------ RAW -----

struct SwipedLeft {
};

HIBER3D_REFLECT(HIBER3D_TYPE(SwipedLeft));
HIBER3D_INTEROP_RECEIVE_FROM_JS(SwipedLeft);

struct SwipedRight {
};

HIBER3D_REFLECT(HIBER3D_TYPE(SwipedRight));
HIBER3D_INTEROP_RECEIVE_FROM_JS(SwipedRight);

struct SwipedUp {
};

HIBER3D_REFLECT(HIBER3D_TYPE(SwipedUp));
HIBER3D_INTEROP_RECEIVE_FROM_JS(SwipedUp);

struct SwipedDown {
};

HIBER3D_REFLECT(HIBER3D_TYPE(SwipedDown));
HIBER3D_INTEROP_RECEIVE_FROM_JS(SwipedDown);

struct LeftTapped {
};

HIBER3D_REFLECT(HIBER3D_TYPE(LeftTapped));
HIBER3D_INTEROP_RECEIVE_FROM_JS(LeftTapped);

struct RightTapped {
};

HIBER3D_REFLECT(HIBER3D_TYPE(RightTapped));
HIBER3D_INTEROP_RECEIVE_FROM_JS(RightTapped);

// ----- BINDINGS -----

struct StartInput {};
HIBER3D_REFLECT(HIBER3D_TYPE(StartInput));
HIBER3D_INTEROP_RECEIVE_FROM_JS(StartInput);
struct PauseInput {};
HIBER3D_REFLECT(HIBER3D_TYPE(PauseInput));
struct UnpauseInput {};
HIBER3D_REFLECT(HIBER3D_TYPE(UnpauseInput));
struct RestartInput {};
HIBER3D_REFLECT(HIBER3D_TYPE(RestartInput));
struct LeftLaneInput {};
HIBER3D_REFLECT(HIBER3D_TYPE(LeftLaneInput));
struct RightLaneInput {};
HIBER3D_REFLECT(HIBER3D_TYPE(RightLaneInput));
struct JumpInput {};
HIBER3D_REFLECT(HIBER3D_TYPE(JumpInput));
struct DiveInput {};
HIBER3D_REFLECT(HIBER3D_TYPE(DiveInput));
struct SlideInput {};
HIBER3D_REFLECT(HIBER3D_TYPE(SlideInput));
struct TurnLeftInput {};
HIBER3D_REFLECT(HIBER3D_TYPE(TurnLeftInput));
struct TurnRightInput {};
HIBER3D_REFLECT(HIBER3D_TYPE(TurnRightInput));