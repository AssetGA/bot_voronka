const express = require("express");
const app = express();
require("dotenv").config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");
const { checkIfUserIsInGroup, checkSubscriptions } = require("./checkService");

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

const PORT = process.env.PORT || 5000;

const bot = new Bot(process.env.BOT_API_KEY);

bot.use(hydrate());

bot.api.setMyCommands([
  {
    command: "start",
    description: "запуск бота",
  },
  {
    command: "mood",
    description: "Покупка валюты",
  },
  {
    command: "menu",
    description: "Меню",
  },
  {
    command: "checkuser",
    description: "Проверка юзера",
  },
]);

bot.command("start", async (stx) => {
  await stx.reply("Привет я бот");
});

bot.command("mood", async (ctx) => {
  const moodKeyboard = new Keyboard()
    .text("да")
    .row()
    .text("нет")
    .row()
    .resized()
    .oneTime();
  await ctx.reply("Тебя интересует покупка юаня", {
    reply_markup: moodKeyboard,
  });
});

const menuKeyboard = new InlineKeyboard()
  .text("Купить обучение", "order-status")
  .text("Что я получу", "support")
  .text("Какая цена", "price");
const backKeyboard = new InlineKeyboard().text("< назад в меню", "back");

bot.command("menu", async (ctx) => {
  console.log("ctx", ctx.from.id);
  const check = checkIfUserIsInGroup(ctx.from.id);
  const subscriptions = checkSubscriptions();
  if (check) {
    await ctx.reply("Меню", {
      reply_markup: menuKeyboard,
    });
  } else {
    await ctx.reply(
      "Подпишись в группу energy_thread_group и попробуй еще раз"
    );
  }
});

bot.command("checkuser", async (ctx) => {
  const checkKeyboard = new Keyboard().text("check").row().resized();
  await ctx.reply("Проверить", {
    reply_markup: checkKeyboard,
  });
});

// editText добавляется из hydrate
bot.callbackQuery("order-status", async (ctx) => {
  await ctx.callbackQuery.message.editText(
    `Kaspi <a href="https://tsg-go.info">tsg-go.info</a>`,
    {
      reply_markup: backKeyboard,
    }
  );
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("support", async (ctx) => {
  await ctx.callbackQuery.message.editText(
    `Вы получите наиболее выгодный курс покупки и продажи юаня.
    Вы получите видеоматериалы для изучения и полного повторения действий в результате, которых вы сможете осуществить покупку и продажу, и научитесь это делать самостоятельно.
    Вы научитесь использовать криптовалюты как средство платежа.`,
    {
      reply_markup: backKeyboard,
    }
  );
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("price", async (ctx) => {
  await ctx.callbackQuery.message.editText("20000 тенге", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("back", async (ctx) => {
  await ctx.callbackQuery.message.editText("Выберите пункт меню", {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.hears("да", async (ctx) => {
  await ctx.reply("Класс я могу научить тебя заходи в меню", {
    reply_markup: { remove_keyboard: true },
  });
});

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

const webhookUrl = "https://grammy-omega.vercel.app/api/telegram-bot";

bot.setWebHook(webhookUrl);

bot.start();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
