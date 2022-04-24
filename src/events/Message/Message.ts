import {Message} from 'discord.js';
import {
  defaultWhiteLink,
  discordWhiteList,
  excludeChannelVerify,
  regexLink,
} from '../../constants';
import {WhiteLinkManagerClass} from '../../manager/WhiteLinkManager/WhiteLinkManager';
import App from '../../components/App/App';
import * as translation from '../../message.json';

export const messageCreate = async (message: Message, client: App, prefixes: string[]): Promise<any> => {
  if (message.author.bot || message.guild && (!discordWhiteList.includes(message.guild.id))) return;
  if (client.development && (message.channel.id !== '933413191994728510' || (message.author.id !== '311874717504110593' && message.author.id !== '649352959364169739'))) return;

  const prefix = prefixes.find((p) => message.content.toLowerCase().startsWith(p));
  const args: string[] = prefix ? message.content.slice(prefix.length).trim().split(/ +/g) : null;
  const command = args ? args.shift().toLowerCase() : null;
  console.log('1');


  if ((command && command !== 'whitelink') && !message.member.permissions.has('MANAGE_MESSAGES')) {
    console.log('1.1');

    if (!excludeChannelVerify.includes(message.channel.id) && message.content.match(regexLink)) {
      console.log('1.2');
      let filesLink: string[] = require(WhiteLinkManagerClass.filePath);
      filesLink = filesLink.concat(defaultWhiteLink);

      for (const match of message.content.match(regexLink)) {
        if (!filesLink.includes(match)) {
          console.log('1.3');
          await message.delete();
          return message.channel.send(`${message.author.toString()}, ${translation.LINK_FORBIDDEN}`);
        }
      }
    }
  }

  console.log('2');
  if (command === 'whitelink') {
    console.log('3');
    if (message.author.id !== '311874717504110593' && !message.member.permissions.has('MANAGE_MESSAGES')) {
      console.log('3.1');
      return message.reply({content: translation.BAD_PERMISSION_TO_ADD_LINK});
    }

    console.log('4');
    if (!args[0]) return message.reply({content: translation.NEED_INSERT_TO_DOMAIN_NAME});
    console.log('5');

    WhiteLinkManagerClass.addLink(args[0]).then(() => {
      console.log('6');
      return message.reply({content: translation.LINK_ADDED});
    }).catch(() => {
      console.log('7');

      return message.reply({content: translation.LINK_ALREADY_ADDED});
    });
  }
  return message;
};

