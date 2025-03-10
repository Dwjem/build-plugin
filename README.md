# build-plugin

一个用于优化前端项目构建流程的 Node.js 插件，提供版本号管理和构建文件打包功能。（当前vite项目亲测可用，由于作者没有webpack和rollup项目，没发测试）

## 使用场景

### 1. 前端项目版本管理

在日常开发中，我们经常遇到这样的场景：
- 每次发布新功能都需要手动修改 package.json 中的版本号
- 团队成员对版本号的修改规则理解不一致
- 忘记更新版本号导致线上版本混乱

使用 build-plugin 后：
- 在构建时自动提示更新版本号
- 统一的语义化版本管理
- 版本号变更历史可追踪

### 2. 自动化部署流程

传统的部署流程通常是：
1. 本地执行构建命令
2. 手动将 dist 目录打包成 ZIP
3. 手动添加版本号到压缩包
4. 发送给运维进行部署

使用 build-plugin 后：
1. 执行 `npm run build` 一键完成所有步骤
2. 自动生成带版本号的 ZIP 包
3. 运维可以直接获取到标准化的部署包

## 特性

- 🔄 自动化版本号更新
  - 在构建前交互式更新项目版本号
  - 支持语义化版本号管理

- 📦 构建文件打包
  - 自动将构建产物打包成 ZIP 文件
  - 支持自定义输出目录
  - 保留版本信息的文件命名

- 🔌 无缝集成
  - 支持主流构建工具（Vite、Webpack 等）
  - 通过 npm scripts 轻松集成
  - 支持自定义构建命令

## 安装

```bash
npm install @dwjem/build-plugin --save-dev
```

## 使用方法

### 1. 配置 package.json

在你的项目的 `package.json` 文件中添加以下脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "prebuild": "npx build-plugin prebuild",
    "postbuild": "npx build-plugin postbuild"
  }
}
```

### 2. 执行构建

运行以下命令开始构建：

```bash
npm run build
```

构建过程将自动执行以下步骤：
1. `prebuild`: 更新版本号
2. `build`: 执行项目构建
3. `postbuild`: 打包构建文件

### 3. 自定义构建命令

如果你使用自定义的构建命令（例如 `build:prod`），需要相应调整 pre/post 脚本名称：

```json
{
  "scripts": {
    "build:prod": "vite build",
    "prebuild:prod": "npx build-plugin prebuild",
    "postbuild:prod": "npx build-plugin postbuild"
  }
}
```

> 命名规则：pre<command> 和 post<command>

## 配置选项

### postbuild 参数

- `--output`: 指定 ZIP 文件的输出目录
  - 类型：`string`
  - 默认值：`version-zip`
  - 示例：`npx build-plugin postbuild --output=dist`

## 工作流程

1. **prebuild 阶段**
   - 交互式提示更新版本号
   - 自动更新 package.json 中的版本信息

2. **postbuild 阶段**
   - 收集构建产物
   - 创建带版本号的 ZIP 文件
   - 保存到指定目录

## 注意事项

- 确保项目根目录下存在 package.json 文件
- ZIP 文件名格式为：`<version>.zip`
- 输出目录不存在时会自动创建

## 许可证

ISC License
