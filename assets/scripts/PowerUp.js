({
  //SCRIPT_PATHS: [],
  //COMPONENTS: ["Magnet"/*, "AutoRun"*/],
  //DURATION: 15,
  RADIUS: 0.75,
  shouldRun() {
    const playerEntity = hiber3d.getValue("GameState", "playerEntity");
    return playerEntity !== undefined &&
      hiber3d.hasComponents(playerEntity, "Hiber3D::ComputedWorldTransform") &&
      hiber3d.hasComponents(this.entity, "Hiber3D::ComputedWorldTransform");
  },
  onCreate() {
  },
  update() {
    if (this.shouldRun() === false) {
      return;
    }

    if (collisionUtils.collidesWithPlayer(this.entity, this.RADIUS)) {

      //for (var i = 0; i < Object.keys(this.SCRIPT_PATHS).length; i++) { 
      //  const script = this.SCRIPT_PATHS[i];

      //  // Give player effect script
      //  const playerEntity = hiber3d.getValue("GameState", "playerEntity");
      //  regUtils.addScript(playerEntity, script);

      //  // Setup script that removes the effect after its duration
      //  const scriptRemoverEntity = hiber3d.createEntity();
      //  regUtils.addScript(scriptRemoverEntity, "scripts\\RemoveScriptOnEntityAfterDelay.js");
      //  var scriptRemoverScript = hiber3d.getScript(scriptRemoverEntity, "scripts\\RemoveScriptOnEntityAfterDelay.js");
      //  scriptRemoverScript.Script = script;
      //  scriptRemoverScript.Entity = playerEntity;
      //  scriptRemoverScript.Delay = duration;
      //}

      //for (var i = 0; i < Object.keys(this.COMPONENTS).length; i++) {
      //  const component = this.COMPONENTS[i];

        // Give player effect component
        const playerEntity = hiber3d.getValue("GameState", "playerEntity");

        // TODO: Depends on [HIB-33606] and [HIB-33679]

      const component = hiber3d.getValue(this.entity, "Hiber3D::Name");
        regUtils.addOrReplaceComponent(playerEntity, component);

        // Setup script that removes the effect after its duration
        //const componentRemoverEntity = hiber3d.createEntity();
        //regUtils.addScript(componentRemoverEntity, "scripts\\RemoveComponentOnEntityAfterDelay.js");

        //var componentRemoverScript = hiber3d.getScript(componentRemoverEntity, "scripts\\RemoveComponentOnEntityAfterDelay.js");
        //componentRemoverScript.Component = component;
        //componentRemoverScript.Entity = playerEntity;
        //componentRemoverScript.Delay = duration;
      //}

      // Destroy this power-up
      regUtils.destroyEntity(this.entity);
    }
  },
  onEvent(event, payload) {
  }
});