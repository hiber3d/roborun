#include "VisualEffectsModule.hpp"

#include <Hiber3D/Asset/Assets.hpp>
#include <Hiber3D/Asset/AssetServer.hpp>
#include <Hiber3D/BaseAssets/Material.hpp>
#include <Hiber3D/Core/InitContext.hpp>
#include <Hiber3D/Gltf/GltfAsset.hpp>
#include <Hiber3D/Gltf/GltfLabel.hpp>
#include <Hiber3D/Hiber3D.hpp>

#include <RoboRun/RoboRunTypes.hpp>

// Name of material: "Dynamic_outline_material"
constexpr auto SEGMENT_PATH = "glbs/segments/Segment_straight_A.glb";

struct VisualEffectsState {
    Hiber3D::AssetHandle<Hiber3D::StandardMaterial> segmentPowerUpMaterial;
    Hiber3D::AssetHandle<Hiber3D::Texture>          segmentPowerUpDefaultTexture;
    Hiber3D::AssetHandle<Hiber3D::Texture>          segmentPowerUpActiveTexture;

    Hiber3D::AssetHandle<Hiber3D::StandardMaterial> testMaterial0;
    Hiber3D::AssetHandle<Hiber3D::StandardMaterial> testMaterial1;
    Hiber3D::AssetHandle<Hiber3D::StandardMaterial> testMaterial2;
    Hiber3D::AssetHandle<Hiber3D::StandardMaterial> testMaterial3;
    Hiber3D::AssetHandle<Hiber3D::StandardMaterial> testMaterial4;
    Hiber3D::AssetHandle<Hiber3D::StandardMaterial> testMaterial5;
    Hiber3D::AssetHandle<Hiber3D::StandardMaterial> testMaterial6;
    Hiber3D::AssetHandle<Hiber3D::StandardMaterial> testMaterial7;
};

static void resetSingletons(
    Hiber3D::Singleton<VisualEffectsState> visualEffectsState) {
    *visualEffectsState = VisualEffectsState{};
}

static void initializeVisualEffectsState(
    Hiber3D::Singleton<VisualEffectsState>   visualEffectsState,
    Hiber3D::Singleton<Hiber3D::AssetServer> assetServer) {
    visualEffectsState->segmentPowerUpMaterial = assetServer->load<Hiber3D::StandardMaterial>(Hiber3D::GltfLabel::material(1).toPath(SEGMENT_PATH));

    visualEffectsState->testMaterial0 = assetServer->load<Hiber3D::StandardMaterial>(Hiber3D::GltfLabel::material(0).toPath(SEGMENT_PATH));
    visualEffectsState->testMaterial1 = assetServer->load<Hiber3D::StandardMaterial>(Hiber3D::GltfLabel::material(1).toPath(SEGMENT_PATH));
    visualEffectsState->testMaterial2 = assetServer->load<Hiber3D::StandardMaterial>(Hiber3D::GltfLabel::material(2).toPath(SEGMENT_PATH));
    visualEffectsState->testMaterial3 = assetServer->load<Hiber3D::StandardMaterial>(Hiber3D::GltfLabel::material(3).toPath(SEGMENT_PATH));
    visualEffectsState->testMaterial4 = assetServer->load<Hiber3D::StandardMaterial>(Hiber3D::GltfLabel::material(4).toPath(SEGMENT_PATH));
    visualEffectsState->testMaterial5 = assetServer->load<Hiber3D::StandardMaterial>(Hiber3D::GltfLabel::material(5).toPath(SEGMENT_PATH));
    visualEffectsState->testMaterial6 = assetServer->load<Hiber3D::StandardMaterial>(Hiber3D::GltfLabel::material(6).toPath(SEGMENT_PATH));
    visualEffectsState->testMaterial7 = assetServer->load<Hiber3D::StandardMaterial>(Hiber3D::GltfLabel::material(7).toPath(SEGMENT_PATH));
}

static void updateRoomMaterialOnPowerup(
    Hiber3D::Singleton<VisualEffectsState>                         visualEffectsState,
    Hiber3D::Singleton<GameState>                                  gameState,
    Hiber3D::View<AutoTurn>                                        autoTurns,
    Hiber3D::Singleton<Hiber3D::AssetServer>                       assetServer,
    Hiber3D::Singleton<Hiber3D::Assets<Hiber3D::StandardMaterial>> standardMaterialAssets) {
    const auto playerEntity = gameState->playerEntity;
    autoTurns.withComponent(playerEntity, [&](const AutoTurn& autoTurn) {
        LOG_INFO("updateRoomMaterialOnPowerup(), player has AutoTurn");
        if (auto* segmentPowerUpMaterial = standardMaterialAssets->getMut(visualEffectsState->segmentPowerUpMaterial)) {
            if (segmentPowerUpMaterial->albedoColor != Hiber3D::float4{0.0f, 1.0f, 0.0f, 1.0f}) {
            LOG_INFO("Before: {},{},{},{}", segmentPowerUpMaterial->albedoColor.x, segmentPowerUpMaterial->albedoColor.y, segmentPowerUpMaterial->albedoColor.z, segmentPowerUpMaterial->albedoColor.w);
            segmentPowerUpMaterial->albedoColor = {0.0f, 1.0f, 0.0f, 1.0f};
            LOG_INFO("Before: {},{},{},{}", segmentPowerUpMaterial->albedoColor.x, segmentPowerUpMaterial->albedoColor.y, segmentPowerUpMaterial->albedoColor.z, segmentPowerUpMaterial->albedoColor.w);
            }
        }

        if (auto* testMaterial0 = standardMaterialAssets->getMut(visualEffectsState->testMaterial0)) {
            testMaterial0->albedoColor = {1.0f, 0.0f, 0.0f, 1.0f};
        }
        if (auto* testMaterial1 = standardMaterialAssets->getMut(visualEffectsState->testMaterial1)) {
            testMaterial1->albedoColor = {0.0f, 1.0f, 0.0f, 1.0f};
        }
        if (auto* testMaterial2 = standardMaterialAssets->getMut(visualEffectsState->testMaterial2)) {
            testMaterial2->albedoColor = {0.0f, 0.0f, 1.0f, 1.0f};
        }
        if (auto* testMaterial3 = standardMaterialAssets->getMut(visualEffectsState->testMaterial3)) {
            testMaterial3->albedoColor = {1.0f, 1.0f, 0.0f, 1.0f};
        }
        if (auto* testMaterial4 = standardMaterialAssets->getMut(visualEffectsState->testMaterial4)) {
            testMaterial4->albedoColor = {1.0f, 0.0f, 1.0f, 1.0f};
        }
        if (auto* testMaterial5 = standardMaterialAssets->getMut(visualEffectsState->testMaterial5)) {
            testMaterial5->albedoColor = {0.0f, 1.0f, 1.0f, 1.0f};
        }
        if (auto* testMaterial6 = standardMaterialAssets->getMut(visualEffectsState->testMaterial6)) {
            testMaterial6->albedoColor = {0.5f, 0.5f, 0.5f, 1.0f};
        }
        if (auto* testMaterial7 = standardMaterialAssets->getMut(visualEffectsState->testMaterial7)) {
            testMaterial7->albedoColor = {0.0f, 0.0f, 0.0f, 1.0f};
        }
    });
}

void VisualEffectsModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_EXIT, resetSingletons);
    context.addSystem(Hiber3D::Schedule::ON_START, initializeVisualEffectsState);
    context.addSystem(Hiber3D::Schedule::ON_TICK, updateRoomMaterialOnPowerup);

    context.registerSingleton<VisualEffectsState>();
}
