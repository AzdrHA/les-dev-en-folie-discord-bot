import * as fs from 'fs';
import process from 'process';

export class WhiteLinkManagerClass {
  static filePath = process.cwd()+'/data/whiteLink.json';

  static addLink = async (link: string) => {
    return new Promise(async (resolve, reject) => {
      const filesLink = require(WhiteLinkManagerClass.filePath);
      if (link.endsWith('/')) link.slice(0, -1);
      const fileAlreadySaved = filesLink.filter((el) => el.startsWith(link));
      if (fileAlreadySaved) {
        return reject(new Error('link already saved'));
      }
      filesLink.push(link);
      await WhiteLinkManagerClass.saveData(filesLink);
      resolve('');
    });
  }

  static saveData = async (data: any) => {
    try {
      await fs.readFile(WhiteLinkManagerClass.filePath, async (err) => {
        if (err) {
          await fs.writeFile(WhiteLinkManagerClass.filePath, JSON.stringify(data), (err1) => {
            if (err1) throw err1;
            console.log('The file was created in path %s', WhiteLinkManagerClass.filePath);
          });
        }
        await fs.writeFileSync(WhiteLinkManagerClass.filePath, JSON.stringify(data));
      });
    } catch (e) {
      throw e;
    }
  }
}
