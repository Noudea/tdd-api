import validate from '../utils/validate.js'
import { isUuid, uuid } from 'uuidv4'
import moment from 'moment'

export default ({ repo, Model, dto }) => {
  const getAll = async (_, res) => {
    const users = repo.getAll()

    const promises = users.map((user) => {
      return dto(user)
    })

    await Promise.all(promises)

    return res.status(200).send({
      data: promises
    })
  }

  const getById = (req, res) => {
    const { id } = req.params

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

    if (!repo.getById(id)) {
      return res.status(404).send({
        error: {
          message: 'User not found',
          status: 404,
          code: 'USER_NOT_FOUND'
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
