import Express from 'express'
import router from './router.js'
import controlers from './controlers/index.js'
import repositories from './repository/index.js'
import model from './model/index.js'

const launch = (apiPort) => {
  const app = new Express()
  app.use(Express.json())

  router(controlers(repositories(model), model), app)

  app.listen(apiPort)

  console.log(`API server listening on port ${apiPort}...`)

  // For testing purposes
  return app
}

export default { launch }
