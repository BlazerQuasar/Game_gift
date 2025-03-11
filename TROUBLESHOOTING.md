# 心理功能对决游戏 - 故障排除指南

## 常见问题

### 1. 点击"开始游戏"按钮后出现白屏

这个问题通常是由以下原因导致的：

#### 可能的原因：

1. **全局函数未正确注册**
   - 游戏逻辑函数可能未正确绑定到window对象
   - React组件可能未正确导出到全局作用域

2. **脚本加载顺序问题**
   - 脚本可能未按正确顺序加载，导致依赖关系错误
   - 某些脚本可能完全未加载

3. **状态管理问题**
   - 游戏状态转换可能有问题
   - 初始化逻辑可能存在错误

4. **浏览器兼容性问题**
   - 某些浏览器可能不完全支持使用的JavaScript功能

#### 解决方案：

1. **使用调试页面**
   
   我们提供了一个专门的调试页面`debug.html`来帮助诊断问题。打开这个页面并按照指示操作。

2. **检查控制台错误**
   
   打开浏览器开发者工具（F12或右键-检查），查看控制台是否有错误信息。常见错误包括：
   - `xxx is not a function` - 表示某个函数未定义
   - `Cannot read property 'xxx' of undefined` - 表示对象引用问题

3. **清除缓存并刷新**
   
   有时候浏览器缓存会导致问题。尝试清除缓存并刷新页面：
   - Chrome: Ctrl+Shift+R
   - Firefox: Ctrl+F5
   - Edge: Ctrl+F5

4. **使用HTTP服务器**
   
   直接打开HTML文件可能导致一些跨域或资源加载问题。请使用HTTP服务器提供页面：
   ```
   npx http-server -o
   ```
   或使用VSCode的Live Server扩展。

5. **尝试其他浏览器**
   
   有时某个特定浏览器可能存在兼容性问题。尝试使用Chrome、Firefox或Edge的最新版本。

### 2. 游戏功能不正常

#### 可能的原因：

1. **游戏逻辑函数未正确执行**
   - 函数可能存在错误
   - 状态更新可能不正确

2. **React组件渲染问题**
   - 组件可能未正确接收props
   - 组件生命周期可能有问题

#### 解决方案：

1. **检查全局函数**
   
   在浏览器控制台执行以下代码来检查关键函数是否已注册：
   ```javascript
   console.log("createPlayerDeck exists:", typeof window.createPlayerDeck === "function");
   console.log("drawCards exists:", typeof window.drawCards === "function");
   console.log("playCard exists:", typeof window.playCard === "function");
   ```

2. **检查React组件**
   
   确认所有React组件已正确注册到全局作用域：
   ```javascript
   console.log("App exists:", typeof window.App === "function");
   console.log("GameBoard exists:", typeof window.GameBoard === "function");
   console.log("StartScreen exists:", typeof window.StartScreen === "function");
   ```

3. **手动测试状态转换**
   
   在浏览器控制台尝试手动更改游戏状态：
   ```javascript
   // 获取应用实例（如果已暴露到window）
   const appInstance = window.appInstance;
   
   // 如果已设置，尝试手动切换状态
   if (appInstance && appInstance.setGameState) {
     appInstance.setGameState('playing');
     console.log("Manually set game state to playing");
   }
   ```

## 高级调试技巧

### 检查全局变量

游戏使用window对象存储组件和函数。检查是否所有必要的全局变量都已正确设置：

```javascript
// 在浏览器控制台执行
const globals = [
  'App', 'Card', 'GameBoard', 'GameLog', 'StartScreen', 'RulesModal', 'GameOverScreen',
  'createPlayerDeck', 'drawCards', 'playCard', 'computerPlay'
];

globals.forEach(name => {
  console.log(`${name}: ${typeof window[name]}`);
});
```

### 监控状态变化

添加以下代码到控制台来监控状态变化：

```javascript
// 监控debugState对象的变化
if (window.debugState) {
  const originalSet = Object.getOwnPropertyDescriptor(window.debugState, 'appState').set;
  
  Object.defineProperty(window.debugState, 'appState', {
    set: function(v) {
      console.log('App state changed to:', v);
      originalSet.call(this, v);
    },
    get: function() {
      return Object.getOwnPropertyDescriptor(window.debugState, 'appState').get.call(this);
    }
  });
  
  console.log('State monitoring enabled');
}
```

## 联系支持

如果以上方法无法解决您的问题，请提供以下信息联系开发者：

1. 您使用的浏览器和操作系统
2. 控制台中显示的错误信息
3. 问题发生的具体步骤
4. debug.html页面生成的报告

## 开发者模式

您可以通过向URL添加"?debug=true"参数来启用开发者模式，例如：

```
http://localhost:8080/index.html?debug=true
```

开发者模式会：
1. 在页面上显示详细的状态信息
2. 将所有日志输出到控制台
3. 提供额外的测试按钮来帮助诊断问题 