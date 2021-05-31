const { parse } = require("yaml");
const { readFileSync } = require("fs");
const { resolve } = require("path");

/** Настройки бота */
const options = {
  /** Токен Пользователя */
  USER_TOKEN: "",
  /** Токен Бота */
  BOT_TOKEN: "",
  /** ID Бота */
  GROUP_ID: "",
  /** Сообщение на кнопке вверху */
  BUTTON_HEADER: "",
  /** Сообщение на кнопке 1 */
  BUTTON_1: "",
  /** Сообщение на кнопке 2 */
  BUTTON_2: "",
  /** Сообщение на кнопке 3 */
  BUTTON_3: "",
  /** Сообщение на кнопке 4 */
  BUTTON_4: "",
  /** Сообщение на кнопке внизу */
  BUTTON_FOOTER: "",
  /** Длинна сообщения */
  MSG_LENGTH: "2000",
  /** Время ожидания в случае успеха */
  SUCCESS_TIMEOUT: "1000",
  /** Время ожидания в случае ошибки */
  ERROR_TIMEOUT: "10000",
  /** Кол-во сообщений для доса */
  MESSAGES_COUNT: "100",
  /**
   * Кол-во уникальных сообщений. Их отсылает
   * чел группе, чтобы она пересылала в беседы
   */
  UNIQUE_MESSAGES: "8",

  /** ID или домен владельца сообщества, чтобы слать сообщения */
  OWNER: "",

  /** Команда на запуск бота */
  TRIGGER: "/старт"
};

const configPath = resolve(__dirname, "../configs/settings.yaml");
const content = readFileSync(configPath, "utf8");
const data = parse(content);

/** @type {typeof options} */
module.exports = Object.assign(options, data, process.env);
