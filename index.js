const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

try {
  const webhookURL = core.getInput('webhook-url', { required: true });
  core.setSecret(webhookURL);

  axios
    .post(webhookURL, {
      repository: github.context.repo.repo,
      owner: github.context.repo.owner,
    })
    .catch((error) => core.setFailed(error));
} catch (error) {
  core.setFailed(error.message);
}
