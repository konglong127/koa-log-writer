const fs = require('fs');

class WriteFileLogger {
  constructor(opts) {
    this.logPath = opts.logPath;
    this.logSize = opts.logSize;
    this.extension = opts.extension;
  }

  done(dirs, type, info) {
    const writeFilePath = `${this.logPath}/${type}/${type}`;
    //console.log(`${writeFilePath}${dirs.length}.log`);
    let stat = fs.statSync(`${writeFilePath}${dirs.length}.${this.extension}`, 'utf-8');

    if (stat.size < this.logSize) {
      // one
      // let data=fs.readFileSync(`${writeFilePath}${dirs.length}.log`, 'utf-8');
      // data += info;
      // two
      fs.appendFileSync(`${writeFilePath}${dirs.length}.${this.extension}`, info, 'utf-8');
      // three
      // const ws = fs.createWriteStream(`${writeFilePath}${dirs.length}.log`, { 'flags': 'a' });
      // ws.write(info);
      // ws.end();

    } else {
      fs.writeFileSync(`${writeFilePath}${dirs.length + 1}.${this.extension}`, info);

      // const ws = fs.createWriteStream(`${writeFilePath}${dirs.length + 1}.log`, { 'flags': 'a' });
      // ws.write(info);
      // ws.end();
    }

  }

  quickSort(arr, type) {
    if (arr.length <= 1) return arr;

    const pivotIndex = Math.floor(arr.length / 2);
    const pivot = arr.splice(pivotIndex, 1)[0];
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length; i++) {
      if (parseInt(arr[i].slice(type.length, arr[i].length)) <
        parseInt(pivot.slice(5, pivot.length))) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return [...this.quickSort(left, type), pivot, ...this.quickSort(right, type)];
  }

  getFileDirs(type) {
    let dirs;

    if (fs.existsSync(`${this.logPath}/${type}`)) {
      dirs = fs.readdirSync(`${this.logPath}/${type}`, 'utf-8');
    } else {
      fs.mkdirSync(`${this.logPath}/${type}`);
      dirs = [];
    }

    if (!Array.isArray(dirs)) {
      throw `${this.logPath} path error`;
    }

    dirs = dirs.filter(item => item.startsWith(type) && item.endsWith(`.${this.extension}`));

    return dirs;
  }

  write(opts) {

    const { type, info } = opts
    // get file dir return array
    let dirs = this.getFileDirs(type);

    // check whether there are files in folder
    if (dirs.length == 0) {
      fs.writeFileSync(`${this.logPath}/${type}/${type}1.${this.extension}`, '');
      dirs.push(`${type}1.${this.extension}`);
    } else {
      // reorder files
      dirs = this.quickSort(dirs, type);
    }

    //console.log(dirs);
    this.done(dirs, type, info);

  }

}

module.exports = WriteFileLogger;
