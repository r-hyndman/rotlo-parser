export default class Encounter {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.fights = data.fights;
    // add raid (parent) name?
  }
}
