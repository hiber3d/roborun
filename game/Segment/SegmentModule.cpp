#include "SegmentEvents.hpp"
#include "SegmentModule.hpp"
#include "SegmentTypes.hpp"

#include <RoboRun/RoboRunEvents.hpp>

#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>
#include <Hiber3D/Scripting/ScriptInstance.hpp>


static void resetSingletons(
    Hiber3D::Singleton<SegmentsState> segmentsState) {
    *segmentsState = SegmentsState{};
}

static void handleGameRestarted(
    Hiber3D::EventView<GameRestarted> events,
    Hiber3D::Singleton<SegmentsState> segmentsState) {
    for (const auto& event : events) {
        resetSingletons(segmentsState);
        return;
    }
}

void SegmentModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_EXIT, resetSingletons);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleGameRestarted);

    context.registerSingleton<SegmentsState>();

    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        context.getModule<Hiber3D::EditorModule>().registerComponent<SegmentScene>(context);
        context.getModule<Hiber3D::EditorModule>().registerComponent<Step>(context);
    }

    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerSingleton<SegmentsState>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<SegmentScene>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Step>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<NewStepEvent>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<NewSegmentEvent>(context);
    }

    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        context.getModule<Hiber3D::SceneModule>().registerComponent<SegmentScene>(context);
        context.getModule<Hiber3D::SceneModule>().registerComponent<Step>(context);
    }
}
