({
  onCreate() {
    hiber3d.addEventListener(this.entity, "KillPlayer");
    hiber3d.addEventListener(this.entity, "PlayerDied");
  },
  update() {
  },
  onEvent(event, payload) {
    const gameState = hiber3d.getSingleton("GameState");
    if (event === "KillPlayer") {
      if (gameState.alive === true) {
        gameState.alive = false;
        hiber3d.setSingleton("GameState", gameState);

        const stats = hiber3d.getComponent(gameState.playerEntity, "Stats");
        const playerDied = new PlayerDied();
        playerDied.stats = stats;
        hiber3d.writeEvent("PlayerDied", playerDied);
      }
    }

    if (event === "PlayerDied") {
      hiber3d.print("!!GAME OVER!! - points:'" + Math.round(payload.stats.points) + "' | collectibles:'" + payload.stats.collectibles + "'| meters:'" + Math.round(payload.stats.meters) + "' | multiplier at end: 'x" + (Math.floor(payload.stats.multiplier * 10 + 0.0001) / 10).toFixed(1) + "'");
      const playerEntity = gameState.playerEntity;

      const playAnimationEvent = new PlayAnimation();
      playAnimationEvent.entity = playerEntity;
      playAnimationEvent.name = "dying";
      playAnimationEvent.layer = ANIMATION_LAYER.DYING;
      playAnimationEvent.loop = false;
      hiber3d.writeEvent("PlayAnimation", playAnimationEvent);

      const queueAnimationEvent = new QueueAnimation();
      const playAnimation = queueAnimationEvent.playAnimation;
      playAnimation.entity = playerEntity;
      playAnimation.name = "dead";
      playAnimation.layer = ANIMATION_LAYER.DEAD;
      playAnimation.loop = true;
      hiber3d.writeEvent("QueueAnimation", queueAnimationEvent);
    }
  },
});
