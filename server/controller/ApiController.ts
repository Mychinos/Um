import { FastifyInstance } from 'fastify/types/instance'
export class ApiController {
  app: FastifyInstance
  
  constructor(fastify: FastifyInstance) {
    this.app = fastify
  }

}