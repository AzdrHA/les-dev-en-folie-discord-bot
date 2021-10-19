import * as fs from 'fs';
import process from 'process';
import {projectDir} from '../../app';

export class WhiteLinkManagerClass {
  public filePath = process.cwd()+'/data/whiteLink.json';

  public addLink = (link: string) => {
    const filesLink = require(this.filePath);
    filesLink.push(link);
    this.saveData(filesLink);
  }

  public saveData = (data: any) => {
    console.log(projectDir());
    try {
      fs.readFile(this.filePath, (err) => {
        if (err) {
          fs.writeFile(this.filePath, JSON.stringify(data), (err1) => {
            if (err1) throw err1;
            console.log('The file was created in path %s', this.filePath);
          });
        }
        fs.writeFileSync(this.filePath, JSON.stringify(data));
      });
    } catch (e) {
      throw e;
    }
  }
}

const whiteLinkManager = new WhiteLinkManagerClass();
export default whiteLinkManager;
