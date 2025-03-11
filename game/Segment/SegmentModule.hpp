#pragma once

#include <Hiber3D/Hiber3D.hpp>

// FOr everything related to Segments and Steps
class SegmentModule : public Hiber3D::Module {
public:
    void onRegister(Hiber3D::InitContext& context) override;
};