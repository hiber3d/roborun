({
  Script: "",
  Entity: -1,
  Delay: 0,
  onCreate() {
  },
  update(dt) {
    if (this.Delay <= 0) {
      if (this.Script !== "" && this.Entity !== -1) {
        regUtils.removeScript(this.Entity, this.Script);
      }
      regUtils.destroyEntity(this.entity);
    }
    this.Delay -= dt;
  },
  onEvent(event, payload) {
  }
});