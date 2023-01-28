import { Injectable } from '@angular/core';
import axios from 'axios';
import { Workspace } from 'src/types/nuclino';

@Injectable({
  providedIn: 'root'
})
export class NuclinoService {

  baseUrl = 'localhost:3200/nuclino'

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
    return await axios.get(`${this.baseUrl}/items?workspaceId=${workspaceId}`)
  }

}
