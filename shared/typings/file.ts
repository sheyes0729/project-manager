import { ResultStatus } from './system'

export interface ProjectTypeInterface {
  include: string[] | string
  ignore?: string[] | string
}

export interface FileData {
  uid: number
  directory: string
  projectName: string
  name: string
  path: string
  type: string
  size: number
  accessTime: Date
  createTime: Date
  lastUpdateTime: Date
}

export interface IDEPickeResult {
  status: ResultStatus
  icon: string
  path: string
}
