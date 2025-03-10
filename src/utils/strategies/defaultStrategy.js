import { log } from '../log.js';

class DefaultStrategy {
  async getDistPath() {
    log('未检测到 Vite、Webpack 或 Rollup 配置文件，使用默认输出路径 dist');
    return 'dist';
  }
}

export default DefaultStrategy;