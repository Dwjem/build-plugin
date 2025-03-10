import { log } from '../log.js';
import { loadConfigFromFile } from 'vite';

class ViteStrategy {
  async getDistPath() {
    try {
      const configResult = await loadConfigFromFile(
        { command: 'build', mode: 'production' },
        undefined,
        process.cwd()
      );

      if (configResult) {
        const viteConfig = configResult.config;
        return viteConfig.build?.outDir || 'dist';
      } else {
        log('未找到 Vite 配置文件，使用默认输出路径 dist');
        return 'dist';
      }
    } catch (error) {
      throw error; // 抛出错误，但不打印错误信息
    }
  }
}

export default ViteStrategy;