import {Message} from 'discord.js';
import {discordWhiteList, regexLink} from '../../constants';
import {WhiteLinkManagerClass} from '../../manager/WhiteLinkManager/WhiteLinkManager';
import App from '../../components/App/App';

class MessageClass {
  public messageCreate = async (message: Message, client: App, prefixes: string[]): Promise<any> => {
    if (message.author.bot || message.guild && (!discordWhiteList.includes(message.guild.id))) return;
    if (client.development && message.author.id !== '311874717504110593') return;

    const prefix = prefixes.find((p) => message.content.toLowerCase().startsWith(p));
    const args: string[] = prefix ? message.content.slice(prefix.length).trim().split(/ +/g) : null;
    const command = args ? args.shift().toLowerCase() : null;

    if ((command && command !== 'whitelink') && !message.member.permissions.has('MANAGE_MESSAGES')) {
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

    // if (!prefix || message.content.slice(0, prefix.length).toLowerCase() !== prefix.toLowerCase()) return;

    if (command === 'whitelink') {
      if (message.author.id !== '311874717504110593' && !message.member.permissions.has('MANAGE_MESSAGES')) {
        return message.reply({content: 'Vous n\'avez pas les permissions pour ajouter un lien!'});
      }

      if (!args[0]) return message.reply({content: 'Vous devez insérer un nom de domaine!'});
      WhiteLinkManagerClass.addLink(args[0]).then(() => {
        return message.reply({content: '<:check:912363879470870608> Le lien a bien été enregistré'});
      }).catch(() => {
        return message.reply({content: '<:warning:912363891034566666> Le lien a déjà été ajouté!'});
      });
    }
    return message;
  }
}

const messageCreate = new MessageClass().messageCreate;
export default messageCreate;
