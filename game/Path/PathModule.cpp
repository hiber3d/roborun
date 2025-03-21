#include "PathEvents.hpp"
#include "PathModule.hpp"
#include "PathTypes.hpp"

#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>
#include <Hiber3D/Scripting/ScriptInstance.hpp>

void PathModule::onRegister(Hiber3D::InitContext& context) {
    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        context.getModule<Hiber3D::EditorModule>().registerComponent<SplineData>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<OnPath>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<AutoRun>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<Magnet>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<Jumping>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<Diving>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<Sliding>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<TiltFactor>(context);
    }

    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Stats>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<SplineData>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<OnPath>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<AutoRun>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Magnet>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Jumping>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Diving>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Sliding>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<TiltFactor>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<JumpedEvent>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<LandedEvent>(context);
    }

    if (context.isModuleRegistered<Hiber3D::SceneModule>()) {
        context.getModule<Hiber3D::SceneModule>().registerComponent<SplineData>(context);
    }
}
