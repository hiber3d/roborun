#pragma once

#include <Hiber3D/Hiber3D.hpp>

// Used for broadcasting specific state to web layer - should not affect simulation
class AudioModule : public Hiber3D::Module {
public:
    void onRegister(Hiber3D::InitContext& context) override;
};