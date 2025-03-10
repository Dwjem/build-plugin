// postbuild.js
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { exec } from 'child_process';
import { log } from './utils/log.js';
import { getDistPath } from './utils/getConfig.js';

// 读取 package.json 文件
function readPackageJson() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(process.cwd(), 'package.json'), 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

// 压缩构建文件
export async function compressBuild(output_zip) {
  try {
    const packageJson = await readPackageJson();
    const version = packageJson.version;

    // 定义 version 目录路径
    const buildDir = path.join(process.cwd(), output_zip);

    // 判断 version 目录是否存在
    if (!fs.existsSync(buildDir)) {
      log('没有 version 目录，正在创建...');
      fs.mkdirSync(buildDir, { recursive: true });
      log('version 目录创建成功');
    }

    log(`开始压缩: ${version}`);

    // 创建一个新的 zip 文件
    const output = fs.createWriteStream(path.join(buildDir, `${version}.zip`));
    const archive = archiver('zip', { zlib: { level: 9 } });

    // 监听错误事件
    archive.on('error', (err) => {
      log(`压缩失败: ${err.message}`);
      process.exit(1); // 终止程序
    });

    // 获取 dist 目录
    const distDir = await getDistPath();

    log(`dist 目录: ${distDir}`);
    // 将 dist 目录添加到 zip 文件中
    archive.directory(distDir, false);

    // 完成归档并关闭输出流
    archive.pipe(output);
    archive.finalize().then(() => {
      log(`压缩完成: ${version} ==> file:///${path.join(buildDir, version + '.zip').replace(/\\/g, '/')}`);

      // 打开包含压缩文件的目录（Windows）
      if (process.platform === 'win32') {
        const explorerPath = path.join(buildDir).replace(/\\/g, '\\\\'); // 转义反斜杠以用于命令行
        const cmd = `start "" "${explorerPath}"`; // 使用 start 命令打开目录
        exec(cmd); // 执行命令
      }
    });
  } catch (error) {
    throw error; // 抛出错误，但不打印错误信息
  }
}

// 解析命令行参数
export function parseArgs() {
  const args = process.argv.slice(2);
  const dirArg = args.find(arg => arg.startsWith('--output='));
  // 默认打包到 version-zip 目录
  const dir = dirArg ? dirArg.split('=')[1] : 'version-zip';
  return { dir };
}