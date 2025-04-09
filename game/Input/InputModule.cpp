#include "InputEvents.hpp"
#include "InputModule.hpp"

#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>

void InputModule::onRegister(Hiber3D::InitContext& context) {
    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<SwipedLeft>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<SwipedRight>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<SwipedUp>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<SwipedDown>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<LeftTapped>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<RightTapped>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<StartInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<PauseInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<UnpauseInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<RestartInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<LeftLaneInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<RightLaneInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<JumpInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<DiveInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<SlideInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<TurnLeftInput>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<TurnRightInput>(context);
    }
}
