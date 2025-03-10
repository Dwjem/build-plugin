import { log } from '../log.js';
import { loadConfig } from 'webpack-cli';

class WebpackStrategy {
  async getDistPath() {
    try {
      const webpackConfig = await loadConfig({
        config: [],
        configPath: process.cwd()
      });

      if (webpackConfig && webpackConfig.length > 0) {
        const config = webpackConfig[0];
        return config.output?.path || 'dist';
      } else {
        log('未找到 Webpack 配置文件，使用默认输出路径 dist');
        return 'dist';
      }
    } catch (error) {
      throw error; // 抛出错误，但不打印错误信息
    }
  }
}

export default WebpackStrategy;