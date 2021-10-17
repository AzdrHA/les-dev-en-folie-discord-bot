import * as dotenv from 'dotenv';
import * as fs from 'fs';
import {Message} from 'discord.js';
dotenv.config();

const {Client, Intents} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.DIRECT_MESSAGES,
]});

const guildWhiteList = ['896803623886028900', '779076217877561402'];
const defaultWhiteLink = ['https://www.youtube.com'];
const reLink = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  fs.readFile('whiteLink.json', (err, data) => {
    if (err) {
      fs.writeFile('whiteLink.json', JSON.stringify(defaultWhiteLink), (err1) => {
        if (err1) throw err1;
        console.log('file whiteLink.json created');
      });
    }
  });
});

const prefix = '!';

const badLink = async (message: Message) => {
  await message.delete();
  return message.channel.send(`${message.author.toString()}, L'utilisation de liens est proscrit!`);
};

client.on('messageCreate', async (message) => {
  if (message.author.bot || message.guild && (!guildWhiteList.includes(message.guild.id))) return false;

  if (!message.member.permissions.has('MANAGE_MESSAGES')) {
    if (message.content.match(reLink)) {
      const filesLink: string[] = require('../whiteLink.json');
      for (const match of message.content.match(reLink)) {
        if (!filesLink.includes(match)) return badLink(message);
      }
    }
  }

  console.log('1');
  if (message.content.slice(0, prefix.length).toLowerCase() !== prefix.toLowerCase()) return;
  console.log('2');

  const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  console.log('3');

  if (command === 'whitelink') {
    if (!args[0]) return message.reply({content: 'Vous devez insérer un nom de domaine!'});
    const filesLink: string[] = require('../whiteLink.json');
    filesLink.push(args[0]);
    console.log('4');

    try {
      fs.writeFileSync('whiteLink.json', JSON.stringify(filesLink));
      return message.reply({content: `<${args[0]}> à bien été ajouté à la whitelink!`});
    } catch (e) {
      throw e;
    }
  }
});

client.login(process.env.TOKEN);
