// StartScreen component
const StartScreen = ({ onStartGame, onShowRules }) => {
  return (
    <div className="start-screen">
      <div className="start-content">
        <h1 className="game-title">心理功能对决</h1>
        <h2 className="game-subtitle">MBTI 卡牌游戏</h2>
        
        <div className="game-description">
          <p>基于荣格八维功能的卡牌对战游戏，探索人格类型的奥秘！</p>
          <p>使用思维、情感、感觉和直觉功能卡牌，击败你的对手。</p>
        </div>
        
        <div className="start-buttons">
          <button className="start-button" onClick={onStartGame}>
            开始游戏
          </button>
          <button className="rules-button" onClick={onShowRules}>
            游戏规则
          </button>
        </div>
      </div>
      
      <div className="cognitive-functions-showcase">
        {/* 判断功能 - Judging Functions */}
        <div className="showcase-row">
          <div className="showcase-card Te">
            <div className="card-inner">
              <div className="card-front">
                <div className="card-title">外向思维 (Te)</div>
                <div className="card-type">核心功能</div>
                <div className="card-image" style={{ backgroundImage: "url('https://source.unsplash.com/random/300x200/?logic')" }}></div>
                <div className="card-description">回合开始时，查看对手手牌中的一张卡牌，并可强制对手弃置该卡牌。</div>
              </div>
            </div>
          </div>
          
          <div className="showcase-card Ti">
            <div className="card-inner">
              <div className="card-front">
                <div className="card-title">内向思维 (Ti)</div>
                <div className="card-type">核心功能</div>
                <div className="card-image" style={{ backgroundImage: "url('https://source.unsplash.com/random/300x200/?analysis')" }}></div>
                <div className="card-description">从牌库中抽取两张卡牌，选择一张放回牌库顶部。</div>
              </div>
            </div>
          </div>
          
          <div className="showcase-card Fe">
            <div className="card-inner">
              <div className="card-front">
                <div className="card-title">外向情感 (Fe)</div>
                <div className="card-type">核心功能</div>
                <div className="card-image" style={{ backgroundImage: "url('https://source.unsplash.com/random/300x200/?harmony')" }}></div>
                <div className="card-description">双方各抽一张卡牌，并可交换一张手牌。</div>
              </div>
            </div>
          </div>
          
          <div className="showcase-card Fi">
            <div className="card-inner">
              <div className="card-front">
                <div className="card-title">内向情感 (Fi)</div>
                <div className="card-type">核心功能</div>
                <div className="card-image" style={{ backgroundImage: "url('https://source.unsplash.com/random/300x200/?feelings')" }}></div>
                <div className="card-description">选择一张手牌，该回合内其效果翻倍。</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 感知功能 - Perceiving Functions */}
        <div className="showcase-row">
          <div className="showcase-card Se">
            <div className="card-inner">
              <div className="card-front">
                <div className="card-title">外向感觉 (Se)</div>
                <div className="card-type">核心功能</div>
                <div className="card-image" style={{ backgroundImage: "url('https://source.unsplash.com/random/300x200/?action')" }}></div>
                <div className="card-description">立即执行一个额外行动（如出牌或使用技能）。</div>
              </div>
            </div>
          </div>
          
          <div className="showcase-card Si">
            <div className="card-inner">
              <div className="card-front">
                <div className="card-title">内向感觉 (Si)</div>
                <div className="card-type">核心功能</div>
                <div className="card-image" style={{ backgroundImage: "url('https://source.unsplash.com/random/300x200/?memory')" }}></div>
                <div className="card-description">从弃牌堆中选择一张卡牌放回手牌。</div>
              </div>
            </div>
          </div>
          
          <div className="showcase-card Ne">
            <div className="card-inner">
              <div className="card-front">
                <div className="card-title">外向直觉 (Ne)</div>
                <div className="card-type">核心功能</div>
                <div className="card-image" style={{ backgroundImage: "url('https://source.unsplash.com/random/300x200/?creativity')" }}></div>
                <div className="card-description">随机查看牌库顶部三张卡牌，选择一张加入手牌。</div>
              </div>
            </div>
          </div>
          
          <div className="showcase-card Ni">
            <div className="card-inner">
              <div className="card-front">
                <div className="card-title">内向直觉 (Ni)</div>
                <div className="card-type">核心功能</div>
                <div className="card-image" style={{ backgroundImage: "url('https://source.unsplash.com/random/300x200/?vision')" }}></div>
                <div className="card-description">预言对手下回合将打出的卡牌类型（如攻击、防御、辅助），若猜中，该卡牌失效。</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Make StartScreen available globally
window.StartScreen = StartScreen; 