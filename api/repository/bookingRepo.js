import bookingData from '../data/bookingData.js'

function bookingRepo () {
  const list = bookingData

  const getAll = () => {
    return list
  }

  const getById = (id) => {
    return list.find(booking => booking.id === id)
  }

  const add = (booking) => {
    list.push(booking)
    return booking
  }

  const update = (data) => {
    const dataIndexToReplace = list.findIndex((b) => b.id === data.id)
    list[dataIndexToReplace] = data
    return data
  }

  const del = (id) => {
    const dataIndexToDelete = list.findIndex((b) => b.id === id)
    return list.splice(dataIndexToDelete, 1)[0]
  }

  return {
    getAll,
    getById,
    add,
    update,
    del
  }
}

export default bookingRepo
