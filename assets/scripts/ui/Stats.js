import * as regUtils from "scripts/utils/RegUtils.js";

export class {
  shouldRun() {
    const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
    return (
      !regUtils.isNullEntity(playerEntity) &&
      hiber3d.hasComponents(playerEntity, "Stats") &&
      hiber3d.getSingleton("GameState", "alive")
    );
  }
  onCreate() {
    hiber3d.call("rmlCreateDataModel", "stats_model");
    hiber3d.call("rmlLoadFont", "fonts/Roboto-Regular.ttf"); // Need to be formatted like this to work
    this.updateStats("points", 0);
    this.updateStats("collectibles", 0);
    this.updateStats("meters", 0);
    this.updateStats("multiplier", "1.0");
    this.updateStats("multiplierProgress", 0);
    this.updateStats("visibility", "hidden");
  }

  updateStats(key, value) {
    hiber3d.call("rmlSetDataModelString", "stats_model", key, value.toString());
  }
  update() {
    if (!this.shouldRun()) {
      this.updateStats("visibility", "hidden");
      return;
    }
    this.updateStats("visibility", "visible");

    const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");

    const stats = hiber3d.getComponent(playerEntity, "Stats");
    this.updateStats("points", Math.round(stats.points));
    this.updateStats("collectibles", stats.collectibles);
    this.updateStats("meters", Math.round(stats.meters));

    const multiplier = (Math.round(stats.multiplier * 10) / 10).toFixed(1);
    this.updateStats("multiplier", multiplier);
    this.updateStats("multiplierProgress", stats.collectibles ? stats.collectibles % 10 : 0);
  }
}