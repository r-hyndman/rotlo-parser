export default class Query {
  constructor(data = {}) {
    this.name = data.name;
    this.callback = data.callback;
    this.query = data.query;
    this.args = data.args ?? {};
  }
}
