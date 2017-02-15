require('should');
const request = require('supertest');
const app = require('../../app');
const constant = require('../../config/constant');

describe('PaperController', () => {
  it('GET /papers should return all papers', (done)=> {
    request(app)
        .get('/papers')
        .expect(constant.httpCode.OK)
        .expect((res) => {
          res.body.totalCount.should.eql(1);
        })
        .end(done);
  })

  it('GET /papers should return one paper', (done)=> {
    request(app)
        .get('/papers/58a3e3d4a9ccc534959e4001')
        .expect(constant.httpCode.OK)
        .expect((res) => {
          res.body.should.eql({
            "__v": 0,
            "_id": "58a3e3d4a9ccc534959e4001",
            "paperInfo": "paperInfo test",
            "paperName": "paperName test",
            "sections": {
              "__v": 0,
              "_id": "58a475e8b8d7221423da4513",
              "homeworks": [
                {
                  "__v": 0,
                  "_id": "58a3c743e62b3d27e5e824da",
                  "description": "i am homework1",
                  "name": "homework1",
                }
              ],
              "paper": "58a3e3d4a9ccc534959e4001",
              "title": "section1"
            }

          });
        })
        .end(done);
  })

  it('POST /papers should create paper and return uri', (done)=> {
    const paper = {
      paperName: "paperName",
      paperInfo: "paperInfo"
    };
    request(app)
        .post('/papers')
        .send(paper)
        .expect(constant.httpCode.CREATED)
        .expect((res) => {
          const result = /^papers\/(.*)$/.test(res.body.uri);
          result.should.eql(true);
        })
        .end(done);
  })

  it('PUT /papers should update paper', (done)=> {
    const paper = {
      paperName: "paperName",
      paperInfo: "paperInfo"
    };
    request(app)
        .put('/papers/58a3e3d4a9ccc534959e4001')
        .send(paper)
        .expect(constant.httpCode.NO_CONTENT)
        .end(done);
  })

  it('DELETE /papers should delete paper', (done)=> {
    request(app)
        .delete('/papers/58a3e3d4a9ccc534959e4001')
        .expect(constant.httpCode.NO_CONTENT)
        .end(done);
  })
});