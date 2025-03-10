import { log } from './utils/log.js';
import inquirer from 'inquirer';
import { exec } from 'child_process';

// 询问用户是否更新版本号
export async function updateVersionInteractive() {
  try {
    // 获取当前版本号
    const { stdout: currentVersion } = await execPromise('npm pkg get version');
    log(`当前版本号为: ${currentVersion.trim()}`);

    const { versionType } = await inquirer.prompt([{
      type: 'list',
      name: 'versionType',
      message: '请选择更新方式：',
      choices: [
        { name: '不更新版本号', value: 'none' },
        { name: '更新修订版本号（patch）', value: 'patch' },
        { name: '更新小版本号（minor）', value: 'minor' },
        { name: '更新大版本号（major）', value: 'major' },
      ],
    }]);

    if (versionType !== 'none') {
      // 执行 npm version 命令
      const { stdout: newVersion } = await execPromise(`npm version ${versionType}`);
      log(`版本号已更新: ${newVersion.trim()}`);
    } else {
      log('版本号未更新');
    }
  } catch (error) {
    if (error instanceof Error) {
      log(`Error updating version: ${error.message}`);
    } else {
      log('An unknown error occurred');
    }
  }
}

// 封装 child_process.exec 为 Promise
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(new Error(stderr));
      } else {
        resolve({ stdout });
      }
    });
  });
}