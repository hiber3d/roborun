#include "AudioEvents.hpp"
#include "AudioModule.hpp"

#include <Hiber3D/Audio/AudioAssets.hpp>
#include <Hiber3D/Audio/AudioComponents.hpp>
#include <Hiber3D/Audio/AudioModule.hpp>
#include <Hiber3D/Editor/EditorModule.hpp>
#include <Hiber3D/Core/Registry.hpp>
#include <Hiber3D/Hiber3D.hpp>
#include <Hiber3D/Scene/SceneModule.hpp>
#include <Hiber3D/Scripting/JavaScriptScriptingModule.hpp>

#include <RoboRun/RoboRunTypes.hpp>

struct SyncedMusic { bool dummy; };

HIBER3D_REFLECT(HIBER3D_TYPE(SyncedMusic));

// This allows multiple music tracks, each in their own AudioSource,
// to start simultaneously when all of them have finished loading.
static void startSyncedMusicWhenLoaded(Hiber3D::Singleton<Hiber3D::Assets<Hiber3D::Audio>>    assets,
                                       Hiber3D::View<Hiber3D::AudioSource, const SyncedMusic> audioComponents) {
    bool allLoaded = true;

    for (auto [entity, audio, syncedMusic] : audioComponents.each()) {
        // Previously, audio were loaded and decoded when the audio played for the first time.
        // Now, audio assets are loaded and decoded when the scene is loaded.
        // So, once *this* system runs the first time, all audio assets should already be ready to play.
        // Sooo... do we even need this system anymore? Or should it listen for some AssetEvent instead of polling?
        if (audio->status == Hiber3D::AudioStatus::PAUSED && assets->get(audio->asset) == nullptr) {
            allLoaded = false;
        }
    }

    if (allLoaded) {
        for (auto [entity, audio, syncedMusic] : audioComponents.each()) {
            if (audio->status == Hiber3D::AudioStatus::PAUSED) {
                audio.mut().status = Hiber3D::AudioStatus::PLAYING;
            }
        }
    }
}

void AudioModule::onRegister(Hiber3D::InitContext& context) {
    context.addSystem(Hiber3D::Schedule::ON_FRAME, startSyncedMusicWhenLoaded);
    
    if (context.isModuleRegistered<Hiber3D::JavaScriptScriptingModule>()) {
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerEvent<MuteAudio>(context);
        context.getModule<Hiber3D::JavaScriptScriptingModule>().registerComponent<SyncedMusic>(context);
    }

    if (context.isModuleRegistered<Hiber3D::SceneModule>()) {
        context.getModule<Hiber3D::SceneModule>().registerComponent<SyncedMusic>(context);
    }

    if (context.isModuleRegistered<Hiber3D::EditorModule>()) {
        context.getModule<Hiber3D::EditorModule>().registerComponent<SyncedMusic>(context);
    }

}