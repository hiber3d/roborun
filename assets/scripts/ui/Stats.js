({
  shouldRun() {
    return hiber3d.hasComponents(
      this.entity,
      "Hiber3D::ComputedWorldTransform"
    );
  },
  onCreate() {
    hiber3d.call("rmlCreateDataModel", "stats_model"); // Getting a Data model already exist
    hiber3d.call("rmlLoadFont", "fonts/Roboto-Regular.ttf"); // Need to be formatted like this to work
    this.updateStats(0, "points");
    this.updateStats(0, "collectibles");
    this.updateStats(0, "meters");
    this.updateStats("1.0", "multiplier");
    this.updateStats(0, "multiplierProgress");
  },

  updateStats(value, key) {
    hiber3d.call("rmlSetDataModelString", "stats_model", key, value.toString());
  },
  update() {
    if (!this.shouldRun()) {
      return;
    }
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

    const multiplier = (Math.round(stats.multiplier * 10) / 10).toFixed(1);
    this.updateStats(multiplier, "multiplier");
    this.updateStats(
      stats.collectibles ? stats.collectibles % 10 : 0,
      "multiplierProgress"
    );
  },
});
