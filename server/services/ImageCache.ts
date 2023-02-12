import axios from 'axios'
import  * as fs from 'fs'
import { join } from 'path'

export type ImageCacheOptions = {
  savePath: string,
  API_KEY: string,
  baseUrl: string,
}

const defaultOptions: ImageCacheOptions  = {
  savePath: join(__dirname, 'cache'),
  API_KEY: "N/A",
  baseUrl: "https://api.nuclino.com"
}

export class ImageCache {

  cache: Record<string, string> = {}
  promiseCache: Record<string, Promise<void>> = {}
  options = defaultOptions

  constructor(options = defaultOptions) {
    this.options = { ...this.options, ...options }
    const exists = fs.existsSync(options.savePath)
    if (!exists) {
      fs.mkdirSync(options.savePath)
    }
    this.cache = fs.readdirSync(options.savePath).reduce((map, file) => {
      const fileName = file.split('.')[0]
      map[fileName] = join(options.savePath, file)
      // console.log(fileName, map[fileName])
      return map
    }, {} as Record<string, string>)
  }

  async getImage(fileId: string) {
    console.log('Try Get', fileId)
    if (!this.cache[fileId]) {
      if (!this.promiseCache[fileId]) {
        this.promiseCache[fileId] = this.fetchImage(fileId)
      }
      await this.promiseCache[fileId]
    }
    const path = this.cache[fileId]
    return fs.readFileSync(path)
  }

  async fetchImage(fileId: string) {
    const res = await axios.get(`${this.options.baseUrl}/v0/files/${fileId}`, { headers: { Authorization: this.options.API_KEY } })
    const fileData = await axios.get(res.data.data.download.url, { responseType: 'arraybuffer' })
    const tmp = res.data.data.download.url.split('.')
    const filePath = join(this.options.savePath, fileId + '.' + tmp[tmp.length - 1].replace('%22', ''))
    const buffer = Buffer.from(fileData.data, 'binary')//.toString('base64')
    fs.writeFileSync(filePath, buffer)
    this.cache[fileId] = filePath
    delete this.promiseCache[fileId]
    return
  }

}