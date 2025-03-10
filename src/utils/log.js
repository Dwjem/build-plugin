import chalk from 'chalk';

export function log(...messages) {
    // 将 [build-plugin] 设置为绿色，其余部分保持默认颜色
    console.log(`${chalk.green('[build-plugin]')} ${messages.join(' ')}`);
}