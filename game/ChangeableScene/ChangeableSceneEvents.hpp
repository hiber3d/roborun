#pragma once

#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Interop/Defines.hpp>

#include <string>

struct ChangeScene {
    std::string path;
};

HIBER3D_REFLECT(HIBER3D_TYPE(ChangeScene), HIBER3D_MEMBER(path));


struct FadeToBlack {
    bool dummy;
};

HIBER3D_REFLECT(HIBER3D_TYPE(FadeToBlack), HIBER3D_MEMBER(dummy));

struct FadeFromBlack {
    bool dummy;
};

HIBER3D_REFLECT(HIBER3D_TYPE(FadeFromBlack), HIBER3D_MEMBER(dummy));

struct FadeToAndFromBlack {
	bool dummy;
};
HIBER3D_REFLECT(HIBER3D_TYPE(FadeToAndFromBlack), HIBER3D_MEMBER(dummy));