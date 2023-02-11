import { Injectable } from '@angular/core';
import { Collection, Item } from 'src/types/nuclino';
import { NuclinoService } from './nuclino.service';
import { NuclinoObjectTypes } from 'src/types/nuclino';
@Injectable({
  providedIn: 'root'
})
export class BedlamService {

  workspaceId = "b6df8ed9-df3c-4520-add6-1d699c41d96f"
  charactersId = ""


  content: (Item | Collection)[] = []
  contentMap: Record<string, (Item | Collection)> = {}
  contentLoaded = false
  contentPromise?: Promise<void>

  items: Item[] = []
  collections: Collection[] = []

  nsc: Item[] = []
  places: Item[] = []
  artifacts: Item[] = []

  constructor(private nuclino: NuclinoService) { }

  async getContent() {
    if (!this.contentLoaded) {
      if (!this.contentPromise) {
        this.contentPromise = this.fetchContent()
      }
      await this.contentPromise
    }
    return this.content
  }

  async fetchContent() {
    const content = await this.nuclino.getItems(this.workspaceId)
    console.log(content)
    this.content = content
    this.contentMap = content.reduce((map, item) => {
      map[item.id] = item
      return map
    }, {} as Record<string, (Item | Collection)>)
    this.items = content.filter((x) => x.object === NuclinoObjectTypes.item) as Item[]
    this.collections = content.filter((x) => x.object === NuclinoObjectTypes.collection) as Collection[]
    const charactersCollection = content.find((c) => c.id === 'df29893b-c5d6-40ce-a096-bc1f093220fe') as Collection
    if (charactersCollection) {
      this.nsc = this.reduceEntries(charactersCollection, this.nsc)
      await this.enrichEntries(this.nsc)
      return
    }
  }

  async fetchItemContent(item: Item) {
    const details = await this.nuclino.getItemDetails(item.id)
    return details
  }

  reduceEntries(col: Collection, target: Item[], attributes: string[] = []) {
    col.childIds.forEach((id) => {
      const entry = this.contentMap[id]
      if (entry.object === NuclinoObjectTypes.collection) {
        attributes.push(entry.title)
        this.reduceEntries(entry, target, attributes)
      } else {
        target.push(entry)
      }
    })
    return target
  }

  async enrichEntries(items: Item[]) {
    let count = items.length 
    const stackSize = 50
    const stack: Promise<void>[] =  []
    while(count-- ){
      stack.push(this.fetchItemContent(items[count]).then((details) => {
        items[count] = details
      }))
      if (stack.length >= stackSize || count === 0) {
        await Promise.all(stack)
      }
    }  
  }

  async getImageUrl(id: string) {
    return this.nuclino.getImgUrl(id)
  }

}
