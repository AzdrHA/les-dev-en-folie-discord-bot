import {Message} from 'discord.js';
import {discordWhiteList, regexLink} from '../../constants';
import {WhiteLinkManagerClass} from '../../manager/WhiteLinkManager/WhiteLinkManager';

class MessageClass {
  public messageCreate = async (message: Message, prefixes: string[]): Promise<any> => {
    if (message.author.bot || message.guild && (!discordWhiteList.includes(message.guild.id))) return;

    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      if (message.content.match(regexLink)) {
        const filesLink: string[] = require(WhiteLinkManagerClass.filePath);
        for (const match of message.content.match(regexLink)) {
          if (!filesLink.includes(match)) {
            await message.delete();
            return message.channel.send(`${message.author.toString()}, L'utilisation de liens est proscrit!`);
          }
        }
      }
    }

    const prefix = prefixes.find((p) => message.content.toLowerCase().startsWith(p));
    if (!prefix || message.content.slice(0, prefix.length).toLowerCase() !== prefix.toLowerCase()) return;

    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'whitelink') {
      if (!args[0]) return message.reply({content: 'Vous devez insérer un nom de domaine!'});
      WhiteLinkManagerClass.addLink(args[0]);
    }
    return message;
  }
}

const messageCreate = new MessageClass().messageCreate;
export default messageCreate;
