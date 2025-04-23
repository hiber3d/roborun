#pragma once

#include <Hiber3D/Hiber3D.hpp>

// For the custom wrapped game scene
class ChangeableSceneModule : public Hiber3D::Module {
public:
    void onRegister(Hiber3D::InitContext& context) override;
};