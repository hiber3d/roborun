#pragma once

#include <Hiber3D/Hiber3D.hpp>

// For input related types and events
class InputModule : public Hiber3D::Module {
public:
    void onRegister(Hiber3D::InitContext& context) override;
};