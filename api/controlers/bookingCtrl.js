import validate from '../utils/validate.js'
import { isUuid, uuid } from 'uuidv4'

export default ({ repo, Model, dto }) => {
  const getAll = async (_, res) => {
    const modelList = repo.bookingRepo.getAll()

    const promises = modelList.map((model) => {
      return dto(model)
    })

    await Promise.all(promises)
    return res.status(200).send({
      data: promises
    })
  }

  const getById = (req, res) => {
    const { id } = req.params

    const modelData = repo.bookingRepo.getById(id)

    if (!modelData) {
      return res.status(404).send({
        error: {
          message: `${Model.name} not found`,
          status: 404,
          code: `${Model.name}_NOT_FOUND`.toUpperCase()
        }
      })
    }
    return res.status(200).send({
      data: dto(modelData)
    })
  }

  const add = (req, res) => {
    const user = repo.userRepo.getById(req.body.user)
    if (!user) {
      return res.status(404).send({
        error: {
          message: 'User not found"',
          status: 404,
          code: 'USER_NOT_FOUND'
        }
      })
    }

    const book = repo.bookRepo.getById(req.body.item)
    if (!book) {
      return res.status(404).send({
        error: {
          message: 'Book not found',
          status: 404,
          code: 'BOOK_NOT_FOUND'
        }
      })
    }

    // rentDate should be < to returnDate
    if (new Date(req.body.rentDate) > new Date(req.body.returnDate)) {
      return res.status(400).send({
        error: {
          message: 'rentDate should be < to returnDate',
          status: 400,
          code: 'BAD_REQUEST'
        }
      })
    }

    const modelDataToAdd = repo.bookingRepo.add(new Model({
      id: uuid(),
      ...req.body,
      user,
      item: book
    }))

    return res.status(201).send({
      data: dto(modelDataToAdd)
    })
  }

  const update = (req, res) => {
    const { id } = req.params

    if (!repo.bookingRepo.getById(id)) {
      return res.status(404).send({
        error: {
          message: 'booking not found',
          status: 404,
          code: 'BOOKING_NOT_FOUND'
        }
      })
    }

    const user = repo.userRepo.getById(req.body.user)
    if (!user) {
      return res.status(404).send({
        error: {
          message: 'User not found',
          status: 404,
          code: 'USER_NOT_FOUND'
        }
      })
    }
    const book = repo.bookRepo.getById(req.body.item)
    if (!book) {
      return res.status(404).send({
        error: {
          message: 'Book not found',
          status: 404,
          code: 'BOOK_NOT_FOUND'
        }
      })
    }

    if (new Date(req.body.rentDate) > new Date(req.body.returnDate)) {
      return res.status(400).send({
        error: {
          message: 'rentDate should be < to returnDate',
          status: 400,
          code: 'BAD_REQUEST'
        }
      })
    }

    const updatedBooking = repo.bookingRepo.update(new Model({
      id,
      ...req.body,
      user,
      item: book
    }))

    return res.status(200).send({
      data: dto(updatedBooking)
    })
  }

  const del = (req, res) => {
    const { id } = req.params

    const modelToDelete = repo.bookingRepo.getById(id)
    if (!modelToDelete) {
      return res.status(404).send({
        error: {
          message: `${Model.name} not found`,
          status: 404,
          code: `${Model.name}_NOT_FOUND`.toUpperCase()
        }
      })
    }

    const deletedModel = repo.bookingRepo.del(id)
    return res.status(200).send(
      {
        meta: {
          message: `${Model.name} ${deletedModel.id} deleted`,
          _deleted: dto(deletedModel)
        }
      }
    )
  }

  return {
    getAll,
    getById,
    add,
    update,
    del
  }
}
