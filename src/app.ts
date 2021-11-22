import * as dotenv from 'dotenv';
import {Intents} from 'discord.js';
import App from './components/App/App';
dotenv.config();

new App({
  development: false,
  token: process.env.TOKEN,
  prefixes: ['!', '<@899343860575121470>', '<@!899343860575121470>'],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});
