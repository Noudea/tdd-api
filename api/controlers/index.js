import statusCheck from './statusCheck.js'
import bookCtrl from './bookCtrl.js'
import userCtrl from './userCtrl.js'
import dtoUser from '../DTO/dtoUser.js'
import dtoBooking from '../DTO/dtoBooking.js'
import bookingCtrl from './bookingCtrl.js'

export default (repositories, model) => ({
  statusCheck,
  bookCtrl: bookCtrl(repositories.bookRepo, model.Book),
  userCtrl: userCtrl({ repo: repositories.userRepo, Model: model.User, dto: dtoUser }),
  bookingCtrl: bookingCtrl({ repo: repositories, Model: model.Booking, dto: dtoBooking })
})
