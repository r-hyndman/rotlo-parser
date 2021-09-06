import axios from 'axios';

async function sendQuery(query, token) {
  try {
    await axios({
      url: 'https://classic.warcraftlogs.com/api/v2/user',
      method: 'post',
      data: {
        query: query.query,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then((response) => query.callback(response, query.args));
  } catch (e) {
    console.error(e);
  }
}

export { sendQuery };
