require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.command("e2e", async ({ ack, logger, ...rest }) => {
  console.log({ rest });
  await ack();
  try {
    const url = `https://circleci.com/api/v2/project/gh/${process.env.GITHUB_ACCOUNT_NAME}/${process.env.GITHUB_REPOSITORY_NAME}/pipeline`;
    const data = {
      branch: `${process.env.GITHUB_BRANCH_NAME}`,
      parameters: { manual_execution: true },
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    logger.info(response);
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
  console.log(process.env);
})();
