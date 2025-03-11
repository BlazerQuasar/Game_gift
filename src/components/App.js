// Define the App component for global access
const App = () => {
  const [gameState, setGameState] = React.useState('start'); // start, playing, gameOver
  const [showRules, setShowRules] = React.useState(false);
  const [gameResult, setGameResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  // 添加调试日志
  React.useEffect(() => {
    console.log('App组件状态变更:', gameState);
    
    // 存储到全局调试对象
    if (window.debugState) {
      window.debugState.appState = gameState;
    }
    
    // 如果存在updateDebugState函数，更新调试状态
    if (typeof window.updateDebugState === 'function') {
      window.updateDebugState(gameState);
    }
    
    // 在状态为playing时添加一个UI指示器 
    if (gameState === 'playing') {
      const stateIndicator = document.createElement('div');
      stateIndicator.id = 'state-indicator';
      stateIndicator.style.position = 'fixed';
      stateIndicator.style.top = '10px';
      stateIndicator.style.right = '10px';
      stateIndicator.style.backgroundColor = 'rgba(0,128,0,0.8)';
      stateIndicator.style.color = 'white';
      stateIndicator.style.padding = '10px';
      stateIndicator.style.borderRadius = '5px';
      stateIndicator.style.zIndex = '9999';
      stateIndicator.textContent = '当前状态: 游戏中';
      document.body.appendChild(stateIndicator);
      
      return () => {
        const indicator = document.getElementById('state-indicator');
        if (indicator) {
          document.body.removeChild(indicator);
        }
      };
    }
  }, [gameState]);

  // 检查所有必需的全局函数是否已注册
  const checkRequiredGlobals = () => {
    const requiredFunctions = [
      'createPlayerDeck',
      'drawCards',
      'playCard',
      'computerPlay',
      'handleCardSelection',
      'makePrediction'
    ];
    
    const missingFunctions = requiredFunctions.filter(
      fn => typeof window[fn] !== 'function'
    );
    
    if (missingFunctions.length > 0) {
      throw new Error(`以下游戏函数未正确加载: ${missingFunctions.join(', ')}`);
    }
    
    const requiredComponents = [
      'GameBoard',
      'Card',
      'CardSelection',
      'GameLog'
    ];
    
    const missingComponents = requiredComponents.filter(
      comp => typeof window[comp] !== 'function'
    );
    
    if (missingComponents.length > 0) {
      throw new Error(`以下游戏组件未正确加载: ${missingComponents.join(', ')}`);
    }
    
    return true;
  };

  const startGame = () => {
    console.log('开始游戏按钮点击');
    setError(null); // 清除之前的错误
    
    try {
      // 确保所有需要的全局函数存在
      checkRequiredGlobals();
      
      // 状态转换前记录日志
      console.log('游戏状态即将从', gameState, '转换为 playing');
      
      // 更新状态为playing
      setGameState('playing');
      
      // 记录状态变化
      console.log('游戏状态已更新为: playing');
      
      // 延迟检查GameBoard组件是否已成功挂载
      setTimeout(() => {
        const gameBoard = document.querySelector('.game-board');
        if (!gameBoard) {
          console.warn('游戏启动后未找到.game-board元素，可能GameBoard组件渲染失败');
        } else {
          console.log('GameBoard组件成功挂载');
        }
      }, 500);
    } catch (error) {
      console.error('开始游戏失败:', error);
      
      // 显示错误消息给用户
      setError(`游戏启动失败: ${error.message}`);
      
      // 保持在开始界面
      setGameState('start');
      
      // 在控制台打印更多调试信息
      console.error('错误详情:', error);
      console.log('当前全局函数:');
      ['createPlayerDeck', 'drawCards', 'playCard', 'computerPlay'].forEach(fn => {
        console.log(`${fn}: ${typeof window[fn]}`);
      });
    }
  };

  const endGame = (result) => {
    console.log('游戏结束，结果:', result);
    setGameResult(result);
    setGameState('gameOver');
  };

  const restartGame = () => {
    console.log('重新开始游戏');
    setGameResult(null);
    setError(null);
    setGameState('start');
  };

  const toggleRules = () => {
    console.log('切换规则显示');
    setShowRules(!showRules);
  };

  // 根据不同的游戏状态渲染不同的组件
  const renderGameState = () => {
    if (error) {
      return (
        <div className="error-container">
          <h2 style={{ color: '#e53e3e' }}>错误</h2>
          <p>{error}</p>
          <button onClick={() => setError(null)} className="button">
            返回
          </button>
          <div className="debug-tips">
            <h3>调试提示:</h3>
            <ul>
              <li>请确保所有游戏脚本已正确加载</li>
              <li>检查浏览器控制台是否有更多错误信息</li>
              <li>尝试刷新页面或清除缓存后重试</li>
              <li>
                <a href="debug.html" target="_blank">
                  打开调试页面
                </a>
                进行更详细的排查
              </li>
            </ul>
          </div>
        </div>
      );
    }

    switch (gameState) {
      case 'start':
        return (
          <window.StartScreen 
            onStartGame={startGame} 
            onShowRules={toggleRules} 
          />
        );
      case 'playing':
        return (
          <window.GameBoard 
            onEndGame={endGame} 
            onShowRules={toggleRules} 
          />
        );
      case 'gameOver':
        return (
          <window.GameOverScreen 
            result={gameResult} 
            onRestart={restartGame} 
          />
        );
      default:
        return <div>未知游戏状态</div>;
    }
  };

  return (
    <div className="app-container">
      {renderGameState()}
      {showRules && (
        <window.RulesModal onClose={toggleRules} />
      )}
    </div>
  );
};

// 全局注册App组件
window.App = App;

// 渲染App组件
window.renderApp = function() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    // 初始化调试状态对象
    window.debugState = {
      appState: 'start',
      gameBoardState: null
    };
    
    console.log('开始渲染App组件');
    ReactDOM.render(<App />, rootElement);
  } else {
    console.error('找不到root元素，无法渲染App');
  }
}; 