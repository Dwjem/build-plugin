import { log } from '../log.js';
import { loadConfigFile } from 'rollup';
import { existsSync } from 'fs';

class RollupStrategy {
  async getDistPath() {
    try {
      const tsConfigPath = 'rollup.config.ts';
      const jsConfigPath = 'rollup.config.js';
      const configPath = existsSync(tsConfigPath) ? tsConfigPath : jsConfigPath;

      const { options } = await loadConfigFile(configPath);
      if (!options || options.length === 0) {
        log('未找到 Rollup 配置文件，使用默认输出路径 dist');
        return 'dist';
      }

      const config = options[0];
      return config.output?.dir || 'dist';
    } catch (error) {
      throw error; // 抛出错误，但不打印错误信息
    }
  }
}

export default RollupStrategy;