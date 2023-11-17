import { exec } from 'child_process'

// VSCODE
// const workerProcess = exec('Code.exe E:\\code\\frontend\\sheyes-app', {
//   cwd: 'D:\\software\\Microsoft VS Code'
// })

// IDEA
const workerProcess = exec('idea64.exe E:\\code\\frontend\\sheyes-app', {
  cwd: 'D:\\java\\ide\\IntelliJ IDEA 2020.1.4\\bin'
})

// 打印正常的后台可执行程序输出
workerProcess.stdout.on('data', function (data) {
  console.log('stdout: ' + data)
})
// // 打印错误的后台可执行程序输出
// workerProcess.stderr.on('data', function (data) {
//   console.log('stderr: ' + data)
// })
// // 退出之后的输出
// workerProcess.on('close', function (code) {
//   console.log('out code：' + code)
// })
