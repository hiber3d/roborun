#include "ChangeableSceneEvents.hpp"
#include "ChangeableSceneModule.hpp"
#include "ChangeableSceneTypes.hpp"

#include <Hiber3D/Asset/AssetServer.hpp>
#include <Hiber3D/Core/Name.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Hierarchy/Hierarchy.hpp>
#include <Hiber3D/Hierarchy/HierarchyComponents.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scene/SceneRoot.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>

#include <RoboRun/RoboRunEvents.hpp>

// --- TYPES ---

struct LoadingChangingScene {
    bool                                 loading     = false;
    Hiber3D::AssetHandle<Hiber3D::Scene> sceneHandle = Hiber3D::AssetHandle<Hiber3D::Scene>::Invalid();
};

// --- HELPERS ---

static void switchToScene(
    Hiber3D::Registry&                       registry,
    Hiber3D::View<ChangeableScene>           changeableScenes,
    Hiber3D::Singleton<LoadingChangingScene> loadingChangingScene,
    Hiber3D::AssetHandle<Hiber3D::Scene>     sceneHandle) {
    // LOG_INFO("ChangeableSceneModule::switchToScene - Switching to scene:'{}'", static_cast<uint32_t>(sceneHandle.handle));
    for (auto [entity] : changeableScenes.each()) {
        for (auto child : registry.getOrEmplace<Hiber3D::Children>(entity)->entities) {
            // LOG_INFO("ChangeableSceneModule::switchToScene - Destroying child:'{}'", static_cast<uint32_t>(child));
            destroyEntityWithChildrenRecursive(registry, child);
        }
        const auto newChild = createEntityAsChild(registry, entity);
        registry.emplace<Hiber3D::Transform>(newChild);
        registry.emplace<Hiber3D::Name>(newChild, Hiber3D::FixedString<64>{"ChangeableSceneRoot"});
        registry.emplace<Hiber3D::SceneRoot>(newChild, Hiber3D::SceneRoot{.scene = sceneHandle});
    }
    loadingChangingScene->loading = false;
}

// --- SYSTEMS ---

static void resetSingletons(
    Hiber3D::Singleton<LoadingChangingScene> loadingChangingScene) {
    *loadingChangingScene = LoadingChangingScene{};
}

static void handleChangeScene(
    Hiber3D::Registry&                        registry,
    Hiber3D::View<ChangeableScene>            changeableScenes,
    Hiber3D::EventView<ChangeScene>           events,
    Hiber3D::Singleton<Hiber3D::AssetServer>  assetServer,
    Hiber3D::Singleton<LoadingChangingScene>  loadingChangingScene,
    Hiber3D::EventWriter<FadeToBlack>&        fadeToBlackWriter,
    Hiber3D::EventWriter<FadeToAndFromBlack>& fadeToAndFromBlackWriter) {
    for (const auto& event : events) {
        // LOG_INFO("ChangeableSceneModule::handleChangeScene - Received path:'{}', currently at:'{}'", event.path, static_cast<uint32_t>(loadingChangingScene->sceneHandle.handle));
        if (loadingChangingScene->loading == false) {
            const auto& newScene              = assetServer->load<Hiber3D::Scene>(Hiber3D::AssetPath{event.path});
            loadingChangingScene->loading     = true;
            loadingChangingScene->sceneHandle = newScene;

            const auto& loadState = assetServer->getLoadState(newScene.toUntyped());
            const bool  isLoaded  = loadState == Hiber3D::AssetLoadState::LOADED;
            // LOG_INFO("ChangeableSceneModule::handleChangeScene - Loading scene:'{}', path:'{}', loadState:'{}'", static_cast<uint32_t>(newScene.handle), event.path, static_cast<uint32_t>(loadState));
            if (isLoaded) {
                // LOG_INFO("ChangeableSceneModule::handleChangeScene - Fetching cached scene:'{}'", static_cast<uint32_t>(newScene.handle));
                switchToScene(registry, changeableScenes, loadingChangingScene, newScene);
                fadeToAndFromBlackWriter.writeEvent(FadeToAndFromBlack{});
            } else {
                // LOG_INFO("ChangeableSceneModule::handleChangeScene - Started loading scene:'{}'", static_cast<uint32_t>(newScene.handle));
                fadeToBlackWriter.writeEvent(FadeToBlack{});
            }
        }
    }
}

static void pollSceneLoadedWithDependencies(
    Hiber3D::Registry&                       registry,
    Hiber3D::View<ChangeableScene>           changeableScenes,
    Hiber3D::Singleton<Hiber3D::AssetServer> assetServer,
    Hiber3D::Singleton<LoadingChangingScene> loadingChangingScene,
    Hiber3D::EventWriter<FadeFromBlack>&     fadeFromBlackWriter) {
    if (loadingChangingScene->loading == true) {
        const auto& loadStateWithDependencies = assetServer->getLoadedWithDependenciesStatus(loadingChangingScene->sceneHandle.toUntyped());
        if (loadStateWithDependencies == Hiber3D::AssetLoadedWithDependencyStatus::LOADED) {
            switchToScene(registry, changeableScenes, loadingChangingScene, loadingChangingScene->sceneHandle);
            fadeFromBlackWriter.writeEvent(FadeFromBlack{});
            // LOG_INFO("ChangeableSceneModule::pollSceneLoadedWithDependencies - Loading scene:'{}', loadStateWithDependencies:'{}'", static_cast<uint32_t>(loadingChangingScene->sceneHandle.handle), static_cast<uint32_t>(loadStateWithDependencies));
        }
    }
}

void ChangeableSceneModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_EXIT, resetSingletons);
    context.addSystem(Hiber3D::Schedule::ON_TICK, handleChangeScene);
    context.addSystem(Hiber3D::Schedule::ON_TICK, pollSceneLoadedWithDependencies);

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