({
    shouldRun() {
        return hiber3d.getValue("GameState", "alive")
      },
    onCreate() {
        hiber3d.call("rmlCreateDataModel", "magnet_model"); // Getting a Data model already exist
        // hiber3d.call("rmlLoadFont", "fonts/Roboto-Regular.ttf"); // Need to be formatted like this to work
    },
    update() {
        if (!this.shouldRun()) {
            hiber3d.call("rmlSetDataModelString", "magnet_model", "visible", "0");
            return;
        }
        const playerEntity = hiber3d.getValue("GameState", "playerEntity");
        const playerHasMagnet = hiber3d.hasScripts(playerEntity, "scripts/powerups/Magnet.js") ? "1" : "0";

        hiber3d.call("rmlSetDataModelString", "magnet_model", "visible", playerHasMagnet);
    },
});