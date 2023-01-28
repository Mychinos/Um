import { Injectable } from '@angular/core';
import axios from 'axios';
import { Collection, Item, Workspace } from 'src/types/nuclino';

@Injectable({
  providedIn: 'root'
})
export class NuclinoService {

  baseUrl = 'http://localhost:3200/nuclino'

  workspaces: Workspace[] = []
  workspacesLoaded = false
  workspacePromise?: Promise<void>

  constructor() { }

  async getWorkspaces() {
    if (!this.workspacesLoaded) {
      if (!this.workspacePromise) {
        this.workspacePromise = this.fetchWorkspaces()
      }
      await this.workspacePromise
    }
    return this.workspaces
  }
  async fetchWorkspaces() {
    const res = await axios.get<Workspace[]>(`${this.baseUrl}/workspaces`)
    this.workspaces = res.data 
    return
  }
  
  async getItems(workspaceId: string) {
    console.log('go')
    const res = await axios.get<(Item | Collection)[]>(`${this.baseUrl}/items/${workspaceId}`)
    console.log(res)
    return res.data
  }

}
