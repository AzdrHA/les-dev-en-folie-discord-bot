import {GuildMember, Message, MessageAttachment, MessageEmbed} from 'discord.js';
import {Captcha} from '../../services/captcha';
import App from '../../components/App/App';
import * as translation from '../../message.json';

const time = (60 * 10) * 1000; // 10 minutes

export const sendOrModifyEmbed = async (member: GuildMember, embedMessage?: Message|null) => {
  const channelLog = member.guild.channels.cache.get(process.env.LOG_CHANNEL);
  const captcha = await new Captcha().generateCaptcha();

  const embed = new MessageEmbed({
    title: translation.VERIFICATION_OF_SECURITY,
    description: translation.VERIFICATION_OF_SECURITY_TEXT,
    color: '#f9c466',
    footer: {
      text: translation.CAPTCHA_AUTOMATIC_KICK.replace(/{{TIME}}/gi, (time/1000).toString()),
    },
    image: {
      url: 'attachment://captcha.jpg',
    },
  });

  if (embedMessage) {
    await embedMessage.delete();
  }

  embedMessage = await member.send({
    embeds: [embed],
    files: [new MessageAttachment(captcha.canvas.toBuffer(), 'captcha.jpg')],
  });

  const collector = await embedMessage.channel.createMessageCollector({filter: (m) => {
    return m.author.id === member.id;
  }, max: 1, time: time});

  collector.on('collect', (m) => {
    if (m.content === captcha.letters) {
      collector.stop('end');
      const role = member.guild.roles.cache.get(process.env.WELCOME_ROLE);
      if (role) {
        if (!member.roles.cache.has(process.env.WELCOME_ROLE)) {
          member.roles.add(role);
          m.reply(translation.CORRECT_CAPTCHA_MESSAGE
              .replace(/{{CHANNEL_PRESENTATION}}/gi, '<#896846058179682314>')
              .replace(/{{CHANNEL_ROLE}}/gi, '<#896846058179682314>'));
        }
      } else {
        m.reply(translation.ROLE_NOT_FOUND);
        if (channelLog && channelLog.isText()) {
          channelLog.send(translation.ROLE_NOT_FOUND_LOG);
        }
      }
      if (channelLog && channelLog.isText()) {
        channelLog.send(translation.CORRECT_CAPTCHA_MESSAGE_LOG.replace(/{{MEMBER}}/gi, member.user.toString()));
      }
      const arrivedChannel = member.guild.channels.cache.get(process.env.ARRIVED_CHANNEL);
      if (arrivedChannel && arrivedChannel.isText()) {
        arrivedChannel.send(translation.ARRIVED_MESSAGE.replace(/{{MEMBER}}/gi, member.user.toString()));
      }
    } else {
      if (member.guild.members.cache.get(member.id).kickable) {
        m.reply(`${translation.KICKED_INCORRECT_CAPTCHA}\n${'https://discord.gg/vGURVpCxuK'}`);
        member.guild.members.cache.get(member.id).kick('failed captcha');
      }
      if (channelLog && channelLog.isText()) {
        channelLog.send(translation.KICKED_INCORRECT_CAPTCHA_LOG.replace(/{{MEMBER}}/gi, member.user.toString()));
      }
    }
  });
  collector.on('end', (collection, reason) => {
    if (reason === 'time') {
      if (member.guild.members.cache.get(member.id).kickable) {
        member.send(`${translation.KICKED_INCORRECT_CAPTCHA}\n${'https://discord.gg/vGURVpCxuK'}`);
        member.guild.members.cache.get(member.id).kick('failed captcha');
      }
      if (channelLog && channelLog.isText()) {
        channelLog.send(translation.KICKED_TOO_WAITING_CAPTCHA_LOG.replace(/{{MEMBER}}/gi, member.user.toString()));
      }
    }
  });

  await embedMessage.react('🔄');

  await embedMessage.awaitReactions({filter: (reaction, user) => {
    return ['🔄'].includes(reaction.emoji.name) && user.id === member.id;
  }, max: 1, time: time, errors: ['time']})
      .then(() => {
        collector.stop('end');
        sendOrModifyEmbed(member, embedMessage);
      }).catch(() => {
        console.log('catch');
      });
};

export const guildMemberAdd = async (member: GuildMember, client: App) => {
  const channelLog = member.guild.channels.cache.get('933413157974732842');

  sendOrModifyEmbed(member);

  if (channelLog && channelLog.isText()) {
    channelLog.send({
      embeds: [
        new MessageEmbed({
          author: {
            name: `${member.user.username}#${member.user.discriminator}`,
            url: member.avatarURL({size: 256}),
          },
          description: translation.JOINED_SERVER.replace(/{{MEMBER}}/gi, member.user.toString()),
          color: '#f9c466',
        }),
      ],
    });
  }
};
