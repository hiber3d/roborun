import ANIMATION_LAYER from "../state/AnimationLayers.js";

export class {
  onCreate() {
    hiber3d.addEventListener(this.entity, "KillPlayer");
    hiber3d.addEventListener(this.entity, "PlayerDied");
  }
  update() {
  }
  onEvent(event, payload) {
    if (event === "KillPlayer") {
      if (hiber3d.getSingleton("GameState", "alive") === true) {
        hiber3d.setValue("GameState", "alive", false);

        const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
        const stats = hiber3d.getComponent(playerEntity, "Stats");
        hiber3d.writeEvent("PlayerDied", {stats});
      }
    }
    
    if (event === "PlayerDied") {
      hiber3d.print("!!GAME OVER!! - points:'" + Math.round(payload.stats.points) + "' | collectibles:'" + payload.stats.collectibles + "'| meters:'" + Math.round(payload.stats.meters) + "' | multiplier at end: 'x" + (Math.floor(payload.stats.multiplier * 10 + 0.0001) / 10).toFixed(1) + "'");
      const playerEntity = hiber3d.getSingleton("GameState", "playerEntity");
      hiber3d.writeEvent("PlayAnimation", { entity: playerEntity, name: "dying", layer: ANIMATION_LAYER.DYING, loop: false });
      hiber3d.writeEvent("QueueAnimation", { playAnimation: { entity: playerEntity, name: "dead", layer: ANIMATION_LAYER.DEAD, loop: true } });
    }
  }
}