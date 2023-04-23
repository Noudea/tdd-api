import Booking from '../model/Booking.js'
import Book from '../model/Book.js'
import User from '../model/User.js'

const bookingData = [
  new Booking({
    id: '9dedb660-b74d-4c5e-a31f-a0a7850f8a70',
    rentDate: new Date('2020-01-01'),
    returnDate: new Date('2020-01-10'),
    item: new Book({
      isbn13: '9782744005084',
      title: 'UML et C++',
      authors: 'Richard C. Lee, William M. Tepfenhart',
      editor: 'CampusPress',
      langCode: 'FR',
      price: 29.95
    }),
    user: new User({
      id: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f',
      lastName: 'Dumbledore',
      firstName: 'Albus',
      birthDate: new Date('1950-01-01'),
      phone: '+33654543456',
      address: 'bureau du directeur,chateau de poudlard',
      email: 'albus@mail.com'
    })
  }),
  new Booking({
    id: '03184513-9be7-469d-810d-f0ae6ae6b229',
    rentDate: new Date('2020-01-01'),
    returnDate: new Date('2020-01-10'),
    item: new Book({
      isbn13: '9782746035966',
      title: 'Cree su primer sitio web con dreamweaver 8',
      authors: 'B.A. GUERIN',
      editor: 'ENI',
      langCode: 'ES',
      price: 10.02
    }),
    user: new User({
      id: 'c5e0357f-2eb7-4180-84e7-5c8efeab2c83',
      lastName: 'Potter',
      firstName: 'Harry',
      birthDate: new Date('1980-01-01'),
      phone: '+33654543456',
      address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
      email: 'harry@mail.com'
    })
  })
]

export default bookingData
