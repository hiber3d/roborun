#pragma once

#include <Hiber3D/Hiber3D.hpp>

// Wraps the animation API
class AnimationLoadoutModule : public Hiber3D::Module {
public:
    void onRegister(Hiber3D::InitContext& context) override;
};