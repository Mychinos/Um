import Fastify from 'fastify'
import Controller from './controller/Index'

const PORT = 3200

const Server = Fastify()
const RouteController = []


Server.addHook('preHandler', (req, reply, done) => {
  reply.header("Access-Control-Allow-Origin", "*")
  done()
})


Controller.forEach((C) => {
  const controller = new C(Server)
  controller.init()
  RouteController.push(controller)
})

Server.get('/ping', (req, res) => {
  res.send({ pong: true })
})

Server.listen({ port: PORT }).then(() => {
  console.log('Server listening on Port ', PORT)
  // const address = Server.server.address()
  // const port = typeof address === 'string' ? address : address?.port
})