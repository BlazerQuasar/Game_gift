// GameOverScreen component
const GameOverScreen = ({ result, onRestartGame }) => {
  return (
    <div className="game-over">
      <h2>{result?.winner === 'player' ? '恭喜你获胜！' : '很遗憾，你失败了！'}</h2>
      
      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">游戏回合数:</span>
          <span className="stat-value">{result?.rounds || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">玩家得分:</span>
          <span className="stat-value">{result?.playerScore || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">电脑得分:</span>
          <span className="stat-value">{result?.computerScore || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">使用卡牌数:</span>
          <span className="stat-value">{result?.cardsPlayed || 0}</span>
        </div>
      </div>
      
      <div className="game-over-message">
        {result?.winner === 'player' 
          ? '你成功地运用了心理功能卡牌的力量，战胜了对手！' 
          : '不要气馁，下次再接再厉！尝试不同的卡牌组合和策略。'}
      </div>
      
      <button className="restart-button" onClick={onRestartGame}>
        再来一局
      </button>
    </div>
  );
};

// Make GameOverScreen available globally
window.GameOverScreen = GameOverScreen; 