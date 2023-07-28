import fs from 'fs'
import { workerData, parentPort } from 'worker_threads'
import path from 'path'

const projectTypes = {
  java: {
    include: ['.java'],
    ignore: []
  },
  node: {
    include: ['package.json'],
    ignore: ['node_modules']
  },
  flutter: {
    include: ['pubspec.yaml']
  }
}

const ignoreSet = new Set()

Object.entries(projectTypes).forEach(([type, config]) => {
  if (!config.ignore) return
  if (typeof config.ignore === 'string') {
    ignoreSet.add(type)
  } else {
    config.ignore.forEach((item) => {
      ignoreSet.add(item)
    })
  }
})

function scanDirectory(directory) {
  try {
    const filestats = fs.statSync(directory)
    if (!filestats.isDirectory()) return
    const files = fs.readdirSync(directory)
    const subDirectories = []
    for (let key in files) {
      const file = files[key]
      if (ignoreSet.has(file)) continue
      const filePath = path.join(directory, file)
      const stats = fs.statSync(filePath)

      if (stats.isDirectory()) {
        subDirectories.push(filePath)
      } else if (stats.isFile()) {
        // 判断文件类型
        const fileType = getFileType(file)
        if (fileType) {
          const fileData = {
            uid: stats.uid,
            directory,
            projectName: path.basename(directory),
            name: file,
            path: filePath,
            type: fileType,
            size: stats.size,
            accessTime: stats.atime,
            createTime: stats.birthtime,
            lastUpdateTime: stats.mtime
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

const { id, subDirectories } = workerData

subDirectories.forEach((dirctory) => {
  scanDirectory(dirctory)
})
