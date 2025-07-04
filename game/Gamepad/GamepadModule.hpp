#pragma once

#include <Hiber3D/Core/InitContext.hpp>
#include <Hiber3D/Hiber3D.hpp>

class GamepadModule : public Hiber3D::Module {
public:
    void onRegister(Hiber3D::InitContext& context) override;
};
