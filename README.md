# 心理功能对决 (Psychological Function Showdown)

一款基于MBTI认知功能的卡牌对战游戏，让玩家在有趣的游戏中了解荣格认知功能理论。

## 游戏介绍

"心理功能对决"是一款集教育性和趣味性于一体的卡牌游戏，玩家可以通过游戏了解MBTI人格类型理论中的八种认知功能（Te, Ti, Fe, Fi, Se, Si, Ne, Ni）。游戏将抽象的心理学概念转化为可交互的卡牌效果，寓教于乐。

## 游戏特点

- **八种认知功能卡牌**：每种认知功能都有对应的卡牌和特殊效果
- **多种卡牌类型**：攻击卡、防御卡、辅助卡和特殊卡
- **策略性对战**：需要合理规划手牌和预测对手行动
- **学习型游戏**：通过游戏机制了解MBTI认知功能特点

## 技术栈

- HTML5
- CSS3
- JavaScript
- React (使用全局对象方式加载)
- 没有构建系统，直接通过script标签加载

## 如何开始

1. 克隆仓库：
```
git clone https://github.com/yourusername/mbti-card-game.git
```

2. 使用HTTP服务器提供页面：
```
npx http-server
```
或使用VS Code的Live Server扩展。

3. 在浏览器中访问：
```
http://localhost:8080
```

## 游戏规则

游戏开始时，玩家和电脑各有20点健康值和一副包含各种卡牌的牌组。每回合可以使用一张卡牌，不同卡牌有不同效果：

- **核心功能卡**：代表八种认知功能，每种都有特殊能力
- **攻击卡**：对对手造成伤害
- **防御卡**：恢复生命值或抵消攻击
- **辅助卡**：提供额外效果，如抽牌或查看对手手牌
- **特殊卡**：具有强大或独特的效果

当任一方生命值降至0或牌组耗尽时，游戏结束。

## 调试模式

如果遇到问题，可以通过添加URL参数启用调试模式：
```
http://localhost:8080/index.html?debug=true
```

或使用专门的调试页面：
```
http://localhost:8080/debug.html
```

## 贡献指南

欢迎提交问题和改进建议！如果您想贡献代码，请遵循以下步骤：

1. Fork本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个Pull Request

## 许可证

本项目采用MIT许可证 - 详情请见LICENSE文件 