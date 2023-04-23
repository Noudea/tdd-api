import moment from 'moment'

const dtoUser = (user) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    birthDate: moment(user.birthDate).format('YYYY-MM-DD')
  }
}

export default dtoUser
