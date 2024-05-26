require("dotenv").config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");

const bot = new Bot(process.env.BOT_API_KEY);

bot.use(hydrate());

// bot.on("message:voice", async (stx) => {
//   await stx.reply("Мы получили голосовое");
// });

// bot.on("message:entities:url", async (stx) => {
//   await stx.reply("ссылка");
// });

// bot.on([":media", "::url"], async (stx) => {
//   await stx.reply("ссылка");
// });

// bot.on(":photo").on("::hashtag", async () => {
//   console.log("yes");
// });

// bot.on("msg").filter(
//   (ctx) => {
//     // boolean
//     console.log("ctx", ctx.from);
//     return ctx.from.id === 7042949220;
//   },
//   async (ctx) => {
//     await ctx.reply("Привет админ");
//   }
// );

bot.api.setMyCommands([
  {
    command: "start",
    description: "запуск бота",
  },
  {
    command: "menu",
    description: "Меню",
  },
]);

// bot.api.setMyCommands([
//   {
//     command: "start",
//     description: "запуск бота",
//   },
//   {
//     command: "mood",
//     description: "Оценить настроение",
//   },
//   {
//     command: "share",
//     description: "Поделиться данными",
//   },
//   {
//     command: "inline_keyboard",
//     description: "инлайн клава",
//   },
// ]);

bot.command("start", async (stx) => {
  await stx.reply("Привет я бот", {
    reply_parameters: { message_id: stx.msg.message_id },
  });
});

const menuKeyboard = new InlineKeyboard()
  .text("Узнать статус заказа", "order-status")
  .text("Заказ товара", "support");
const backKeyboard = new InlineKeyboard().text("< назад в меню", "back");

bot.command("menu", async (ctx) => {
  await ctx.reply("Выберите пунк меню", {
    reply_markup: menuKeyboard,
  });
});
// editText добавляется из hydrate
bot.callbackQuery("order-status", async (ctx) => {
  await ctx.callbackQuery.message.editText("Статус заказа: в пути", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("support", async (ctx) => {
  // await ctx.callbackQuery.message.editText("Напишите Ваш запрос", {
  //   reply_markup: backKeyboard,
  // });
  await ctx.api.editMessageText(
    ctx.chat.id,
    ctx.update.callback_query.message.message_id,
    "Напишите Ваш запрос",
    {
      reply_markup: backKeyboard,
    }
  );
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("back", async (ctx) => {
  await ctx.callbackQuery.message.editText("Выберите пункт меню", {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackQuery();
});

// bot.command("start", async (stx) => {
//   await stx.react("👍");
//   await stx.reply(
//     `Привет я бот <a href="https://tsg-go.info">tsg-go.info</a>`,
//     {
//       parse_mode: "HTML",
//     }
//   );
// });

// bot.command("start", async (stx) => {
//   await stx.react("👍");
//   await stx.reply(
//     `Привет я бот <a href="https://tsg-go.info">tsg-go.info</a>`,
//     {
//       parse_mode: "HTML",
//     }
//   );
// });

// bot.command("mood", async (ctx) => {
//   const moodKeyboard = new Keyboard()
//     .text("Хорошо")
//     .row()
//     .text("Нормально")
//     .row()
//     .text("Плохо")
//     .row()
//     .resized()
//     .oneTime();
//   await ctx.reply("Как настроение", { reply_markup: moodKeyboard });
// });

// bot.command("share", async (ctx) => {
//   const shareKeyboard = new Keyboard()
//     .requestLocation("Геолокация")
//     .requestContact("Контакт")
//     .requestPoll("Опрос")
//     .placeholder("Укажи данные...")
//     .resized();
//   await ctx.reply("Чем хочешь поделиться?", {
//     reply_markup: shareKeyboard,
//   });
// });

// bot.command("inline_keyboard", async (ctx) => {
//   // const inlineKeyboard = new InlineKeyboard()
//   //   .text("1", "button-1")
//   //   .text("2", "button-2")
//   //   .text("3", "button-3");

//   const inlineKeyboard2 = new InlineKeyboard().text(
//     "Перейти в тг канал",
//     "https://https://t.me/+SJo5sN0kMGVhMjli"
//   );
//   await ctx.reply("Выберите цифру", {
//     reply_markup: inlineKeyboard,
//   });
// });

// регулярные выражения вместо строки в callbackQuery и hears
// bot.callbackQuery(/button-[1-3]/, async (ctx) => {
//   await ctx.answerCallbackQuery("Вы выбрали цифру");
//   await ctx.reply(`Вы нажали на кнопку ${ctx.callbackQuery.data}`);
// });

// bot.on("callback_query:data", async (ctx) => {
//   await ctx.answerCallbackQuery();
//   await ctx.reply(`Вы нажали на кнопку ${ctx.callbackQuery.data}`);
// });

// bot.on(":contact", async (ctx) => {
//   await ctx.reply("Спасибо за контакт");
// });
// bot.hears(/пипец/, async (ctx) => {
//   await ctx.reply("Ругаемся?");
// });

// bot.hears("Хорошо", async (ctx) => {
//   await ctx.reply("Класс", {
//     reply_markup: { remove_keyboard: true },
//   });
// });

bot.catch((err) => {
  const stx = err.stx;
  console.log("stx", stx);
  console.log(`Error while handing ${stx.update.update_id}`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.log("Grammy error", e.description);
  } else if (e instanceof HttpError) {
    console.log("Telegram error", e);
  } else {
    console.log("Unknow error", e);
  }
});

bot.start();
