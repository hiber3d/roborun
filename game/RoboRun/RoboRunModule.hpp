#pragma once

#include <Hiber3D/Hiber3D.hpp>

// For everything not yet in its own module
class RoboRunModule : public Hiber3D::Module {
public:
    void onRegister(Hiber3D::InitContext& context) override;
};