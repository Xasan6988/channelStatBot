const {Markup} = require('telegraf');

const menu_keyboard = () => {
  return Markup.inlineKeyboard([
    Markup.button.callback('Стата за вчера', 'yesterday'),
    Markup.button.callback('Вся стата', 'allStat'),
  ], {wrap: (btn, index, currentRow) => currentRow.length >= index / (currentRow.length - 2)});
};

module.exports = menu_keyboard;
