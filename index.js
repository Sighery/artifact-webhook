const crypto = require('crypto');

const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

function sign(body, secret, algorithm) {
  const buffer = new Buffer(JSON.stringify(body));

  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(buffer, 'utf-8');

  return hmac.digest('hex');
}

try {
  const webhookURL = core.getInput('webhook-url', { required: true });
  core.setSecret(webhookURL);
  const secret = core.getInput('secret');
  core.setSecret(secret);

  const headers = {};

  const body = {
    repository: github.context.repo.repo,
    owner: github.context.repo.owner,
  };

  if (secret !== '') {
    const signature = sign(body, secret, 'sha1');
    headers['X-Action-Signature'] = `sha1=${signature}`;
  }

  axios
    .post(webhookURL, body, { headers: headers })
    .catch((error) => core.setFailed(error));
} catch (error) {
  core.setFailed(error.message);
}
