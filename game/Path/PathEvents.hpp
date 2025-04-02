#pragma once

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>

struct JumpedEvent {
    Hiber3D::Entity entity;
};

HIBER3D_REFLECT(HIBER3D_TYPE(JumpedEvent), HIBER3D_MEMBER(entity));
HIBER3D_INTEROP_SEND_TO_JS(JumpedEvent);

struct DivedEvent {
    Hiber3D::Entity entity;
};

HIBER3D_REFLECT(HIBER3D_TYPE(DivedEvent), HIBER3D_MEMBER(entity));
HIBER3D_INTEROP_SEND_TO_JS(DivedEvent);

struct LandedEvent {
    Hiber3D::Entity entity;
};

HIBER3D_REFLECT(HIBER3D_TYPE(LandedEvent), HIBER3D_MEMBER(entity));
HIBER3D_INTEROP_SEND_TO_JS(LandedEvent);
