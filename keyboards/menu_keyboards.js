const {Markup} = require('telegraf');

const menu_keyboard = () => {
  return Markup.inlineKeyboard([
    Markup.button.callback('#hokkey2time', 'hokkey2time'),
    Markup.button.callback('#footballSR', 'footballSR'),
  ], {wrap: (btn, index, currentRow) => currentRow.length >= index / (currentRow.length - 2)});
};

module.exports = menu_keyboard;
