const { VK } = require("vk-io");
const { BOT_TOKEN, GROUP_ID, OWNER, TRIGGER } = require("./settings");
const { fileExists, readJSON, writeJSON, randomId } = require("./utils");
const { attack, generateMessages } = require("./core");
const { emoji } = require("@xxhax/emoji");
const { resolve } = require("path");
const chalk = require('chalk');

const API_VERSION = "5.126";

const messagesPath = resolve(__dirname, "../configs/_messages.json");

const vk = new VK({
  token: BOT_TOKEN,
  pollingGroupId: parseInt(GROUP_ID),
  apiVersion: API_VERSION
});

/**
 * @returns {Promise<number[]>}
 */
async function getMessagesToForward() {
  if (!fileExists(messagesPath)) {
    const fm = await generateMessages();

    await writeJSON(messagesPath, { [GROUP_ID]: fm });
    return fm;
  }

  const data = await readJSON(messagesPath);

  if (!data[GROUP_ID]) {
    data[GROUP_ID] = await generateMessages();
    await writeJSON(messagesPath, data);
  }

  return data[GROUP_ID];
}

async function main() {
  const [owner] = await vk.api.users.get({ user_ids: OWNER });
  const forwardMessages = await getMessagesToForward();
  console.log(chalk.yellowBright(`${emoji["+1"]} Загружены сообщения для спама`));

  vk.updates.on("message_new", async (ctx, next) => {
    const startCondition =
      ctx.hasText && ctx.text.includes(TRIGGER) && ctx.senderType === "user";
    if (!startCondition) return next();
    const [attacker] = await vk.api.users.get({ user_ids: ctx.senderId });

    await vk.api.messages.send({
      user_id: owner.id,
      message: `${emoji.boom} @id${attacker.id} (${attacker.first_name} ${attacker.last_name}) начал разъёб беседы ${ctx.peerId}`,
      random_id: randomId()
    });

    await attack(ctx, forwardMessages);

    return next();
  });

  await vk.api.groups.setLongPollSettings({
    group_id: parseInt(GROUP_ID),
    api_version: API_VERSION,
    message_new: 1
  });

  await vk.updates.startPolling();

  setInterval(() => {
    try {
      vk.api.groups.enableOnline({ group_id: parseInt(GROUP_ID) });
    } catch (error) {
      console.log(error);
    }
  }, 320000); // 5 минут, 20 секунд

  console.log(chalk.bold.green(`${emoji.rocket} Бот онлайн!`));

  await vk.api.messages.send({
    user_id: owner.id,
    message: `${emoji.white_check_mark} Бот работает!\n${emoji.rocket} Запуск: @club${GROUP_ID} ${TRIGGER}`,
    random_id: randomId()
  });
}

main();
