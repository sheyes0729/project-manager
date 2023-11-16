import { ProcessMetric } from 'electron'

export interface AppInfo {
  name: string // 应用名称
  version: string // 应用版本
  appPath: string // 应用程序目录
  appMetrics: ProcessMetric[] // 应用进程信息
  gpuInfo: unknown // GPU信息
}
