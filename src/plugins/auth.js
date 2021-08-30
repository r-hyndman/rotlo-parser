import axios from 'axios';
import PKCE from 'js-pkce';
import pkceChallenge from 'pkce-challenge';
import { getConfig } from '@/modules';

const authConfig = getConfig('auth');

const pkce = new PKCE({
  client_id: authConfig.clientId,
  redirect_uri: authConfig.redirectUri,
  authorization_endpoint: authConfig.authUri,
  token_endpoint: authConfig.tokenUri,
  requested_scopes: '*',
});

function authorise() {
  const challenge = pkceChallenge();
  window.sessionStorage.setItem(
    'codeVerifier',
    challenge.code_verifier
  );

  window.location.replace(
    pkce.authorizeUrl({
      code_challenge: challenge.code_challenge,
      code_challenge_method: 'S256',
    })
  );
}

async function fetchToken(code) {
  const codeVerifier = window.sessionStorage.getItem('codeVerifier');
  try {
    await axios({
      url: authConfig.tokenUri,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        client_id: authConfig.clientId,
        code_verifier: codeVerifier,
        redirect_uri: authConfig.redirectUri,
        grant_type: 'authorization_code',
        code: code,
      },
    }).then((response) => {
      window.sessionStorage.setItem(
        'access_token',
        response.data.access_token
      );
    });
  } catch (e) {
    console.error(e);
  }
}

export { authorise, fetchToken };
