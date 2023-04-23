import moment from 'moment'
import DtoUser from './dtoUser.js'
const DtoBooking = (booking) => {
  return {
    id: booking.id,
    rentDate: moment(booking.rentDate).format('YYYY-MM-DD'),
    returnDate: moment(booking.returnDate).format('YYYY-MM-DD'),
    item: booking.item,
    user: DtoUser(booking.user)
  }
}

export default DtoBooking
