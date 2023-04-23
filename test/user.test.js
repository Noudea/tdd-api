import chai from 'chai'
import chaiHttp from 'chai-http'
import api from '../index.js'
import { isUuid, uuid } from 'uuidv4'
import generateAPICallsWithMissingParams from '../api/utils/seed.js'

chai.use(chaiHttp)

const { expect } = chai

const userSeed = {
  lastName: 'Ron',
  firstName: 'Weasley',
  birthDate: '1980-01-01',
  address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
  phone: '+33654543456',
  email: 'ron@mail.com'
}

describe('CRUDS USERS', function () {
  it('GET /users should return status code 200 with user list', function (done) {
    chai.request(api)
      .get('/users')
      .end(function (_, res) {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          data: [{
            id: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f',
            lastName: 'Dumbledore',
            firstName: 'Albus',
            birthDate: '1950-01-01',
            address: 'bureau du directeur,chateau de poudlard',
            phone: '+33654543456',
            email: 'albus@mail.com'
          },
          {
            id: 'c5e0357f-2eb7-4180-84e7-5c8efeab2c83',
            lastName: 'Potter',
            firstName: 'Harry',
            birthDate: '1980-01-01',
            address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
            phone: '+33654543456',
            email: 'harry@mail.com'
          }]
        })
        done()
      })
  })

  it('GET /users/:id should return status code 200 with user', function (done) {
    chai.request(api)
      .get('/users/f92fefd1-4059-447b-89c6-a7e2482f7a5f')
      .end(function (_, res) {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          data: {
            id: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f',
            lastName: 'Dumbledore',
            firstName: 'Albus',
            birthDate: '1950-01-01',
            address: 'bureau du directeur,chateau de poudlard',
            phone: '+33654543456',
            email: 'albus@mail.com'
          }
        })
        done()
      })
  })

  it('GET /users/:id should return status code 404 if user not found', function (done) {
    chai.request(api)
      .get(`/users/${uuid()}`)
      .end(function (_, res) {
        expect(res).to.have.status(404)
        expect(res.body).to.deep.equal({
          error: {
            message: 'User not found',
            status: 404,
            code: 'USER_NOT_FOUND'
          }
        })
        done()
      })
  })

  it('GET /users/:id should return status code 400 if id is not a uuid', function (done) {
    chai.request(api)
      .get('/users/123')
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'id is not valid',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })

  it('POST /users should return status code 201 with user created', function (done) {
    const user = {
      lastName: 'Ron',
      firstName: 'Weasley',
      birthDate: '1980-01-01',
      address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
      phone: '+33654543456',
      email: 'ron@mail.com'
    }
    chai.request(api)
      .post('/users')
      .send(user)
      .end(function (_, res) {
        expect(res).to.have.status(201)
        expect(res.body.data).to.have.property('id')
        expect(res.body).to.deep.equal({
          data: {
            id: res.body.data.id,
            ...user
          }
        })
        done()
      })
  })

  it('POST /users should return status code 201 with id as uuid', function (done) {
    const user = {
      lastName: 'Ron',
      firstName: 'Weasley',
      birthDate: '1980-01-01',
      address: 'lit numéro 3, dortoir des garçons, griffondor, chateau de poudlard',
      phone: '+33654543456',
      email: 'ron@mail.com'
    }

    chai.request(api)
      .post('/users')
      .send(user)
      .end(function (_, res) {
        expect(res).to.have.status(201)
        expect(res.body.data).to.have.property('id')
        const isValid = isUuid(res.body.data.id)
        expect(isValid).to.be.true
        done()
      })
  })

  describe('POST /users should return status code 400 if user object is missing properties', function () {
    const userRequests = generateAPICallsWithMissingParams(userSeed)
    userRequests.forEach((user, index) => {
      const requiredProperties = Object.keys(userSeed) // Get all the required properties from the userSeed object
      const missingProperties = []
      // Verify that all the required properties exist in the user object
      requiredProperties.forEach(function (propertyName) {
        if (!Object.prototype.hasOwnProperty.call(user, propertyName) || user[propertyName] === undefined) {
          missingProperties.push(propertyName)
        }
      })

      it(`POST /users should return status code 400 if user object is missing properties ${missingProperties.join(', ')}`, function (done) {
        chai.request(api)
          .post('/users')
          .send(user)
          .end(function (_, res) {
            expect(res).to.have.status(400)
            expect(res.body).to.deep.equal({
              error: {
                message: `Missing properties: ${missingProperties.join(', ')}`,
                status: 400,
                code: 'BAD_REQUEST'
              }
            })
          })
        done()
      })
    })
  })

  it('POST /users should return status code 400 if phone is malformed', function (done) {
    const user = {
      lastName: 'Ron',
      firstName: 'Weasley',
      birthDate: '1980-01-01',
      address: 'lit numéro 3, dortoir des garçons, griffondor, chateau de poudlard',
      phone: '+57 54543456',
      email: 'ron@mail.com'
    }

    chai.request(api)
      .post('/users')
      .send(user)
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'phone is not valid',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })

  it('POST /users should return status code 400 if birthdate is malformed', function (done) {
    const user = {
      lastName: 'Ron',
      firstName: 'Weasley',
      birthDate: '1980-01-01T00:00:00.000Z',
      address: 'lit numéro 3, dortoir des garçons, griffondor, chateau de poudlard',
      phone: '+33654543456',
      email: 'ron@mail.com'
    }

    chai.request(api)
      .post('/users')
      .send(user)
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'birthDate is not valid format should be YYYY-MM-DD',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })

  it('PUT /users/:id should return status code 200 with user updated', function (done) {
    const user = {
      lastName: 'Potter',
      firstName: 'Harry',
      birthDate: '1980-01-01',
      address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
      phone: '+33654543456',
      email: 'harry@poudlardmail.com'
    }

    chai.request(api)
      .put('/users/c5e0357f-2eb7-4180-84e7-5c8efeab2c83')
      .send(user)
      .end(function (_, res) {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          data: {
            id: 'c5e0357f-2eb7-4180-84e7-5c8efeab2c83',
            lastName: 'Potter',
            firstName: 'Harry',
            birthDate: '1980-01-01',
            address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
            phone: '+33654543456',
            email: 'harry@poudlardmail.com'
          }
        })
        done()
      })
  })

  describe('PUT /users should return status code 400 if user object is missing properties', function () {
    const userRequests = generateAPICallsWithMissingParams(userSeed)
    userRequests.forEach((user, index) => {
      const requiredProperties = Object.keys(userSeed) // Get all the required properties from the userSeed object
      const missingProperties = []
      // Verify that all the required properties exist in the user object
      requiredProperties.forEach(function (propertyName) {
        if (!Object.prototype.hasOwnProperty.call(user, propertyName) || user[propertyName] === undefined) {
          missingProperties.push(propertyName)
        }
      })

      it(`PUT /users should return status code 400 if user object is missing properties ${missingProperties.join(', ')}`, function (done) {
        chai.request(api)
          .put('/users/c5e0357f-2eb7-4180-84e7-5c8efeab2c83')
          .send(user)
          .end(function (_, res) {
            expect(res).to.have.status(400)
            expect(res.body).to.deep.equal({
              error: {
                message: `Missing properties: ${missingProperties.join(', ')}`,
                status: 400,
                code: 'BAD_REQUEST'
              }
            })
          })
        done()
      })
    })
  })

  it('PUT /users should return status code 400 if phone is malformed', function (done) {
    const user = {
      id: 'c5e0357f-2eb7-4180-84e7-5c8efeab2c83',
      lastName: 'Potter',
      firstName: 'Harry',
      birthDate: '1980-01-01',
      address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
      phone: '+3363254543456',
      email: 'harry@mail.com'
    }

    chai.request(api)
      .put('/users/c5e0357f-2eb7-4180-84e7-5c8efeab2c83')
      .send(user)
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'phone is not valid',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })

  it('PUT /users should return status code 400 if birthdate is malformed', function (done) {
    const user = {
      lastName: 'Potter',
      firstName: 'Harry',
      birthDate: '1980-01-01T00:00:00.000Z',
      address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
      phone: '+33654543456',
      email: 'harry@poudlardmail.com'
    }

    chai.request(api)
      .put('/users/c5e0357f-2eb7-4180-84e7-5c8efeab2c83')
      .send(user)
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'birthDate is not valid format should be YYYY-MM-DD',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })

  it('PUT /users/:id should return status code 404 if user not found', function (done) {
    const user = {
      lastName: 'Potter',
      firstName: 'Harry',
      birthDate: '1980-01-01',
      address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
      phone: '+33654543456',
      email: 'harry@mail.com'
    }

    chai.request(api)
      .put(`/users/${uuid()}`)
      .send(user)
      .end(function (_, res) {
        expect(res).to.have.status(404)
        expect(res.body).to.deep.equal({
          error: {
            message: 'User not found',
            status: 404,
            code: 'USER_NOT_FOUND'
          }
        })
        done()
      })
  })

  it('PUT /users/:id should return status code 400 if id is not uuid', function (done) {
    const user = {
      lastName: 'Potter',
      firstName: 'Harry',
      birthDate: '1980-01-01',
      phone: '+33654543456',
      email: 'harry@mail.com'
    }

    chai.request(api)
      .put('/users/123')
      .send(user)
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'id is not valid',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })

  it('DELETE /users/:id should return status code 200 with user deleted', function (done) {
    const deletedUser = {
      id: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f',
      lastName: 'Dumbledore',
      firstName: 'Albus',
      birthDate: '1950-01-01',
      phone: '+33654543456',
      address: 'bureau du directeur,chateau de poudlard',
      email: 'albus@mail.com'
    }

    chai.request(api)
      .delete(`/users/${deletedUser.id}`)
      .end(function (_, res) {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          meta: {
            message: `User ${deletedUser.id} deleted`,
            _deleted: deletedUser
          }
        })
        done()
      })
  })

  it('DELETE /users/:id should return status code 404 if user not found', function (done) {
    chai.request(api)
      .delete(`/users/${uuid()}`)
      .end(function (_, res) {
        expect(res).to.have.status(404)
        expect(res.body).to.deep.equal({
          error: {
            message: 'User not found',
            status: 404,
            code: 'USER_NOT_FOUND'
          }
        })
        done()
      })
  })

  it('DELETE /users/:id should return status code 400 if id is not uuid', function (done) {
    chai.request(api)
      .delete('/users/123')
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'id is not valid',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })
})
