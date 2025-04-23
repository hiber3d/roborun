#include <AnimationLoadout/AnimationLoadoutModule.hpp>
#include <Broadcast/BroadcastModule.hpp>
#include <Input/InputModule.hpp>
#include <Path/PathModule.hpp>
#include <ChangeableScene/ChangeableSceneModule.hpp>
#include <Segment/SegmentModule.hpp>

#include <Hiber3D/Animation/AnimationModule.hpp>
#include <Hiber3D/Asset/AssetModule.hpp>
#include <Hiber3D/BaseAssets/Cubemap.hpp>
#include <Hiber3D/BaseAssets/Material.hpp>
#include <Hiber3D/BaseAssets/Mesh.hpp>
#include <Hiber3D/Core/InitContext.hpp>
#include <Hiber3D/Core/KeyEvent.hpp>
#include <Hiber3D/Core/Name.hpp>
#include <Hiber3D/Debug/DebugModule.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Gltf/GltfModule.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Hierarchy/Hierarchy.hpp>
#include <Hiber3D/Hierarchy/HierarchyComponents.hpp>
#include <Hiber3D/Hierarchy/HierarchyModule.hpp>
#include <Hiber3D/Input/InputModule.hpp>
#include <Hiber3D/Input/Types.hpp>
#include <Hiber3D/Interop/InteropModule.hpp>
#include <Hiber3D/Log/LogModule.hpp>
#include <Hiber3D/Physics/PhysicsModule.hpp>
#include <Hiber3D/Renderer/Camera.hpp>
#include <Hiber3D/Renderer/Light.hpp>
#include <Hiber3D/Renderer/RenderModule.hpp>
#include <Hiber3D/RmlUi/RmlUiModule.hpp>
#include <Hiber3D/Scene/SceneManager.hpp>
#include <Hiber3D/Scene/SceneManagerModule.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>
#include <Hiber3D/Scripting/ScriptInstance.hpp>
#include <Hiber3D/Skinning/SkinningModule.hpp>
#include <Hiber3D/WorldTransform/ComputedWorldTransform.hpp>
#include <Hiber3D/WorldTransform/WorldTransformModule.hpp>

#include <RoboRun/RoboRunModule.hpp>
#include <stdio.h>

class MainModule : public Hiber3D::Module {
public:
    // TODO: Remove when we have proper config handling
    bool enableWatcher = true;
    MainModule(int argc, char* argv[]) {
        for (int i = 0; i < argc; i++) {
            if (strcmp(argv[i], "Assets.EnableWatcher=false") == 0) {
                enableWatcher = false;
                break;
            }
        }
    }

    void onRegister(Hiber3D::InitContext& context) override {
        context.registerModule<Hiber3D::AssetModule>(Hiber3D::AssetModuleSettings{.defaultReaderAssetPath = "", .defaultWriterAssetPath = "", .enableWatcher = enableWatcher});
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::Mesh>(context);
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::StandardMaterial>(context);
        context.getModule<Hiber3D::AssetModule>().registerAssetType<Hiber3D::Cubemap>(context);

        context.registerModule<Hiber3D::LogModule>(Hiber3D::LogSettings{.logLevel = Hiber3D::LogLevel::INFO});
        context.registerModule<Hiber3D::HierarchyModule>();

        context.registerModule<Hiber3D::SceneModule>();
        context.getModule<Hiber3D::SceneModule>().registerComponent<Hiber3D::ScriptInstance>(context);

        context.registerModule<Hiber3D::SceneManagerModule>(Hiber3D::SceneManagerSettings{.defaultScene = "scenes/RoboRun.scene"});
        context.registerModule<Hiber3D::PhysicsModule>(); // before WorldTransformModule
        context.registerModule<Hiber3D::GltfModule>();
        context.registerModule<Hiber3D::WorldTransformModule>();
        context.registerModule<Hiber3D::AnimationModule>();  // after HierarchyModule
        context.registerModule<Hiber3D::SkinningModule>();   // after SceneModule
        context.registerModule<Hiber3D::RenderModule>(Hiber3D::RenderModuleSettings{.shadowsEnabled = false});

        context.registerModule<Hiber3D::JavaScriptScriptingModule>();
        context.registerModule<Hiber3D::RmlUiModule>();
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::Transform>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::ComputedWorldTransform>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::SceneRoot>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::ScriptInstance>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::Children>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::Parent>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::Camera>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::Name>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<Hiber3D::AnimationBlend>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<Hiber3D::CollisionStarted>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<Hiber3D::CollisionPersisted>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerFunction<[](const Hiber3D::Registry& registry, Hiber3D::Key key) { return registry.singleton<const Hiber3D::KeyboardState>().isPressed(key); }>(context, "keyIsPressed");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerFunction<[](const Hiber3D::Registry& registry, Hiber3D::Key key) { return registry.singleton<const Hiber3D::KeyboardState>().justPressed(key); }>(context, "keyJustPressed");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerFunction<[](const Hiber3D::Registry& registry, Hiber3D::Key key) { return registry.singleton<const Hiber3D::KeyboardState>().justReleased(key); }>(context, "keyJustReleased");
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerFunction<[](Hiber3D::Registry& registry, Hiber3D::Entity entity) { return createEntityAsChild(registry, entity); }>(context, "createEntityAsChild");

        context.registerModule<Hiber3D::InteropModule>();
        context.registerModule<Hiber3D::DebugModule>();
        context.registerModule<Hiber3D::InputModule>();
        context.registerModule<Hiber3D::EditorModule>(Hiber3D::EditorModuleSettings{.startInPlayMode = true});

        // Custom modules
        context.registerModule<AnimationLoadoutModule>();
        context.registerModule<BroadcastModule>();
        context.registerModule<InputModule>();
        context.registerModule<RoboRunModule>();
        context.registerModule<PathModule>();
        context.registerModule<ChangeableSceneModule>();
        context.registerModule<SegmentModule>();
    }
};

int main(int argc, char* argv[]) {
    Hiber3D::run("GameTemplate", std::make_unique<MainModule>(argc, argv), Hiber3D::ApplicationRunMode::GraphicalApp, argc, argv);
    return 0;
}
