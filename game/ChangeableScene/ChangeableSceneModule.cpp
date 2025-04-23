#include "ChangeableSceneEvents.hpp"
#include "ChangeableSceneModule.hpp"
#include "ChangeableSceneTypes.hpp"

#include <RoboRun/RoboRunEvents.hpp>

#include <Hiber3D/Asset/AssetServer.hpp>
#include <Hiber3D/Core/Name.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Hierarchy/Hierarchy.hpp>
#include <Hiber3D/Hierarchy/HierarchyComponents.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scene/SceneRoot.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>

// --- TYPES ---

struct LoadingChangingScene {
    bool                                 loading     = false;
    Hiber3D::AssetHandle<Hiber3D::Scene> sceneHandle = Hiber3D::AssetHandle<Hiber3D::Scene>::Invalid();
};

// --- HELPERS ---

static void switchToScene(
    Hiber3D::Registry&                        registry,
    Hiber3D::View<ChangeableScene>            changeableScenes,
    Hiber3D::Singleton<LoadingChangingScene>  loadingChangingScene,
    Hiber3D::AssetHandle<Hiber3D::Scene>      sceneHandle) {
    //LOG_INFO("ChangeableSceneModule::switchToScene - Switching to scene:'{}'", static_cast<uint32_t>(sceneHandle.handle));
    for (auto [entity] : changeableScenes.each()) {

       for (auto child : registry.getOrEmplace<Hiber3D::Children>(entity).entities) {
            //LOG_INFO("ChangeableSceneModule::switchToScene - Destroying child:'{}'", static_cast<uint32_t>(child));
            destroyEntityWithChildrenRecursive(registry, child);
        }
        const auto newChild = createEntityAsChild(registry, entity);
        registry.emplace<Hiber3D::Transform>(newChild);
        registry.emplace<Hiber3D::Name>(newChild, Hiber3D::FixedString<64>{"ChangeableSceneRoot"});
        registry.emplace<Hiber3D::SceneRoot>(newChild, Hiber3D::SceneRoot{.scene = sceneHandle});
        
    }
    *loadingChangingScene = LoadingChangingScene{};
}

// --- SYSTEMS ---

static void handleChangeScene(
    Hiber3D::Registry&                       registry,
    Hiber3D::View<ChangeableScene>           changeableScenes,
    Hiber3D::EventView<ChangeScene>          events,
    Hiber3D::Singleton<Hiber3D::AssetServer> assetServer,
    Hiber3D::Singleton<LoadingChangingScene> loadingChangingScene,
    Hiber3D::EventWriter<FadeToBlack>&        fadeToBlackWriter,
    Hiber3D::EventWriter<FadeToAndFromBlack>& fadeToAndFromBlackWriter) {
    for (const auto& event : events) {
        if (loadingChangingScene->loading == false) {
            //LOG_INFO("ChangeableSceneModule::handleChangeScene - Currently at scene:'{}'", static_cast<uint32_t>(loadingChangingScene->sceneHandle.handle));
            loadingChangingScene->loading     = true;
            loadingChangingScene->sceneHandle = assetServer->load<Hiber3D::Scene>(Hiber3D::AssetPath{event.path});

            const auto& loadState = assetServer->getLoadedWithDependenciesStatus(loadingChangingScene->sceneHandle.toUntyped());
            const bool  isLoaded  = loadState == Hiber3D::AssetLoadedWithDependencyStatus::LOADED;
            //LOG_INFO("ChangeableSceneModule::handleChangeScene - Scene load state:'{}' of scene:'{}'", static_cast<uint32_t>(loadState), static_cast<uint32_t>(loadingChangingScene->sceneHandle.handle));
            if (isLoaded) {
                //LOG_INFO("ChangeableSceneModule::handleChangeScene - Fetching cached scene:'{}'", static_cast<uint32_t>(loadingChangingScene->sceneHandle.handle));
                switchToScene(registry, changeableScenes, loadingChangingScene, loadingChangingScene->sceneHandle);
                fadeToAndFromBlackWriter.writeEvent(FadeToAndFromBlack{});
            } else {
                //LOG_INFO("ChangeableSceneModule::handleChangeScene - Started loading scene:'{}'", static_cast<uint32_t>(loadingChangingScene->sceneHandle.handle));
                fadeToBlackWriter.writeEvent(FadeToBlack{});
            }
        }
    }
}

static void onChangingSceneLoaded(
    Hiber3D::Registry&                                      registry,
    Hiber3D::EventView<Hiber3D::AssetEvent<Hiber3D::Scene>> assetEvents,
    Hiber3D::View<ChangeableScene>                          changeableScenes,
    Hiber3D::Singleton<LoadingChangingScene>                loadingChangingScene,
    Hiber3D::EventWriter<FadeFromBlack>&                    fadeFromBlackWriter) {
    for (const auto& event : assetEvents) {
        if (event.handle == loadingChangingScene->sceneHandle && event.handle != Hiber3D::AssetHandle<Hiber3D::Scene>::Invalid()) {
            //LOG_INFO("ChangeableSceneModule::onChangingSceneLoaded - Asset event for scene '{}' of type '{}'", static_cast<uint32_t>(event.handle), static_cast<uint32_t>(event.type));

            if (event.type == Hiber3D::AssetEventType::LOADED_WITH_DEPENDENCIES) {
                //LOG_INFO("ChangeableSceneModule::onChangingSceneLoaded - Finished loading scene:'{}'", static_cast<uint32_t>(event.handle));
                switchToScene(registry, changeableScenes, loadingChangingScene, event.handle);
                fadeFromBlackWriter.writeEvent(FadeFromBlack{});
            }
        }
    }
}

void ChangeableSceneModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleChangeScene);
    context.addSystem(Hiber3D::Schedule::ON_TICK, onChangingSceneLoaded);

    context.registerSingleton<LoadingChangingScene>();

    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        context.getModule<Hiber3D::EditorModule>().registerComponent<ChangeableScene>(context);
    }

    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<ChangeScene>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<FadeToBlack>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<FadeFromBlack>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<FadeToAndFromBlack>(context);
    }

    if (context.isModuleRegistered<Hiber3D::SceneModule>()) {
        context.getModule<Hiber3D::SceneModule>().registerComponent<ChangeableScene>(context);
    }
}