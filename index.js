const { Client } = require('discord.js');
const { Lobby } = require('./lobby.js');

const BOT_ID = 'YOUR_BOT_ID';
const BOT_TOKEN = 'YOUR_BOT_TOKEN';
const PREFIX = '<@' + BOT_ID + '> ';
const TICK_RATE = 3000;

const lobby = new Lobby(1);
const events = [];

const cmds = new Map();
cmds.set('join', ctx => lobby.join(ctx.author, msg => ctx.reply(msg)));
cmds.set('leave', ctx => lobby.leave(ctx.author, msg => ctx.reply(msg)));
cmds.set('show', ctx => lobby.show(msg => ctx.reply(msg)));

const bot = new Client();
bot.setInterval(() => lobby.tick(), TICK_RATE);
bot.on('message', ctx => {
    if (!ctx.content.startsWith(PREFIX)) {
        return;
    }
    const cmd = ctx.content.slice(PREFIX.length);
    if (cmds.has(cmd)) {
        cmds.get(cmd)(ctx);
    } else {
        ctx.reply('Unknown command.');
    }
});
bot.login(BOT_TOKEN);