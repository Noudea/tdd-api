import validate from '../utils/validate.js'
import { isUuid, uuid } from 'uuidv4'
import moment from 'moment'

export default ({ repo, Model, dto }) => {
  const getAll = async (_, res) => {
    const users = repo.getAll()

    const promises = users.map((user) => {
      user.birthDate = moment(user.birthDate).format('YYYY-MM-DD')
      return user
    })

    await Promise.all(promises)

    return res.status(200).send({
      data: users
    })
  }

  const getById = (req, res) => {
    const { id } = req.params

    if (!isUuid(id)) {
      return res.status(400).send({
        error: {
          message: 'User id is not valid',
          status: 400,
          code: 'BAD_REQUEST'
        }
      })
    }

    const user = repo.getById(id)
    if (!user) {
      return res.status(404).send({
        error: {
          message: 'User not found',
          status: 404,
          code: 'USER_NOT_FOUND'
        }
      })
    }
    return res.status(200).send({
      data: dto(user)
    })
  }

  const add = (req, res) => {
    const { lastName, firstName, birthDate, phone, email, address } = req.body

    const requiredProperties = ['lastName', 'firstName', 'birthDate', 'address', 'phone', 'email']
    const missingProperties = requiredProperties.filter((propertyName) => !Object.prototype.hasOwnProperty.call(req.body, propertyName))
    if (missingProperties.length > 0) {
      return res.status(400).json({
        error: {
          message: `Missing properties: ${missingProperties.join(', ')}`,
          status: 400,
          code: 'BAD_REQUEST'
        }
      })
    }

    if (!validate.isValidPhoneNumber(phone)) {
      return res.status(400).json({
        error: {
          message: 'phone is not valid',
          status: 400,
          code: 'BAD_REQUEST'
        }
      })
    }

    if (!validate.isDateString(birthDate)) {
      return res.status(400).json({
        error: {
          message: 'birthDate is not valid format should be YYYY-MM-DD',
          status: 400,
          code: 'BAD_REQUEST'
        }
      })
    }

    const user = repo.add(new Model({
      id: uuid(),
      lastName,
      firstName,
      birthDate: new Date(birthDate),
      phone,
      email,
      address
    }))

    return res.status(201).send({
      data: dto(user)
    })
  }

  const update = (req, res) => {
    const { id } = req.params
    const { lastName, firstName, birthDate, phone, email, address } = req.body

    if (!isUuid(id)) {
      return res.status(400).send({
        error: {
          message: 'id is not valid',
          status: 400,
          code: 'BAD_REQUEST'
        }
      })
    }

    if (!repo.getById(id)) {
      return res.status(404).send({
        error: {
          message: 'User not found',
          status: 404,
          code: 'USER_NOT_FOUND'
        }
      })
    }

    const requiredProperties = ['lastName', 'firstName', 'birthDate', 'address', 'phone', 'email']
    const missingProperties = requiredProperties.filter((propertyName) => !Object.prototype.hasOwnProperty.call(req.body, propertyName))
    if (missingProperties.length > 0) {
      return res.status(400).json({
        error: {
          message: `Missing properties: ${missingProperties.join(', ')}`,
          status: 400,
          code: 'BAD_REQUEST'
        }
      })
    }

    if (!validate.isValidPhoneNumber(phone)) {
      return res.status(400).json({
        error: {
          message: 'phone is not valid',
          status: 400,
          code: 'BAD_REQUEST'
        }
      })
    }

    if (!validate.isDateString(birthDate)) {
      return res.status(400).json({
        error: {
          message: 'birthDate is not valid format should be YYYY-MM-DD',
          status: 400,
          code: 'BAD_REQUEST'
        }
      })
    }

    const user = repo.update(new Model({
      id,
      lastName,
      firstName,
      birthDate: new Date(birthDate),
      phone,
      email,
      address
    }))

    return res.status(200).send({
      data: dto(user)
    })
  }

  const del = (req, res) => {
    const { id } = req.params

    if (!isUuid(id)) {
      return res.status(400).send({
        error: {
          message: 'User id is not valid',
          status: 400,
          code: 'BAD_REQUEST'
        }
      })
    }

    const user = repo.getById(id)
    if (!user) {
      return res.status(404).send({
        error: {
          message: 'User not found',
          status: 404,
          code: 'USER_NOT_FOUND'
        }
      })
    }

    const deletedUser = repo.del(id)
    return res.status(200).send(
      {
        meta: {
          message: `User ${deletedUser.id} deleted`,
          _deleted: dto(deletedUser)
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
