#pragma once

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>
#include <Hiber3D/Math/LinalgTypes.hpp>
#include <Hiber3D/Math/Quaternion.hpp>

struct OnPath {
    bool dummy;
};

HIBER3D_REFLECT(HIBER3D_TYPE(OnPath), HIBER3D_MEMBER(dummy));

struct TiltFactor {
    float factor = 0;
};

HIBER3D_REFLECT(HIBER3D_TYPE(TiltFactor), HIBER3D_MEMBER(factor));

struct Stats {
    float points       = 0.0f;
    float meters       = 0.0f;
    float multiplier   = 1.0f;
    int   collectibles = 0;
};

HIBER3D_REFLECT(HIBER3D_TYPE(Stats), HIBER3D_MEMBER(points), HIBER3D_MEMBER(meters), HIBER3D_MEMBER(multiplier), HIBER3D_MEMBER(collectibles));

struct SplineData {
    Hiber3D::float3     position;
    Hiber3D::Quaternion rotation;
};

HIBER3D_REFLECT(HIBER3D_TYPE(SplineData), HIBER3D_MEMBER(position), HIBER3D_MEMBER(rotation));
