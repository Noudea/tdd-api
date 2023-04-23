import validateHandler from './utils/routerValidation.js'

export default (controlers, app) => {
  const userSchema = {
    lastName: { type: 'string' },
    firstName: { type: 'string' },
    birthDate: { type: 'string', format: 'YYYY-MM-DD' },
    address: { type: 'string' },
    phone: { type: 'string', format: 'FR-phone' },
    email: { type: 'string' }
  }

  const bookingSchema = {
    rentDate: { type: 'string', format: 'YYYY-MM-DD' },
    returnDate: { type: 'string', format: 'YYYY-MM-DD' },
    item: { type: 'string', format: 'isbn13' },
    user: { type: 'string', format: 'uuid' }
  }

  const routes = [
    { method: 'get', path: '/statusCheck', handler: controlers.statusCheck.getStatus },
    { method: 'get', path: '/books', handler: controlers.bookCtrl.listBooks },
    { method: 'post', path: '/books', handler: controlers.bookCtrl.addBook },
    { method: 'put', path: '/books/:id', handler: controlers.bookCtrl.updateBook },
    { method: 'delete', path: '/books/:id', handler: controlers.bookCtrl.deleteBook },
    {
      method: 'get',
      path: '/users',
      handler: controlers.userCtrl.getAll
    },
    {
      method: 'get',
      path: '/users/:id',
      handler: controlers.userCtrl.getById,
      validation: {
        params: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    },
    {
      method: 'post',
      path: '/users',
      handler: controlers.userCtrl.add,
      validation: {
        body: {
          ...userSchema
        }
      }
    },
    {
      method: 'put',
      path: '/users/:id',
      handler: controlers.userCtrl.update,
      validation: {
        params: {
          id: { type: 'string', format: 'uuid' }
        },
        body: {
          ...userSchema
        }
      }
    },
    {
      method: 'delete',
      path: '/users/:id',
      handler: controlers.userCtrl.del,
      validation: {
        params: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    },
    {
      method: 'get',
      path: '/bookings',
      handler: controlers.bookingCtrl.getAll
    },
    {
      method: 'get',
      path: '/bookings/:id',
      handler: controlers.bookingCtrl.getById,
      validation: {
        params: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    },
    {
      method: 'post',
      path: '/bookings',
      handler: controlers.bookingCtrl.add,
      validation: {
        body: {
          ...bookingSchema
        }
      }
    },
    {
      method: 'put',
      path: '/bookings/:id',
      handler: controlers.bookingCtrl.update,
      validation: {
        params: {
          id: { type: 'string', format: 'uuid' }
        },
        body: {
          ...bookingSchema
        }
      }
    },
    {
      method: 'delete',
      path: '/bookings/:id',
      handler: controlers.bookingCtrl.del,
      validation: {
        params: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    }

  ]

  routes.forEach(route => {
    app[route.method](route.path, validateHandler(route), route.handler)
  })

  // // crud book
  // app.get('/statusCheck', controlers.statusCheck.getStatus)
  // app.get('/books', controlers.bookCtrl.listBooks)
  // app.post('/books', controlers.bookCtrl.addBook)
  // app.put('/books/:id', controlers.bookCtrl.updateBook)
  // app.delete('/books/:id', controlers.bookCtrl.deleteBook)
  //
  // // crud user
  // app.get('/users', controlers.userCtrl.getAll)
  // app.get('/users/:id', controlers.userCtrl.getById)
  // app.post('/users', controlers.userCtrl.add)
  // app.put('/users/:id', controlers.userCtrl.update)
  // app.delete('/users/:id', controlers.userCtrl.del)
}
