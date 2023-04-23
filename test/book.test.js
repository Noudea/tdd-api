import chai from 'chai'
import chaiHttp from 'chai-http'
import api from '../index.js'

chai.use(chaiHttp)

const { expect } = chai

describe('CRUDS BOOKS', function () {
  afterEach(() => {
    const book = {
      isbn13: '9782744005084',
      title: 'UML et C++',
      authors: 'Richard C. Lee, William M. Tepfenhart',
      editor: 'CampusPress',
      langCode: 'FR',
      price: 29.95
    }
    chai.request(api)
      .put('/books/9782744005084')
      .send(book)
      .end((_, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          data: book
        })
      })
  })

  it('GET /books should return status code 200 with book list', function (done) {
    chai.request(api)
      .get('/books')
      .end((_, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          data: [
            {
              isbn13: '9782744005084',
              title: 'UML et C++',
              authors: 'Richard C. Lee, William M. Tepfenhart',
              editor: 'CampusPress',
              langCode: 'FR',
              price: 29.95
            },
            {
              isbn13: '9782746035966',
              title: 'Cree su primer sitio web con dreamweaver 8',
              authors: 'B.A. GUERIN',
              editor: 'ENI',
              langCode: 'ES',
              price: 10.02
            }
          ]
        })
        done()
      })
  })

  it('POST /books should create a book and return it with status code 201', function (done) {
    const book = {
      isbn13: '9782746035967',
      title: 'Connaitre la cuisine',
      authors: 'Thibault Clementine',
      editor: 'Sud Ouest',
      langCode: 'FR',
      price: 3.9
    }
    chai.request(api)
      .post('/books')
      .send(book)
      .end((_, res) => {
        expect(res).to.have.status(201)
        expect(res.body).to.deep.equal(book)
        done()
      })
  })

  it('POST books should return status code 400 if isbn13 is malformed', function (done) {
    const book = {
      isbn13: '97',
      title: 'Connaitre la cuisine',
      authors: 'Thibault Clementine',
      editor: 'Sud Ouest',
      langCode: 'FR',
      price: 3.9
    }
    chai.request(api)
      .post('/books')
      .send(book)
      .end((_, res) => {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: 'isbn13 is required and must be 13 characters long'
        })
        done()
      })
  })

  it('POST books should return status code 400 if price is not a number', function (done) {
    const book = {
      isbn13: '9782746035967',
      title: 'Connaitre la cuisine',
      authors: 'Thibault Clementine',
      editor: 'Sud Ouest',
      langCode: 'FR',
      price: '3.9'
    }
    chai.request(api)
      .post('/books')
      .send(book)
      .end((_, res) => {
        expect(res).to.have.status(400)
        done()
      })
  })

  it('PUT /books should return a status code 200 with the updated book', function (done) {
    const book = {
      isbn13: '9782744005084',
      title: 'UML et C++',
      authors: 'Richard C. Lee, William M. Tepfenhart',
      editor: 'CampusPress',
      langCode: 'FR',
      price: 60
    }
    chai.request(api)
      .put('/books/9782744005084')
      .send(book)
      .end((_, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          data: book
        })
        done()
      })
  })

  it('PUT /books should return a status code 404 if id is not found', function (done) {
    const book = {
      isbn13: '9782744005085',
      title: 'UML et C++',
      authors: 'Richard C. Lee, William M. Tepfenhart',
      editor: 'CampusPress',
      langCode: 'FR',
      price: 60
    }
    chai.request(api)
      .put('/books/9782744005085')
      .send(book)
      .end((_, res) => {
        expect(res).to.have.status(404)
        expect(res.body).to.deep.equal({
          error: 'Book 9782744005085 not found'
        })
        done()
      })
  })

  it('PUT books should return status code 400 if isbn13 is malformed', function (done) {
    const book = {
      isbn13: '97',
      title: 'Connaitre la cuisine',
      authors: 'Thibault Clementine',
      editor: 'Sud Ouest',
      langCode: 'FR',
      price: 3.9
    }
    chai.request(api)
      .put('/books/97')
      .send(book)
      .end((_, res) => {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: 'isbn13 is required and must be 13 characters long'
        })
        done()
      })
  })
  it('DELETE /books should return a status code 400 if isbn13 malformed', (done) => {
    const deletedBook = {
      isbn13: '97827463231035966',
      title: 'Cree su primer sitio web con dreamweaver 8',
      authors: 'B.A. GUERIN',
      editor: 'ENI',
      langCode: 'ES',
      price: 10.02
    }

    chai.request(api)
      .delete('/books/97827463231035966')
      .end((_, res) => {
        expect(res).to.have.status(400)
        expect(res.body).to.deep.equal({
          error: 'isbn13 is required and must be 13 characters long'
        })
        done()
      })
  })
  it('DELETE /books should return a status code 200 with deleted element', (done) => {
    const deletedBook = {
      isbn13: '9782746035966',
      title: 'Cree su primer sitio web con dreamweaver 8',
      authors: 'B.A. GUERIN',
      editor: 'ENI',
      langCode: 'ES',
      price: 10.02
    }

    chai.request(api)
      .delete('/books/9782746035966')
      .end((_, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          meta: {
            message: 'Book 9782746035966 deleted',
            deletedBook
          }
        })
        done()
      })
  })
})
