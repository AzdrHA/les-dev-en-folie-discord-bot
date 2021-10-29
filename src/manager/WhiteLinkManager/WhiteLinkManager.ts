import * as fs from 'fs';
import process from 'process';

export class WhiteLinkManagerClass {
  static filePath = process.cwd()+'/data/whiteLink.json';

  static addLink = (link: string) => {
    const filesLink = require(WhiteLinkManagerClass.filePath);
    filesLink.push(link);
    WhiteLinkManagerClass.saveData(filesLink);
  }

  static saveData = (data: any) => {
    try {
      fs.readFile(WhiteLinkManagerClass.filePath, (err) => {
        if (err) {
          fs.writeFile(WhiteLinkManagerClass.filePath, JSON.stringify(data), (err1) => {
            if (err1) throw err1;
            console.log('The file was created in path %s', WhiteLinkManagerClass.filePath);
          });
        }
        fs.writeFileSync(WhiteLinkManagerClass.filePath, JSON.stringify(data));
      });
    } catch (e) {
      throw e;
    }
  }
}
