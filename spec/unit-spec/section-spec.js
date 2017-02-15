require('should');
const request = require('supertest');
const app = require('../../app');
const constant = require('../../config/constant');

describe('SectionController', () => {
  it('GET /sections should return all sections', (done)=> {
    request(app)
        .get('/sections')
        .expect(constant.httpCode.OK)
        .expect((res) => {
          res.body.totalCount.should.eql(1);
        })
        .end(done);
  })

  it('GET /sections should return one section', (done)=> {
    request(app)
        .get('/sections/58a475e8b8d7221423da4513')
        .expect(constant.httpCode.OK)
        .expect((res) => {
          res.body.should.eql({
            "__v": 0,
            "_id": "58a475e8b8d7221423da4513",
            "homeworks": [
              {
                "_id": "58a3c743e62b3d27e5e824da"
              }],
            "title": "section1",
            "paper": "58a3e3d4a9ccc534959e4001"
          });
        })
        .end(done);
  })

  it('POST /sections should create section and return uri', (done)=> {
    const section = {
      title: "section11111111",
      homeworks: ["58a3c743e62b3d27e5e824da"],
      paper: "58a3e3d4a9ccc534959e4001"
    };
    request(app)
        .post('/sections')
        .send(section)
        .expect(constant.httpCode.CREATED)
        .expect((res) => {
          const result = /^sections\/(.*)$/.test(res.body.uri);
          result.should.eql(true);
        })
        .end(done);
  })

  it('PUT /sections should update section', (done)=> {
    const section = {
      title: "section11111111"
    };
    request(app)
        .put('/sections/58a475e8b8d7221423da4513')
        .send(section)
        .expect(constant.httpCode.NO_CONTENT)
        .end(done);
  })

  it('DELETE /sections should delete section', (done)=> {
    request(app)
        .delete('/sections/58a475e8b8d7221423da4513')
        .expect(constant.httpCode.NO_CONTENT)
        .end(done);
  })
});