import { isUuid } from 'uuidv4'
import validate from './validate.js'

function validateHandler (route) {
  return function (req, res, next) {
    if (!route.validation) {
      return next()
    }
    const { params, query, body } = req

    if (route.validation.params) {
      const result = validateFormat(params, route.validation.params)
      if (result.error) {
        return res.status(result.error.status).json({
          error: {
            ...result.error
          }
        })
      }
    }

    if (route.validation.body) {
      const result = validateMissingProperties(body, route.validation.body)
      const result2 = validateFormat(body, route.validation.body)

      if (result.error) {
        return res.status(result.error.status).json({
          error: {
            ...result.error
          }
        })
      }

      if (result2.error) {
        return res.status(result2.error.status).json({
          error: {
            ...result2.error
          }
        })
      }
    }
    return next()
  }
}

function validateMissingProperties (data, schema) {
  const missingProperties = []

  for (const [key, value] of Object.entries(schema)) {
    if (data[key] === undefined) {
      missingProperties.push(key)
    }
  }

  if (missingProperties.length > 0) {
    return {
      error: {
        message: `Missing properties: ${missingProperties.join(', ')}`,
        status: 400,
        code: 'BAD_REQUEST'
      }
    }
  }

  return { error: null }
}

function validateFormat (data, schema) {
  for (const [key, value] of Object.entries(schema)) {
    if (value.format === 'uuid') {
      if (!isUuid(data[key])) {
        return {
          error: { message: `${key} is not valid`, status: 400, code: 'BAD_REQUEST' }
        }
      }
    }
    if (value.format === 'FR-phone') {
      if (!validate.isValidPhoneNumber(data[key])) {
        return {
          error: {
            message: `${key} is not valid`,
            status: 400,
            code: 'BAD_REQUEST'
          }
        }
      }
    }
    if (value.format === 'YYYY-MM-DD') {
      if (!validate.isDateString(data[key])) {
        return {
          error: {
            message: `${key} is not valid format should be YYYY-MM-DD`,
            status: 400,
            code: 'BAD_REQUEST'
          }
        }
      }
    }
    if (value.format === 'isbn13') {
      if (!validate.isISBNValid(data[key])) {
        return {
          error: {
            message: `${key} is not valid, should be isnb13`,
            status: 400,
            code: 'BAD_REQUEST'
          }
        }
      }
    }
  }

  return { error: null }
}

export default validateHandler
