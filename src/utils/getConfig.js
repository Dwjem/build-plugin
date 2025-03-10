import { log } from './log.js';
import fs from 'fs';
import path from 'path';

// 工厂函数：根据构建工具返回相应的策略类
async function getStrategy(buildTool) {
  try {
    switch (buildTool) {
      case 'vite': {
        const { default: ViteStrategy } = await import('./strategies/viteStrategy.js');
        return new ViteStrategy();
      }
      case 'webpack': {
        const { default: WebpackStrategy } = await import('./strategies/webpackStrategy.js');
        return new WebpackStrategy();
      }
      case 'rollup': {
        const { default: RollupStrategy } = await import('./strategies/rollupStrategy.js');
        return new RollupStrategy();
      }
      default: {
        const { default: DefaultStrategy } = await import('./strategies/defaultStrategy.js');
        return new DefaultStrategy();
      }
    }
  } catch (error) {
    log(`加载策略类失败: ${error.message}`);
    const { default: DefaultStrategy } = await import('./strategies/defaultStrategy.js');
    return new DefaultStrategy();
  }
}

// 检测项目使用的构建工具
function detectBuildTool() {
  const configFiles = [
    'vite.config.js',
    'vite.config.ts',
    'webpack.config.js',
    'webpack.config.ts',
    'rollup.config.js',
    'rollup.config.ts',
  ];

  for (const file of configFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      if (file.startsWith('vite')) {
        return 'vite';
      } else if (file.startsWith('webpack')) {
        return 'webpack';
      } else if (file.startsWith('rollup')) {
        return 'rollup';
      }
    }
  }

  return 'unknown';
}

// 获取打包输出路径
export async function getDistPath() {
  try {
    const buildTool = detectBuildTool();
    const strategy = await getStrategy(buildTool);
    return await strategy.getDistPath();
  } catch (error) {
    throw error; // 抛出错误，但不打印错误信息
  }
}