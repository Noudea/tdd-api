import chai from 'chai';
import chaiHttp from 'chai-http';
import api from '../index.js';

// IMPORTANT : For Mocha working, always use function () {}
// (never () => {})

chai.use(chaiHttp);

describe('GET /statusCheck', function () {
  it('should return a success response with api ok', function (done) {
    chai.request(api)
    .get('/statusCheck')
    .end((_, res) => {
      chai.expect(res.statusCode).to.equal(200);
      chai.expect(res.body).to.deep.equal({
        api: "ok"
      });
      done();
    });
  });
});
