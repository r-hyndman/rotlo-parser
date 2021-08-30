import axios from 'axios';

async function sendQuery(query, callback, args = {}) {
  const token = window.sessionStorage.getItem('access_token');
  try {
    await axios({
      url: 'https://classic.warcraftlogs.com/api/v2/user',
      method: 'post',
      data: {
        query: query,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then((response) => callback(response, args));
  } catch (e) {
    console.error(e);
  }
}

export { sendQuery };
