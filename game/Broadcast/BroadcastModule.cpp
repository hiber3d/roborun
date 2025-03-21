#include "BroadcastEvents.hpp"
#include "BroadcastModule.hpp"

#include <Path/PathTypes.hpp>

#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>

#include <RoboRun/RoboRunTypes.hpp>

static void broadcastStats(
    Hiber3D::Singleton<GameState>               gameState,
    Hiber3D::View<Stats>                        stats,
    Hiber3D::EventWriter<BroadcastPlayerStats>& writer) {
    const auto playerEntity = gameState->playerEntity;
    stats.withComponent(playerEntity, [&](const Stats& stats) {
        writer.writeEvent({.stats = stats});
    });
}

void BroadcastModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_TICK, broadcastStats);

    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<BroadcastPlayerStats>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<BroadcastCollectiblePickup>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<BroadcastGameStarted>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<BroadcastPowerupPickup>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<BroadcastPerfectCollectiblePickup>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<BroadcastTilted>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<BroadcastSlided>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<BroadcastTurned>(context);
    }
}