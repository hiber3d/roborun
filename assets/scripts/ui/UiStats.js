({
    onCreate() {
        hiber3d.call("rmlCreateDataModel", "stats_model");
        hiber3d.call("rmlLoadFont", "fonts/Roboto-Regular.ttf"); // Need to be formatted like this to work
    },

    updateStats(value, key){
        hiber3d.call("rmlSetDataModelString", "stats_model", key, value.toString());
    },
    update() {
        const playerEntity = hiber3d.getValue("GameState", "playerEntity");
        if (!playerEntity || playerEntity === 4294967295) {
            return;
        }

        const stats = hiber3d.getValue(playerEntity, "Stats");


        if (stats === undefined) {
            return;
        }
        this.updateStats(Math.round(stats.points), "points");
        this.updateStats(stats.collectibles, "collectibles");
        this.updateStats(Math.round(stats.meters), "meters");
        this.updateStats(stats.multiplier, "multiplier");

    },
});