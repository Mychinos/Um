export enum NuclinoObjectTypes {
  "item" = "item",
  "collection" = "collection",
  "workspace" = "workspace",
  "field" = "field"
}

export type Workspace = {
  object: NuclinoObjectTypes.workspace
  id: string
  teamId: string
  name: string
  createdAt: string
  createdUserId: string
  fields: [],
  childIds: string[]
}

export enum FieldType {
  "date" = "date",
  "text" = "text",
  "number" = "number",
  "currency" = "currency",
  "select" = "select",
  "multiSelect" = "multiSelect",
  "multiCollaborator" = "multiCollaborator",
  "createdBy" = "createdBy",
  "lastUpdatedBy" = "lastUpdatedBy",
  "updatedAt" = "updatedAt",
  "createdAt" = "createdAt",
}

export type Field = {
  object: NuclinoObjectTypes.field
  id: string
  type: FieldType
  name: string
}

export type Item = {
  object: NuclinoObjectTypes.item,
  id: string,
  workspaceId: string,
  url: string,
  title: string,
  createdAt: string,
  createdUserId: string,
  lastUpdatedAt: string,
  lastUpdatedUserId: string,
  fields: Field[],
  content: string,
  contentMeta: {
    itemIds: string[],
    fileIds: string[]
  }
}

export type Collection = {
  object: NuclinoObjectTypes.collection,
  id: string,
  workspaceId: string,
  url: string,
  title: string,
  createdAt: string,
  createdUserId: string,
  lastUpdatedAt: string,
  lastUpdatedUserId: string,
  childIds: string[],
}