// RulesModal component
const RulesModal = ({ onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>游戏规则</h2>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="rules-content">
          <h3>游戏概述</h3>
          <p>《心理功能对决》以荣格的八维功能为核心，包含四种基本心理功能（思维、情感、感觉、直觉），每种功能分为外向和内向两种倾向，共八种功能。</p>
          
          <h3>基本规则</h3>
          <ul>
            <li>游戏采用回合制，玩家与电脑轮流行动</li>
            <li>每位玩家初始生命值为10点</li>
            <li>每回合开始时，玩家抽取2张卡牌</li>
            <li>每回合可以使用2次行动（如出牌）</li>
            <li>通过攻击卡牌减少对手生命值</li>
            <li>当一方生命值降至0时，游戏结束</li>
          </ul>

          <h3>八维功能卡牌</h3>
          <ul>
            <li><strong>外向思维（Te）</strong>: 查看对手一张手牌并强制弃置</li>
            <li><strong>内向思维（Ti）</strong>: 抽两张牌并选择一张放回顶部</li>
            <li><strong>外向情感（Fe）</strong>: 双方各抽一张牌并可交换一张</li>
            <li><strong>内向情感（Fi）</strong>: 选择一张手牌效果翻倍</li>
            <li><strong>外向感觉（Se）</strong>: 立即执行一个额外行动</li>
            <li><strong>内向感觉（Si）</strong>: 从弃牌堆中回收一张卡牌</li>
            <li><strong>外向直觉（Ne）</strong>: 查看牌库顶部三张并选择一张</li>
            <li><strong>内向直觉（Ni）</strong>: 预言对手下回合卡牌类型，若正确则失效</li>
          </ul>
          
          <h3>卡牌类型</h3>
          <ul>
            <li><strong>核心功能卡牌</strong>: 基于荣格八维功能，每种功能有独特的效果</li>
            <li><strong>攻击卡牌</strong>: 对对手造成伤害</li>
            <li><strong>防御卡牌</strong>: 保护自己免受攻击</li>
            <li><strong>辅助卡牌</strong>: 增强自己的能力</li>
            <li><strong>锦囊牌</strong>: 能在关键时刻扭转局势的特殊卡牌</li>
          </ul>
          
          <h3>锦囊牌</h3>
          <ul>
            <li><strong>心理共鸣</strong>: 选择一名玩家，双方交换手牌</li>
            <li><strong>功能反转</strong>: 该回合内，所有玩家的内外向功能卡牌效果对调</li>
            <li><strong>潜意识爆发</strong>: 从牌库中随机抽取三张卡牌，立即使用其中一张</li>
            <li><strong>人格面具</strong>: 伪装成另一种MBTI类型，暂时获得该类型的特殊能力</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Make RulesModal available globally
window.RulesModal = RulesModal; 