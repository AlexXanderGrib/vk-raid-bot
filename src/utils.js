const { promisify } = require("util");
const { promises: fs, existsSync } = require("fs");
const { random } = require("@xxhax/emoji");

const MAX_INT_32 = ~(2 << 30); // Хер знает как, но оно правильно вычисляется

/**
 *
 * @param {string} str
 */
const escapeHtml = (str) =>
  str
    .split("")
    .map((char) => `&#${char.charCodeAt(0)};`)
    .join("");

/**
 *
 * @param {number} length
 */
function generateHtmlEmojis(length) {
  return random(length).join('').substring(0, length);
}

const randomId = () => Math.round(Math.random() * MAX_INT_32);
const sleep = promisify(setTimeout);

/**
 *
 * @param {string} filePath
 */
const readJSON = (filePath) =>
  fs.readFile(filePath, { encoding: "utf8" }).then((data) => JSON.parse(data));

/**
 *
 * @param {string} filePath
 * @param {*} object
 */
const writeJSON = (filePath, object) =>
  fs.writeFile(filePath, JSON.stringify(object), { encoding: "utf8" });

module.exports = {
  generateHtmlEmojis,
  escapeHtml,
  randomId,
  sleep,
  writeJSON,
  readJSON,
  fileExists: existsSync
};
