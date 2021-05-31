const { Keyboard } = require("vk-io");
const {
  BUTTON_1,
  BUTTON_2,
  BUTTON_3,
  BUTTON_4,
  BUTTON_FOOTER,
  BUTTON_HEADER
} = require("./settings");

/**
 *
 * @param {string} label
 * @param {import("vk-io").ButtonColor | import("vk-io").ButtonColorUnion} color
 */
const btn = (label, color) => Keyboard.textButton({ label, color });

const headerButton = btn(BUTTON_HEADER, Keyboard.PRIMARY_COLOR);

const b1 = btn(BUTTON_1, Keyboard.PRIMARY_COLOR);
const b2 = btn(BUTTON_2, Keyboard.SECONDARY_COLOR);
const b3 = btn(BUTTON_3, Keyboard.POSITIVE_COLOR);
const b4 = btn(BUTTON_4, Keyboard.NEGATIVE_COLOR);

const footerButton = btn(BUTTON_FOOTER, Keyboard.SECONDARY_COLOR);

const baseKeyboard = Keyboard.keyboard([
  [headerButton],
  [b1, b2, b3, b4],
  [b2, b3, b4, b1],
  [b3, b4, b1, b2],
  [b4, b1, b2, b3],
  [footerButton]
]);

module.exports = { baseKeyboard };
