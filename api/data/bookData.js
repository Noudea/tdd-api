import Book from '../model/Book.js'

const booksData = [
  new Book({
    isbn13: '9782744005084',
    title: 'UML et C++',
    authors: 'Richard C. Lee, William M. Tepfenhart',
    editor: 'CampusPress',
    langCode: 'FR',
    price: 29.95
  }),
  new Book({
    isbn13: '9782746035966',
    title: 'Cree su primer sitio web con dreamweaver 8',
    authors: 'B.A. GUERIN',
    editor: 'ENI',
    langCode: 'ES',
    price: 10.02
  })
]

export default booksData
