#pragma once

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>
#include <Hiber3D/Math/LinalgTypes.hpp>
#include <Hiber3D/Math/Quaternion.hpp>

// OBS: Duplicate in AutoRunTemp.js
enum AutoRunStage {
    UNDEFINED = 0,
    ASCEND,
    MAX_HEIGHT,
    DIP,
    DESCEND,
    GROUNDED
};

struct OnPath {
    bool dummy;
};

HIBER3D_REFLECT(HIBER3D_TYPE(OnPath), HIBER3D_MEMBER(dummy));

struct AutoRun {
    AutoRunStage stage = ASCEND;
    float        startingHeight;
    float        startingGroundHeight;
    float        timeSinceStarted = 0.0f;
};

HIBER3D_REFLECT(HIBER3D_TYPE(AutoRun), HIBER3D_MEMBER(stage), HIBER3D_MEMBER(startingHeight), HIBER3D_MEMBER(startingGroundHeight), HIBER3D_MEMBER(timeSinceStarted));

struct Magnet {
	float timeSinceStarted = 0.0f;
};

HIBER3D_REFLECT(HIBER3D_TYPE(Magnet), HIBER3D_MEMBER(timeSinceStarted));

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
