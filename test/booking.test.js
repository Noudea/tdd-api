import chai from 'chai'
import chaiHttp from 'chai-http'
import api from '../index.js'
import { isUuid, uuid } from 'uuidv4'
import generateAPICallsWithMissingParams from '../api/utils/seed.js'
import Book from '../api/model/Book.js'
import User from '../api/model/User.js'

chai.use(chaiHttp)

const { expect } = chai

const bookingSeed = {
  rentDate: '2020-01-01',
  returnDate: '2020-01-10',
  item: '9782744005084',
  user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
}

describe('CRUDS BOOKING', () => {
  it('GET /bookings should return status code 200 with booking list', function (done) {
    chai.request(api)
      .get('/bookings')
      .end(function (_, res) {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          data: [
            {
              id: '9dedb660-b74d-4c5e-a31f-a0a7850f8a70',
              rentDate: '2020-01-01',
              returnDate: '2020-01-10',
              item: {
                isbn13: '9782744005084',
                title: 'UML et C++',
                authors: 'Richard C. Lee, William M. Tepfenhart',
                editor: 'CampusPress',
                langCode: 'FR',
                price: 29.95
              },
              user: {
                id: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f',
                lastName: 'Dumbledore',
                firstName: 'Albus',
                birthDate: '1950-01-01',
                phone: '+33654543456',
                address: 'bureau du directeur,chateau de poudlard',
                email: 'albus@mail.com'
              }
            },
            {
              id: '03184513-9be7-469d-810d-f0ae6ae6b229',
              rentDate: '2020-01-01',
              returnDate: '2020-01-10',
              item: {
                isbn13: '9782746035966',
                title: 'Cree su primer sitio web con dreamweaver 8',
                authors: 'B.A. GUERIN',
                editor: 'ENI',
                langCode: 'ES',
                price: 10.02
              },
              user: {
                id: 'c5e0357f-2eb7-4180-84e7-5c8efeab2c83',
                lastName: 'Potter',
                firstName: 'Harry',
                birthDate: '1980-01-01',
                phone: '+33654543456',
                address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
                email: 'harry@mail.com'
              }
            }
          ]
        })
      })
    done()
  })
  it('GET /bookings/:id should return status code 200 with booking', function (done) {
    chai.request(api)
      .get('/bookings/9dedb660-b74d-4c5e-a31f-a0a7850f8a70')
      .end(function (_, res) {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          data: {
            id: '9dedb660-b74d-4c5e-a31f-a0a7850f8a70',
            rentDate: '2020-01-01',
            returnDate: '2020-01-10',
            item: {
              isbn13: '9782744005084',
              title: 'UML et C++',
              authors: 'Richard C. Lee, William M. Tepfenhart',
              editor: 'CampusPress',
              langCode: 'FR',
              price: 29.95
            },
            user: {
              id: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f',
              lastName: 'Dumbledore',
              firstName: 'Albus',
              birthDate: '1950-01-01',
              phone: '+33654543456',
              address: 'bureau du directeur,chateau de poudlard',
              email: 'albus@mail.com'
            }
          }
        })
        done()
      })
  })
  it('GET /bookings/:id should return status code 404 if booking not found', function (done) {
    chai.request(api)
      .get(`/bookings/${uuid()}`)
      .end(function (_, res) {
        expect(res).to.have.status(404)
        expect(res.body).to.deep.equal({
          error: {
            message: 'Booking not found',
            status: 404,
            code: 'BOOKING_NOT_FOUND'
          }
        })
        done()
      })
  })
  it('GET /bookings/:id should return status code 400 if id is not a uuid', function (done) {
    chai.request(api)
      .get('/bookings/123')
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
  describe('POST /bookings should return status code 400 if user object is missing properties', function () {
    const bookingRequests = generateAPICallsWithMissingParams(bookingSeed)
    bookingRequests.forEach((booking, index) => {
      const requiredProperties = Object.keys(bookingSeed) // Get all the required properties from the userSeed object
      const missingProperties = []
      // Verify that all the required properties exist in the user object
      requiredProperties.forEach(function (propertyName) {
        if (!Object.prototype.hasOwnProperty.call(booking, propertyName) || booking[propertyName] === undefined) {
          missingProperties.push(propertyName)
        }
      })

      it(`POST /bookings should return status code 400 if user object is missing properties ${missingProperties.join(', ')}`, function (done) {
        chai.request(api)
          .post('/bookings')
          .send(booking)
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
  it('POST /bookings should return status code 201 with booking created', function (done) {
    const booking = {
      rentDate: '2020-01-01',
      returnDate: '2020-01-10',
      item: '9782744005084',
      user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
    }
    chai.request(api)
      .post('/bookings')
      .send(booking)
      .end(function (_, res) {
        expect(res).to.have.status(201)
        expect(res.body.data).to.have.property('id')
        expect(res.body).to.deep.equal({
          data: {
            id: res.body.data.id,
            rentDate: '2020-01-01',
            returnDate: '2020-01-10',
            item: {
              isbn13: '9782744005084',
              title: 'UML et C++',
              authors: 'Richard C. Lee, William M. Tepfenhart',
              editor: 'CampusPress',
              langCode: 'FR',
              price: 29.95
            },
            user: {
              id: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f',
              lastName: 'Dumbledore',
              firstName: 'Albus',
              birthDate: '1950-01-01',
              phone: '+33654543456',
              address: 'bureau du directeur,chateau de poudlard',
              email: 'albus@mail.com'
            }
          }
        })
        done()
      })
  })
  it('POST /bookings should return status code 201 with id as uuid', function (done) {
    const booking = {
      rentDate: '2020-01-01',
      returnDate: '2020-01-10',
      item: '9782744005084',
      user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
    }

    chai.request(api)
      .post('/bookings')
      .send(booking)
      .end(function (_, res) {
        expect(res).to.have.status(201)
        expect(res.body.data).to.have.property('id')
        const isValid = isUuid(res.body.data.id)
        expect(isValid).to.be.true
        done()
      })
  })
  it('POST /bookings should return status code 400 if rentDate is malformed', function (done) {
    const booking = {
      rentDate: '21-12-2023',
      returnDate: '2020-01-10',
      item: '9782744005084',
      user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
    }

    chai.request(api)
      .post('/bookings')
      .send(booking)
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'rentDate is not valid format should be YYYY-MM-DD',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })
  it('POST /bookings should return status code 400 if returnDate is malformed', function (done) {
    const booking = {
      rentDate: '2020-01-01',
      returnDate: '21-12-2023',
      item: '9782744005084',
      user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
    }

    chai.request(api)
      .post('/bookings')
      .send(booking)
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'returnDate is not valid format should be YYYY-MM-DD',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })
  it('/POST /bookings should return status code 400 if item is not a isbn13', function (done) {
    chai.request(api)
      .post('/bookings')
      .send({
        rentDate: '2020-01-01',
        returnDate: '2020-01-10',
        item: '123',
        user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
      })
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'item is not valid, should be isnb13',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })
  it('/POST /bookings should return status code 400 if user is not a uuid', function (done) {
    chai.request(api)
      .post('/bookings')
      .send({
        rentDate: '2020-01-01',
        returnDate: '2020-01-10',
        item: '9782744005084',
        user: '123'
      })
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'user is not valid',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })
  it('POST /bookings should return status code 404 if item not found', function (done) {
    chai.request(api)
      .post('/bookings')
      .send({
        rentDate: '2020-01-01',
        returnDate: '2020-01-10',
        item: '9782744005087',
        user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
      })
      .end(function (_, res) {
        expect(res).to.have.status(404)
        expect(res.body).to.deep.equal({
          error: {
            message: 'Book not found',
            status: 404,
            code: 'BOOK_NOT_FOUND'
          }
        })
        done()
      })
  })
  it('POST /bookings should return status code 404 if users not found', function (done) {
    chai.request(api)
      .post('/bookings')
      .send({
        rentDate: '2020-01-01',
        returnDate: '2020-01-10',
        item: '9782744005084',
        user: 'f92fefd1-4059-447b-89c6-a7e2482f795f'
      })
      .end(function (_, res) {
        expect(res).to.have.status(404)
        expect(res.body).to.deep.equal({
          error: {
            message: 'User not found"',
            status: 404,
            code: 'USER_NOT_FOUND'
          }
        })
        done()
      })
  })
  it('POST rentDate should be < to returnDate', function (done) {
    chai.request(api)
      .post('/bookings')
      .send({
        rentDate: '2020-01-11',
        returnDate: '2020-01-10',
        item: '9782744005084',
        user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
      })
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'rentDate should be < to returnDate',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })
  describe('PUT /bookings should return status code 400 if user object is missing properties', function () {
    const bookingRequests = generateAPICallsWithMissingParams(bookingSeed)
    bookingRequests.forEach((booking, index) => {
      const requiredProperties = Object.keys(bookingSeed) // Get all the required properties from the userSeed object
      const missingProperties = []
      // Verify that all the required properties exist in the user object
      requiredProperties.forEach(function (propertyName) {
        if (!Object.prototype.hasOwnProperty.call(booking, propertyName) || booking[propertyName] === undefined) {
          missingProperties.push(propertyName)
        }
      })

      it(`PUT /bookings should return status code 400 if user object is missing properties ${missingProperties.join(', ')}`, function (done) {
        chai.request(api)
          .put('/bookings/9dedb660-b74d-4c5e-a31f-a0a7850f8a70')
          .send(booking)
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

  it('PUT /bookings should return status code 200 with booking updated', function (done) {
    const booking = {
      rentDate: '2020-01-01',
      returnDate: '2020-01-12',
      item: '9782744005084',
      user: 'c5e0357f-2eb7-4180-84e7-5c8efeab2c83'
    }
    chai.request(api)
      .put('/bookings/03184513-9be7-469d-810d-f0ae6ae6b229')
      .send(booking)
      .end(function (_, res) {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          data: {
            id: '03184513-9be7-469d-810d-f0ae6ae6b229',
            rentDate: '2020-01-01',
            returnDate: '2020-01-12',
            item: {
              isbn13: '9782744005084',
              title: 'UML et C++',
              authors: 'Richard C. Lee, William M. Tepfenhart',
              editor: 'CampusPress',
              langCode: 'FR',
              price: 29.95
            },
            user: {
              id: 'c5e0357f-2eb7-4180-84e7-5c8efeab2c83',
              lastName: 'Potter',
              firstName: 'Harry',
              birthDate: '1980-01-01',
              phone: '+33654543456',
              address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
              email: 'harry@mail.com'
            }
          }
        })
        done()
      })
  })
  it('PUT /bookings should return status code 400 if rentDate is malformed', function (done) {
    const booking = {
      rentDate: '21-454-20',
      returnDate: '2020-01-10',
      item: '9782744005084',
      user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
    }

    chai.request(api)
      .put('/bookings/03184513-9be7-469d-810d-f0ae6ae6b229')
      .send(booking)
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'rentDate is not valid format should be YYYY-MM-DD',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })
  it('PUT /bookings should return status code 400 if returnDate is malformed', function (done) {
    const booking = {
      rentDate: '2020-01-01',
      returnDate: '21d-12-2023',
      item: '9782744005084',
      user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
    }

    chai.request(api)
      .put('/bookings/03184513-9be7-469d-810d-f0ae6ae6b229')
      .send(booking)
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'returnDate is not valid format should be YYYY-MM-DD',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })
  it('/PUT /bookings should return status code 400 if item is not a isbn13', function (done) {
    chai.request(api)
      .put('/bookings/03184513-9be7-469d-810d-f0ae6ae6b229')
      .send({
        rentDate: '2020-01-01',
        returnDate: '2020-01-10',
        item: '123',
        user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
      })
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'item is not valid, should be isnb13',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })
  it('/PUT /bookings should return status code 400 if user is not a uuid', function (done) {
    chai.request(api)
      .put('/bookings/03184513-9be7-469d-810d-f0ae6ae6b229')
      .send({
        rentDate: '2020-01-01',
        returnDate: '2020-01-10',
        item: '9782744005084',
        user: '123'
      })
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'user is not valid',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })
  it('PUT /bookings should return status code 404 if not found', function (done) {
    chai.request(api)
      .put(`/bookings/${uuid()}`)
      .send({
        rentDate: '2020-01-01',
        returnDate: '2020-01-10',
        item: '9782744005087',
        user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
      })
      .end(function (_, res) {
        expect(res).to.have.status(404)
        expect(res.body).to.deep.equal({
          error: {
            message: 'booking not found',
            status: 404,
            code: 'BOOKING_NOT_FOUND'
          }
        })
        done()
      })
  })
  it('PUT /bookings should return status code 404 if users not found', function (done) {
    chai.request(api)
      .put('/bookings/9dedb660-b74d-4c5e-a31f-a0a7850f8a70')
      .send({
        rentDate: '2020-01-01',
        returnDate: '2020-01-10',
        item: '9782744005084',
        user: 'f92fefd1-4059-447b-89d6-a7e2482f795f'
      })
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
  it('PUT /bookings should return status code 404 if item not found', function (done) {
    chai.request(api)
      .put('/bookings/9dedb660-b74d-4c5e-a31f-a0a7850f8a70')
      .send({
        rentDate: '2020-01-01',
        returnDate: '2020-01-10',
        item: '9782744005097',
        user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
      })
      .end(function (_, res) {
        expect(res).to.have.status(404)
        expect(res.body).to.deep.equal({
          error: {
            message: 'Book not found',
            status: 404,
            code: 'BOOK_NOT_FOUND'
          }
        })
        done()
      })
  })
  it('PUT rentDate should be < to returnDate', function (done) {
    chai.request(api)
      .put('/bookings/9dedb660-b74d-4c5e-a31f-a0a7850f8a70')
      .send({
        rentDate: '2020-01-12',
        returnDate: '2020-01-10',
        item: '9782744005084',
        user: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f'
      })
      .end(function (_, res) {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: {
            message: 'rentDate should be < to returnDate',
            status: 400,
            code: 'BAD_REQUEST'
          }
        })
        done()
      })
  })
  it('DELETE /bookings/:id should return status code 200 with bookings deleted', function (done) {
    chai.request(api)
      .delete('/bookings/03184513-9be7-469d-810d-f0ae6ae6b229')
      .end(function (_, res) {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          meta: {
            message: 'Booking 03184513-9be7-469d-810d-f0ae6ae6b229 deleted',
            _deleted: {
              id: '03184513-9be7-469d-810d-f0ae6ae6b229',
              rentDate: '2020-01-01',
              returnDate: '2020-01-12',
              item: {
                isbn13: '9782744005084',
                title: 'UML et C++',
                authors: 'Richard C. Lee, William M. Tepfenhart',
                editor: 'CampusPress',
                langCode: 'FR',
                price: 29.95
              },
              user: {
                id: 'c5e0357f-2eb7-4180-84e7-5c8efeab2c83',
                lastName: 'Potter',
                firstName: 'Harry',
                birthDate: '1980-01-01',
                phone: '+33654543456',
                address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
                email: 'harry@mail.com'
              }
            }
          }
        })
        done()
      })
  })
  it('DELETE /bookings/:id should return status code 404 if bookings not found', function (done) {
    chai.request(api)
      .delete(`/bookings/${uuid()}`)
      .end(function (_, res) {
        expect(res).to.have.status(404)
        expect(res.body).to.deep.equal({
          error: {
            message: 'Booking not found',
            status: 404,
            code: 'BOOKING_NOT_FOUND'
          }
        })
        done()
      })
  })
})
