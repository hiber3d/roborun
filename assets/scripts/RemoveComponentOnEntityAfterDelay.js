// This script will be written after [HIB-33606] and [HIB-33679]
({
  Component: "",
  Entity: -1,
  Delay: 0,
  onCreate() {
    //hiber3d.print("RemoveComponentOnEntityAfterDelay.onCreate() - Component:'" + this.Component + "', Entity:'" + this.Entity + "', Delay:'" + this.Delay + "'");
  },
  update(dt) {
    if (this.Delay <= 0) {
      if (this.Component !== "" && this.Entity !== -1) {
        //hiber3d.removeComponent(this.Entity, this.Component);
      }
      //regUtils.destroyEntity(this.entity);
    }
    this.Delay -= dt;
  },
  onEvent(event, payload) {
  }
});