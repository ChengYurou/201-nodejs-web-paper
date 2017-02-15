require('should');
const request = require('supertest');
const app = require('../../app');
const constant = require('../../config/constant');

describe('HomeworkController', () => {
  it('GET /homeworks should return all homeworks', (done)=> {
    request(app)
        .get('/homeworks')
        .expect(constant.httpCode.OK)
        .expect((res) => {
          res.body.totalCount.should.eql(1);
        })
        .end(done);
  })

  it('GET /homeworks should return one homework', (done)=> {
    request(app)
        .get('/homeworks/58a3c743e62b3d27e5e824da')
        .expect(constant.httpCode.OK)
        .expect((res) => {
          res.body.should.eql({
            "_id": "58a3c743e62b3d27e5e824da",
            "name": "homework1",
            "description": "i am homework1",
            "uri": "homeworks/58a3c743e62b3d27e5e824da",
            "__v": 0
          });
        })
        .end(done);
  })

  it('POST /homeworks should create homework and return uri', (done)=> {
    const homework = {
      name: "homework test",
      description: "description"
    };
    request(app)
        .post('/homeworks')
        .send(homework)
        .expect(constant.httpCode.CREATED)
        .expect((res) => {
          const result = /^homeworks\/(.*)$/.test(res.body.uri);
          result.should.eql(true);
        })
        .end(done);
  })

  it('PUT /homeworks should update homework', (done)=> {
    const homework = {
      name: "homework test",
      description: "description"
    };
    request(app)
        .put('/homeworks/58a3c743e62b3d27e5e824da')
        .send(homework)
        .expect(constant.httpCode.NO_CONTENT)
        .end(done);
  })

  it('DELETE /homeworks can not delete homework in section', (done)=> {
    request(app)
        .delete('/homeworks/58a3c743e62b3d27e5e824da')
        .expect(constant.httpCode.BAD_REQUEST)
        .end(done);
  })
});