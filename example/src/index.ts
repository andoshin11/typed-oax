import * as express from 'express'

const petFactory = (id?: number) => ({
  id: id || 1,
  name: 'dummy'
})

async function main() {
  const app = express()

  const route = express.Router()

  route.post('/pets', (req, res) => {
    const { query: { limit, offset } } = req

    res.json({ pets: [] })
  })

  route.get('/pets/:petId', (req, res) => {
    const { query, params } = req

    res.json({ invalidProp: 'invalid val' })
  })

  route.post('/pets', (req, res) => {
    const { body } = req

    
    console.log(body.name)
    // ...
  })

  // route.get('/pets/:petId', (req, res) => {
  //   const { petId } = req.params

  //   res.json({ pet: {} })
  // })

  route.put('/pets/:petId', (req, res) => {
    const { body, params , query} = req

    
  })

  /** handler type will be inferenced here */
  route.get('/pets', (req, res) => {
    const query = req.query // { limit?: number; }
    const body = req.body // null
    // res.json({ wrong: 'wrong response' }) <- throws type error
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
