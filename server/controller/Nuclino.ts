import axios from 'axios'
import { FastifyInstance } from 'fastify/types/instance'
import { ApiController } from './ApiController'
import { RequestGenericInterface } from 'fastify'
import { Workspace, Collection, Item } from 'src/types/nuclino'
import { API_KEY } from './API_KEY.json'
interface WorkspaceParams extends RequestGenericInterface {
  Params: {
    workspaceId: string
  }
}

export class NuclinoController extends ApiController {
  name = 'Nuclino'
  baseUrl = 'https://api.nuclino.com'
  API_KEY = API_KEY

  constructor(fastify: FastifyInstance) {
    super(fastify)
  }

  init() {
    this.app.get('/nuclino/workspaces', async (request, reply) => {
      const res = await axios.get(`${this.baseUrl}/v0/workspaces`, { headers: { Authorization: this.API_KEY } })
      return reply.send(res.data.data.results)
    })

    this.app.get<WorkspaceParams>('/nuclino/items/:workspaceId', async (request, reply) => {
      console.log('Get items')
      const workspaceId = request.params.workspaceId
      let result: (Collection|Item)[] = []
      let tmpList: (Collection|Item)[] = []
      let i = 0
      do {
        const after = i !== 0 ? `&after=${result[result.length - 1].id}` : ''
        // console.log(`${this.baseUrl}/v0/items?workspaceId=${workspaceId}${after}`)
        const res = await axios.get(`${this.baseUrl}/v0/items?workspaceId=${workspaceId}${after}`, { headers: { Authorization: this.API_KEY } })
        tmpList = res.data.data.results
        result = result.concat(tmpList)
        i++
        console.log(i)
      }
      while (tmpList && tmpList.length === 100)
      console.log('Done in', i, 'Loops. Got', result.length, 'Items')
      return reply.send(result)
    })
  }
}

export default NuclinoController