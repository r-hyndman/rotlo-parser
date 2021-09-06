export default class Fight {
  constructor(data = {}) {
    this.id = data.id;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.percentage = data.percentage;
    this.kill = data.kill;
    this.data = data.data;
  }
}
