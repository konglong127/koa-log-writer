const request=require("supertest");
const assert=require('assert');
const fs=require('fs');
const app=require('./app.js');

describe("server print log test",()=>{
  let server=app.listen(8080);
  describe("group one status test",()=>{
    it("request test",async ()=>{

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
    it("log test",async ()=>{
      
      assert.strictEqual(fs.existsSync('./log'),true);
      
      if(!fs.existsSync('./log')) return;

      assert.strictEqual(fs.existsSync('./log/api'),true);
      assert.strictEqual(fs.existsSync('./log/query'),true);
      
    });
  });
});

