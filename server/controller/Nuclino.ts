import axios from 'axios'
import { FastifyInstance } from 'fastify/types/instance'
import { ApiController } from './ApiController'
import { RequestGenericInterface } from 'fastify'
import { Workspace, Collection, Item } from 'src/types/nuclino'
import { API_KEY } from './API_KEY.json'

interface IdParams extends RequestGenericInterface {
  Params: {
    id: string
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

    this.app.get<IdParams>('/nuclino/items/:id', async (request, reply) => {
      const workspaceId = request.params.id
      let result: (Collection | Item)[] = []
      let tmpList: (Collection | Item)[] = []
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
      // console.log('Done in', i, 'Loops. Got', result.length, 'Items')
      return reply.send(result)
    })

    this.app.get<IdParams>('/nuclino/item/:id', async (request, reply) => {
      const itemId = request.params.id
      const res = await axios.get(`${this.baseUrl}/v0/items/${itemId}`, { headers: { Authorization: this.API_KEY } })
      const data = res.data.data
      return reply.send(data)
    })

    this.app.get<IdParams>('/nuclino/file/:id', async (request, reply) => {
      // TODO: Build Image Cache in Server
      const fileId = request.params.id
      const res = await axios.get(`${this.baseUrl}/v0/files/${fileId}`, { headers: { Authorization: this.API_KEY } })
      reply.send(res.data.data.download.url)
    })

    // this.app.get<ImgProxyParams>('/nuclino/proxy/:imageId/:imageName', async (request, reply) => {
    //   const { imageId, imageName } = request.params
    //   console.log(`https://files.nuclino.com/files/${imageId}/${imageName}`)
    //   const res = await axios.get(`https://files.nuclino.com/files/${imageId}/${imageName}`, { headers: { Authorization: this.API_KEY } })
    //   console.log(res)
    //   reply.send(res.data)
    // })

  }
}

export default NuclinoController