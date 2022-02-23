const {Telegraf, Markup} = require('telegraf');
const config = require('config');
const mongo = require('mongoose');

const {createStore, applyMiddleware} = require('redux');
const {default: thunk} = require('redux-thunk');

const rootReducer = require('./redux/rootReducer');
const {addHokkeyMatch, fetchMatches, getWinrate, fetchMatchesForDate} = require('./redux/actions');

const menu_keyboard = require('./keyboards/menu_keyboards');

const {checkUserinArr, getStatInfo} = require('./helpers');

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

const bot = new Telegraf(config.get('TOKEN'));

bot.use(async (ctx, next) => {
  if (ctx.update.edited_channel_post?.sender_chat.id === config.get('channel') && ctx.update.edited_channel_post.photo && ctx.update.edited_channel_post.caption.split('//')[0].trim() === 'fix') {
    const data = ctx.update.edited_channel_post.caption.split('//');

    if (data[1].trim() === '#hokkey2time') {
      if (data.length < 4) {
        data[3] = false;
      }
      const bets = {
        half: JSON.parse(data[2]),
        one: JSON.parse(data[3])
      };
      let coef = [];
      if (!data[4]) {
        coef.push(1.5, 1.5);
      } else {
        coef = JSON.parse(data[4]);
      }
      const date = `${new Date().getDate()}.${(new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1}`

      try {
        store.dispatch(addHokkeyMatch({date, ...bets, coef}));
      } catch (e) {
        console.log(`An error occurred while trying save match ${e.message}`);
      }
    }
  }
  next();
});

bot.start(async ctx => {
  if (checkUserinArr(ctx.from.id, config.get('admins'))) {
    const winrate = store.getState().winrate;
    ctx.replyWithHTML(`
Silence is gold
Winrate is - ${(winrate.half).toFixed(2)}%
For 2 goals - ${(winrate.one).toFixed(2)}%
    `, menu_keyboard());
  } else {
    ctx.reply('This bot is private. Please go away');
  }
})

bot.action('menu', async ctx => {
  if (checkUserinArr(ctx.from.id, config.get('admins'))) {
    const winrate = store.getState().winrate;
    ctx.editMessageText(`
Silence is gold
Winrate is - ${(winrate.half).toFixed(2)}%
For 2 goals - ${(winrate.one).toFixed(2)}%
    `, {
      parse_mode: 'HTML', ...menu_keyboard()
    });
  } else {
    ctx.reply('This bot is private. Please go away');
  }
});

bot.action('yesterday', async ctx => {
  await store.dispatch(fetchMatchesForDate(new Date().getDate() - 1));

  setImmediate(() => {
    store.dispatch(getWinrate())
  })

  const {matches, halfCount, oneCount, minusCount, nonBet} = getStatInfo(store.getState().hokkeyMatches)


  ctx.editMessageText(`
Матчей всего: ${matches.length}

Плюсов по ТБ 0.5: ${halfCount}

Матчей с недошедшим кф на ТБ 0.5: ${nonBet}

Плюсов по ТБ 1: ${oneCount}

Минусов: ${minusCount};
  `,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([Markup.button.callback('Назад', 'menu')])
    });
});

bot.action('allStat', async ctx => {
  await store.dispatch(fetchMatches());
  setImmediate(() => {
    store.dispatch(getWinrate())
  })

  const {matches, halfCount, oneCount, minusCount, nonBet} = getStatInfo(store.getState().hokkeyMatches)


  ctx.editMessageText(`
Матчей всего: ${matches.length}

Плюсов по ТБ 0.5: ${halfCount}

Матчей с недошедшим кф на ТБ 0.5: ${nonBet}

Плюсов по ТБ 1: ${oneCount}

Минусов: ${minusCount};
  `,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([Markup.button.callback('Назад', 'menu')])
    });
});

(async () => {
  try {
    await mongo.connect(config.get('mongo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }));
    store.dispatch(getWinrate());
    bot.launch();
    console.log('Bot has been started...');
  } catch (e) {
    console.log(`An error occerred while trying connect to MONGO or/and starting bot

${e.message}
    `);
  }
})();
