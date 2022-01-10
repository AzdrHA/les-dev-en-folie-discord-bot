import {GuildMember} from 'discord.js';
import {Captcha} from '../../services/captcha';

export const guildMemberAdd = (member: GuildMember) => {
  new Captcha(member);
};
