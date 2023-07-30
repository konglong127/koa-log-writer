const request=require("supertest");
const assert=require('assert');
const fs=require('fs');
const app=require('./app.js');

function deleteFile(filePath){
  let state=fs.statSync(filePath);
  if(state.isDirectory()){
    let dir=fs.readdirSync(filePath);
    for(let i in dir){
      let tmp=`${filePath}/${dir[i]}`;
      if(fs.statSync(tmp).isDirectory()){
        deleteFile(tmp);
        fs.rmdirSync(tmp);
        console.log('文件夹\'',tmp,'\'已删除');
      }else{
        console.log('文件\'',tmp,'\'已删除');
        fs.unlinkSync(tmp);
      }
    }
  }else{
    console.log('文件\'',filePath,'\'已删除');
    fs.unlinkSync(filePath);
  }
}

describe("server print log test",()=>{
  
  if(fs.existsSync('./log')){
    deleteFile('./log');
  }

  let server=app.listen(8080);
  describe("group one status test",()=>{
    it("request test",async function (){
      this.timeout(60000);

      await request(server)
        .get('/').expect(200,'ok');

      await request(server)
        .get('/200').expect(200,'hello world');
      
      await request(server)
        .get('/301').expect(301);

      await request(server)
        .get('/304').expect(304);

      await request(server)
        .get('/404').expect(404,'not found');

      await request(server)
        .get('/500').expect(500,'server error');

    });
  });

  describe("group two write log test",()=>{
    it("log test",async function(){
      this.timeout(60000);

      assert.strictEqual(fs.existsSync('./log'),true);

      assert.strictEqual(fs.existsSync('./log/api'),true);
      assert.strictEqual(fs.existsSync('./log/query'),true);

      assert.strictEqual(fs.existsSync('./log/api/api1.txt'),true);
      assert.strictEqual(fs.existsSync('./log/query/query1.txt'),true);

      assert.strictEqual(fs.statSync('./log/api/api1.txt').size>100000,true);
      assert.strictEqual(fs.statSync('./log/query/query1.txt').size>100000,true);      
    });
  });

  after(() => {
    server.close();
  });
});

