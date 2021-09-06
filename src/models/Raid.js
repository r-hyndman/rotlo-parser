export default class Raid {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.date = data.date;
    this.roster = data.roster;
    this.encounters = data.encounters;
  }
}
