#!/usr/bin/env node
import figlet from 'figlet';
import { log } from './utils/log.js';
import { updateVersionInteractive } from './prebuild.js';
import { parseArgs, compressBuild } from './postbuild.js';

// 根据命令行参数决定执行 pre-build 还是 post-build
const [action] = process.argv.slice(2);

if (action === 'prebuild') {
  figlet.textSync('Build Plugin', { horizontalLayout: 'full' });
  updateVersionInteractive();
} else if (action === 'postbuild') {
  (async () => {
    try {
      const { dir } = parseArgs();
      await compressBuild(dir);
    } catch (error) {
      if (error instanceof Error) {
        log('[error]: 构建失败:', error.message); // 只在顶层显示错误信息
      } else {
        log('[error]: 构建失败: 未知错误');
      }
      process.exit(1); // 终止程序
    }
  })();
} else {
  log('Invalid action. Usage: hooks.js ');
  process.exit(1);
}