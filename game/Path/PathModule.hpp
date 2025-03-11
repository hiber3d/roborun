#pragma once

#include <Hiber3D/Hiber3D.hpp>

// Movement related to functionality of entities following the spline path
class PathModule : public Hiber3D::Module {
public:
    void onRegister(Hiber3D::InitContext& context) override;
};