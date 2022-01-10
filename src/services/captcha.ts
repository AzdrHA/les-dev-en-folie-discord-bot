import {projectDir} from '../constants';
import {createCanvas, loadImage} from 'canvas';
import {GuildMember, MessageAttachment, MessageEmbed} from 'discord.js';
import fs from 'fs';

export class Captcha {
  private member: GuildMember;
  private linePath = projectDir + '/utils/lines';
  private lettersPath = projectDir + '/utils/letters';
  private expirationTime = 15; // in second
  private roleID = process.env.WELCOME_ROLE;

  public constructor(member: GuildMember) {
    this.member = member;
    this.sendCaptcha();
  }

  private async sendCaptcha() {
    const {canvas, letters} = await this.generateCaptcha();

    const embed = new MessageEmbed({
      title: 'Vérification de sécurité',
      description: 'Afin de vérifier que vous êtes bien un humain, entrer les caractères suivants.',
      footer: {
        text: `Vous serez automatique expulsé dans ${this.expirationTime}s si vous ne faite rien!`,
      },
      image: {
        url: 'attachment://captcha.jpg',
      },
    });

    const msg = await this.member.send({embeds: [embed], files: [new MessageAttachment(canvas.toBuffer(), 'captcha.jpg')]});

    const filter = (m) => m.author.id === this.member.id;
    const collection = msg.channel.createMessageCollector({filter, max: 1, time: this.expirationTime*1000});
    collection.on('collect', (m) => {
      if (m.content === letters) {
        collection.stop('end');
        const role = this.member.guild.roles.cache.get(this.roleID);
        if (role) {
          if (!this.member.roles.cache.has(this.roleID)) {
            this.member.roles.add(role);
            m.reply('Captcha correct, vous avez dès maintenant accès au serveur');
          }
        } else m.reply('Rôle introuvable');
      } else {
        if (this.member.guild.members.cache.get(this.member.id).kickable) {
          m.reply('Vous avez été Kick pour Captcha incorrect!');
          this.member.guild.members.cache.get(this.member.id).kick('failed captcha');
        }
      }
    });
    collection.on('end', (collection, reason) => {
      if (reason === 'time') {
        if (this.member.guild.members.cache.get(this.member.id).kickable) {
          this.member.send('Vous avez été Kick pour inactivité');
          this.member.guild.members.cache.get(this.member.id).kick('failed captcha');
        }
      }
    });
  }

  private async generateCaptcha() {
    const allLines = fs.readdirSync(this.linePath);
    const allLetters = fs.readdirSync(this.lettersPath);
    const line = allLines[Math.floor(Math.random() * allLines.length)];

    const canvas = createCanvas(125, 25);
    const ctx = canvas.getContext('2d');

    const canvasLine = await loadImage(this.linePath + '/' + line);
    ctx.drawImage(canvasLine, 0, 0, canvas.width, canvas.height);

    let letters = '';
    for (let i = 0; i < 6; i++) {
      const max = 10;
      const min = -5;
      const rdDY = Math.floor(Math.random() * (max - (-min) + 1)) + min;
      const letter = allLetters[Math.floor(Math.random() * allLetters.length)];
      const letterName = letter.split('.').shift();
      letters = letters + letterName;

      const canvasLetter = await loadImage(this.lettersPath + '/' + letter);
      ctx.drawImage(canvasLetter, (i * 20) + rdDY, rdDY, 25, 25);
    }

    return {canvas, letters};
  }
}
