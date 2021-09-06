export default class Player {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.class = data.class;
    this.role = data.role;
    this.gear = data.gear;
    this.stats = data.stats;
    this.talents = data.talents;
  }
}
