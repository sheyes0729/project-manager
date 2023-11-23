import fs from 'fs'
import { workerData, parentPort } from 'worker_threads'
import path from 'path'

const excludeSet = new Set()

let projectTypes = {}

function scanDirectory(directory) {
  try {
    const filestats = fs.statSync(directory)
    if (!filestats.isDirectory()) return
    const files = fs.readdirSync(directory)
    const subDirectories = []
    for (const key in files) {
      const file = files[key]
      if (excludeSet.has(file)) continue
      const filePath = path.join(directory, file)
      const stats = fs.statSync(filePath)

      if (stats.isDirectory()) {
        subDirectories.push(filePath)
      } else if (stats.isFile()) {
        // 判断文件类型
        const fileType = getFileType(file)
        if (fileType) {
          const dircStats = fs.statSync(directory)
          const fileData = {
            uid: dircStats.uid,
            directory,
            projectName: path.basename(directory),
            name: file,
            path: filePath,
            type: fileType,
            size: dircStats.size,
            accessTime: dircStats.atime,
            createTime: dircStats.birthtime,
            lastUpdateTime: dircStats.mtime
          }
          parentPort.postMessage(fileData)
          return
        }
      }
    }
    subDirectories.forEach((subDirectory) => {
      scanDirectory(subDirectory)
    })
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Scan directory ${directory} error:`, e.message)
    } else {
      console.error(`Scan directory ${directory} error:`, JSON.stringify(e))
    }
  }
}

function getFileType(file) {
  let result = null
  Object.entries(projectTypes).forEach(([type, config]) => {
    if (typeof config.include === 'string') {
      if (
        config.include === file ||
        (config.include.startsWith('.') && config.include === path.extname(file))
      ) {
        result = type
      }
      return
    }
    config.include.forEach((item) => {
      if (item === file || (item.startsWith('.') && item === path.extname(file))) {
        result = type
      }
    })
  })
  return result
}

const { subDirectories, projectTypes: types } = workerData

projectTypes = types
Object.entries(projectTypes).forEach(([type, config]) => {
  if (!config.exclude) return
  if (typeof config.exclude === 'string') {
    excludeSet.add(type)
  } else {
    config.exclude.forEach((item) => {
      excludeSet.add(item)
    })
  }
})

subDirectories.forEach((dirctory) => {
  scanDirectory(dirctory)
})
