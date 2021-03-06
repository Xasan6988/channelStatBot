const {Telegraf, Markup} = require('telegraf');
const config = require('config');
const mongo = require('mongoose');

const {createStore, applyMiddleware} = require('redux');
const {default: thunk} = require('redux-thunk');

const rootReducer = require('./redux/rootReducer');
const {addHokkeyMatch, hokkey2timeFetchMatches, hokkey2timeGetWinrate, hokkey2timeFetchMatchesForDate, addFootbalSRMatch, footballSRFetchMatches, footballSRGetWinrate, footballSRFetchMatchesForDate, basket23GetWinrate, basket23FetchMatchesForDate, basket23FetchMatches, addBasket23Match} = require('./redux/actions');

const menu_keyboard = require('./keyboards/menu_keyboards');

const {checkUserinArr, getHokkey2TimeStatInfo, getFootballSRStatInfo, getBasket23StatInfo} = require('./helpers');

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

const bot = new Telegraf(config.get('TOKEN'));

bot.use(async (ctx, next) => {
  if (ctx.update.edited_channel_post?.sender_chat.id === config.get('channel') && ctx.update.edited_channel_post.photo && ctx.update.edited_channel_post.caption.split('//')[0].trim() === 'fix') {
    const data = ctx.update.edited_channel_post.caption.split('//');
    const date = `${new Date().getDate()}.${(new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1}`;

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

      try {
        store.dispatch(addHokkeyMatch({date, ...bets, coef}));
      } catch (e) {
        console.log(`An error occurred while trying save match ${e.message}`);
      }
    } else if (data[1].trim() === '#footballSR') {
      if (data.length === 6) {
        const match = {
          date,
          win: JSON.parse(data[2]),
          half: JSON.parse(data[3]),
          winCoef: JSON.parse(data[4]),
          halfCoef: JSON.parse(data[5])
        };

        try {
          store.dispatch(addFootbalSRMatch(match));
        } catch (e) {
          console.log(`An error occurred while trying save match ${e.message}`);
        }
      }
    } else if (data[1].trim() === '#basket23') {
      if (data.length === 4) {
        const match = {
          date,
          itb: JSON.parse(data[2]),
          coef: JSON.parse(data[3]),
        };

        try {
          store.dispatch(addBasket23Match(match));
        } catch(e) {
          console.log(`An error occurred while trying save match ${e.message}`)
        }
      }
    }
  }
  next();
});

bot.start(async ctx => {
  if (checkUserinArr(ctx.from.id, config.get('admins'))) {
    ctx.replyWithHTML(`
Silence is gold
    `, menu_keyboard());
  } else {
    ctx.reply('This bot is private. Please go away');
  }
})

bot.action('menu', async ctx => {
  if (checkUserinArr(ctx.from.id, config.get('admins'))) {
    ctx.editMessageText(`
Silence is gold
    `, {
      parse_mode: 'HTML', ...menu_keyboard()
    });
  } else {
    ctx.reply('This bot is private. Please go away');
  }
});

bot.action('hokkey2time', async ctx => {
  await store.dispatch(hokkey2timeGetWinrate());

  const winrate = store.getState().hokkey2timeWinrate;

  ctx.editMessageText(`
Winrate is ${winrate.half.toFixed(2)}%
For 2 goals - ${winrate.one.toFixed(2)}%
  `, {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
      Markup.button.callback(`???? ??????????`, `yesterday:#hokkey2time`),
      Markup.button.callback('?????? ??????????', 'allStat:#hokkey2time'),
      Markup.button.callback('?????????? ?? ????????', 'menu')
    ], {wrap: (btn, index, currentRow) => currentRow.length >= index / (currentRow.length - 2)})
  })
});

bot.action('footballSR', async ctx => {
  await store.dispatch(footballSRGetWinrate());

  const winrate = store.getState().footballSRWinrate;

  ctx.editMessageText(`
Winrate for WIN: ${winrate.win.toFixed(2)}
Winrate for HALF: ${winrate.half.toFixed(2)}
  `, {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
      Markup.button.callback(`???? ??????????`, `yesterday:#footballSR`),
      Markup.button.callback('?????? ??????????', 'allStat:#footballSR'),
      Markup.button.callback('?????????? ?? ????????', 'menu')
    ], {wrap: (btn, index, currentRow) => currentRow.length >= index / (currentRow.length - 2)})
  })
});

bot.action('basket23', async ctx => {
  await store.dispatch(basket23GetWinrate());

  const {itb} = store.getState().basket23Winrate;

  ctx.editMessageText(`
Winrate for ITB: ${itb.toFixed(2)}
    `, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        Markup.button.callback(`???? ??????????`, `yesterday:#basket23`),
        Markup.button.callback('?????? ??????????', 'allStat:#basket23'),
        Markup.button.callback('?????????? ?? ????????', 'menu')
      ], {wrap: (btn, index, currentRow) => currentRow.length >= index / (currentRow.length - 2)})
    })
})

bot.on('callback_query', async ctx => {
  if (ctx.update.callback_query.data.split(':')[0] === 'yesterday') {
    const strategy = ctx.update.callback_query.data.split(':')[1].trim();

    if (strategy === '#hokkey2time') {
      await store.dispatch(hokkey2timeFetchMatchesForDate(new Date().getDate() - 1));

      const {matches, halfCount, oneCount, minusCount, nonBet} = getHokkey2TimeStatInfo(store.getState().hokkeyMatches)


      ctx.editMessageText(`
???????????? ??????????: ${matches.length}

???????????? ???? ???? 0.5: ${halfCount}

???????????? ?? ???????????????????? ???? ???? ???? 0.5: ${nonBet}

???????????? ???? ???? 1: ${oneCount}

??????????????: ${minusCount};
      `,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([Markup.button.callback('??????????', 'hokkey2time')])
        });
    }
    if (strategy === '#footballSR') {
      await store.dispatch(footballSRFetchMatchesForDate(new Date().getDate() - 1));

      const {matches, winPlusCount, halfPlusCount, winMinusCount, halfMinusCount} = getFootballSRStatInfo(store.getState().footballSRMatches)


      ctx.editMessageText(`
???????????? ??????????: ${matches.length}

???????????? ???? ????????????: ${winPlusCount}
?????????????? ???? ????????????: ${winMinusCount}

???????????? ???? ??????: ${halfPlusCount}
?????????????? ???? ??????: ${halfMinusCount}
      `,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([Markup.button.callback('??????????', 'footballSR')])
        });
    }
    if (strategy === '#basket23') {
      await store.dispatch(basket23FetchMatchesForDate(new Date().getDate() - 1));

      const {matches, itbPlusCount, itbMinusCount} = getBasket23StatInfo(store.getState().basket23Matches)


      ctx.editMessageText(`
???????????? ??????????: ${matches.length}

???????????? ???? ??????: ${itbPlusCount}
?????????????? ???? ??????: ${itbMinusCount}
      `,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([Markup.button.callback('??????????', 'basket23')])
        });
    }
  } if (ctx.update.callback_query.data.split(':')[0] === 'allStat') {
    const strategy = ctx.update.callback_query.data.split(':')[1].trim();

    if (strategy === '#hokkey2time') {
      await store.dispatch(hokkey2timeFetchMatches());

      const {matches, halfCount, oneCount, minusCount, nonBet} = getHokkey2TimeStatInfo(store.getState().hokkeyMatches)


      ctx.editMessageText(`
???????????? ??????????: ${matches.length}

???????????? ???? ???? 0.5: ${halfCount}

???????????? ?? ???????????????????? ???? ???? ???? 0.5: ${nonBet}

???????????? ???? ???? 1: ${oneCount}

??????????????: ${minusCount};
  `,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([Markup.button.callback('??????????', 'hokkey2time')])
      });
    }
    if (strategy === '#footballSR') {
      await store.dispatch(footballSRFetchMatches());

      const {matches, winPlusCount, halfPlusCount, winMinusCount, halfMinusCount} = getFootballSRStatInfo(store.getState().footballSRMatches)


      ctx.editMessageText(`
???????????? ??????????: ${matches.length}

???????????? ???? ????????????: ${winPlusCount}
?????????????? ???? ????????????: ${winMinusCount}

???????????? ???? ??????: ${halfPlusCount}
?????????????? ???? ??????: ${halfMinusCount}
      `,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([Markup.button.callback('??????????', 'footballSR')])
        });
    }
    if (strategy === '#basket23') {
      await store.dispatch(basket23FetchMatches());

      const {matches, itbPlusCount, itbMinusCount} = getBasket23StatInfo(store.getState().basket23Matches)


      ctx.editMessageText(`
???????????? ??????????: ${matches.length}

???????????? ???? ??????: ${itbPlusCount}
?????????????? ???? ??????: ${itbMinusCount}
      `,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([Markup.button.callback('??????????', 'basket23')])
        });
    }
  }
});

(async () => {
  try {
    await mongo.connect(config.get('mongo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }));
    bot.launch();
    console.log('Bot has been started...');
  } catch (e) {
    console.log(`An error occerred while trying connect to MONGO or/and starting bot

${e.message}
    `);
  }
})();
