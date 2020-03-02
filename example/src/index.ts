import * as express from 'express'

const petFactory = (id: number) => ({
  id,
  name: 'dummy'
})

async function main() {
  const app = express()

  const route = express.Router()

  /** handler type will be inferenced here */
  route.get('/pets', (_, res) => {
    res.json({ pets: [1, 2, 3].map(petFactory) })
  })

  route.get('/pets/:petId', (req, res) => {
    const { petId } = req.params

    res.json({ pet: petFactory(parseInt(petId, 10)) })
  })

  route.post('/pets', (req, res) => {
    const { body } = req
    if (!body) {
      res.status(422)
      return
    }

    res.json({
      pet: {
//      id: 'a' <- this will throw type error
        id: 1,
        name: body.name,
        category: body.category,
        sex: body.sex
      }
    })
  })

  /***************************************/

  app.use(route)

  app.listen(9999)
}

main()
