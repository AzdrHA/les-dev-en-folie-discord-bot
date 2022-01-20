import {GuildMember, MessageAttachment, MessageEmbed} from 'discord.js';
import {Captcha} from '../../services/captcha';
import App from '../../components/App/App';

export const guildMemberAdd = async (member: GuildMember, client: App) => {
  const captcha = await new Captcha().generateCaptcha();

  const channelLog = client.channels.cache.get(process.env.LOG_CHANNEL);
  if (channelLog && channelLog.isText()) {
    channelLog.send({
      embeds: [
        new MessageEmbed({
          author: {
            name: `${member.user.username}#${member.user.discriminator}`,
            url: member.displayAvatarURL(),
          },
          description: `${member.user.toString()} vient de rejoindre le serveur.`,
          color: '#f9c466',
          footer: {
            text: `Captcha validation: ${captcha.letters}`,
          },
          image: {
            url: 'attachment://captcha.jpg',
          },
        }),
      ],
      files: [new MessageAttachment(captcha.canvas.toBuffer(), 'captcha.jpg')],
    });
  }

  const embed = new MessageEmbed({
    title: 'Vérification de sécurité',
    description: 'Afin de vérifier que vous êtes bien un humain, entrer les caractères suivants.',
    color: '#f9c466',
    footer: {
      text: `Vous serez automatique expulsé dans 60s si vous ne faite rien!`,
    },
    image: {
      url: 'attachment://captcha.jpg',
    },
  });

  const msg = await member.send({
    embeds: [embed],
    files: [new MessageAttachment(captcha.canvas.toBuffer(), 'captcha.jpg')],
  });

  const filter = (m) => m.author.id === member.id;
  const collection = msg.channel.createMessageCollector({filter, max: 1, time: 60 * 1000});
  collection.on('collect', (m) => {
    if (m.content === captcha.letters) {
      collection.stop('end');
      const role = member.guild.roles.cache.get(process.env.WELCOME_ROLE);
      if (role) {
        if (!member.roles.cache.has(process.env.WELCOME_ROLE)) {
          member.roles.add(role);
          m.reply('Captcha correct, vous avez dès maintenant accès au serveur');
        }
      } else m.reply('Rôle introuvable');
      if (channelLog && channelLog.isText()) {
        channelLog.send(`:white_check_mark: ${member.user.toString()} a passé la vérification !`);
      }
    } else {
      if (member.guild.members.cache.get(member.id).kickable) {
        m.reply(`Vous avez été Kick pour Captcha incorrect!\n${'https://discord.gg/vGURVpCxuK'}`);
        member.guild.members.cache.get(member.id).kick('failed captcha');
      }
      if (channelLog && channelLog.isText()) {
        channelLog.send(`:no_entry_sign: ${member.user.toString()} a été expulsé pour ne pas avoir complété le captcha !`);
      }
    }
  });
  collection.on('end', (collection, reason) => {
    if (reason === 'time') {
      if (member.guild.members.cache.get(member.id).kickable) {
        member.send(`Vous avez été Kick pour inactivité\n${'https://discord.gg/vGURVpCxuK'}`);
        member.guild.members.cache.get(member.id).kick('failed captcha');
      }
      if (channelLog && channelLog.isText()) {
        channelLog.send(`:no_entry_sign: ${member.user.toString()} a trop attendu pour compléter le captcha et a été expulsé !`);
      }
    }
  });
};
