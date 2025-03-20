#pragma once

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>

struct JumpedEvent {
    Hiber3D::Entity entity;
};

HIBER3D_REFLECT(HIBER3D_TYPE(JumpedEvent), HIBER3D_MEMBER(entity));
HIBER3D_INTEROP_SEND_TO_JS(JumpedEvent);

struct LandedEvent {
    Hiber3D::Entity entity;
};

HIBER3D_REFLECT(HIBER3D_TYPE(LandedEvent), HIBER3D_MEMBER(entity));
HIBER3D_INTEROP_SEND_TO_JS(LandedEvent);

struct TiltedEvent {};

HIBER3D_REFLECT(HIBER3D_TYPE(TiltedEvent));
HIBER3D_INTEROP_SEND_TO_JS(TiltedEvent);

struct SlidedEvent {};

HIBER3D_REFLECT(HIBER3D_TYPE(SlidedEvent));
HIBER3D_INTEROP_SEND_TO_JS(SlidedEvent);

struct TurnedEvent {};

HIBER3D_REFLECT(HIBER3D_TYPE(TurnedEvent));
HIBER3D_INTEROP_SEND_TO_JS(TurnedEvent);
