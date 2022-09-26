const fs = require('fs');

class WriteFileLogger {
  constructor(opts) {
    this.logPath = opts.logPath;
    this.logSize = opts.logSize;
  }

  done(dirs, type, info) {
    const writeFilePath = `${this.logPath}/${type}/${type}`;
    //console.log(`${writeFilePath}${dirs.length}.log`);
    let stat=fs.statSync(`${writeFilePath}${dirs.length}.log`, 'utf-8');
      
    if (stat.size < this.logSize) {
      let data=fs.readFileSync(`${writeFilePath}${dirs.length}.log`, 'utf-8');
      data += info;
      fs.writeFileSync(`${writeFilePath}${dirs.length}.log`, data, 'utf-8');
    } else {
      fs.writeFileSync(`${writeFilePath}${dirs.length + 1}.log`, info);
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

    dirs = dirs.filter(item => item.startsWith(type) && item.endsWith('.log'));

    return dirs;
  }

  write(opts) {

    try{
      const { type, info } = opts
      //获取路径
      let dirs = this.getFileDirs(type);

      //判断是否有文件
      if (dirs.length == 0) {
        fs.writeFileSync(`${this.logPath}/${type}/${type}1.log`, '');
        dirs.push(`${type}1.log`);
      } else {
        //查看记录到了哪里
        dirs = this.quickSort(dirs, type);
      }

      //console.log(dirs);
      this.done(dirs, type, info);

    }catch(err){
      throw err;
    }

  }

}

module.exports = WriteFileLogger;
