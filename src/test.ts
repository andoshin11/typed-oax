import { Router } from 'express'

const route = Router()

route.get('/cart/items', (req, res) => {
  const body = req.body
})

route.get('/albums/:albumId/photos', (req, res) => {
  const { body, params } = req
})
