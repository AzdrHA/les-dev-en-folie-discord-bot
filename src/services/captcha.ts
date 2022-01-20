import {projectDir} from '../constants';
import {Canvas, createCanvas, loadImage} from 'canvas';
import fs from 'fs';

export class Captcha {
  private linePath = projectDir + '/utils/lines';
  private lettersPath = projectDir + '/utils/letters';

  private canvas: Canvas;
  private letters: string = '';

  private randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - (-min) + 1)) + min;
  }

  private rdDX = () => this.randomNumber(-5, 10)
  private rdDY = () => this.randomNumber(-5, 10)

  public async generateCaptcha() {
    const allLines = fs.readdirSync(this.linePath);
    const allLetters = fs.readdirSync(this.lettersPath);
    const line = allLines[Math.floor(Math.random() * allLines.length)];

    this.canvas = createCanvas(125, 25);
    const ctx = this.canvas.getContext('2d');

    const canvasLine = await loadImage(this.linePath + '/' + line);
    ctx.drawImage(canvasLine, 0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < 6; i++) {
      const letter = allLetters[Math.floor(Math.random() * allLetters.length)];
      const letterName = letter.split('.').shift();
      this.letters = this.letters + letterName;

      const canvasLetter = await loadImage(this.lettersPath + '/' + letter);

      ctx.drawImage(canvasLetter, (i * 20) + this.rdDX(), ((this.canvas.height - canvasLetter.height )/ 2) + this.rdDY());
    }

    return {canvas: this.canvas, letters: this.letters};
  }
}
