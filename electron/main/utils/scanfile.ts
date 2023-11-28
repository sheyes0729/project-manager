import fs from 'fs'
import { Worker } from 'worker_threads'
import path from 'path'
import os from 'os'
import log from 'electron-log'
import type { FileData } from '../../../shared/typings/file'
import { normalizePath } from '../path'

const numThreads = os.cpus().length // 线程数
export async function scanfile(
  root: string,
  projectTypes: Record<string, any>
): Promise<FileData[]> {
  return new Promise((resolve) => {
    const computerRootDirectory = root // 要扫描的电脑根目录
    // 将根目录分割成多个子目录
    const subDirectories = fs
      .readdirSync(computerRootDirectory)
      .map((file) => path.join(computerRootDirectory, file))

    const threadSubDirectories: Array<string[]> = []
    for (let i = 0; i < numThreads; i++) {
      threadSubDirectories.push([])
    }

    // 将子目录分配给不同的线程
    subDirectories.forEach((subDir, index) => {
      threadSubDirectories[index % numThreads].push(subDir)
    })

    const workers: Worker[] = []
    const workerPath = normalizePath('resources/js/scanfile.mjs')

    // 创建并启动多个线程
    for (let i = 0; i < numThreads; i++) {
      workers[i] = new Worker(workerPath, {
        workerData: {
          id: i,
          subDirectories: threadSubDirectories[i],
          projectTypes
        }
      })
    }

    // 监听子线程的消息
    let length = 0
    const result: FileData[] = []
    workers.forEach((worker, index) => {
      worker.on('message', (data: FileData) => {
        result.push(data)
      })

      worker.on('error', (error) => {
        log.error(`Thread ${index}  Scan file error: `, error.message)
      })

      worker.on('exit', () => {
        length++
        if (length === numThreads) {
          log.debug(`Scan file ${root} completed! `)
          resolve(result)
        }
      })
    })
  })
}
