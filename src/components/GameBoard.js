// GameBoard component
const { useState, useEffect, useRef } = React;

// 添加调试函数，检查所需的全局函数是否可用
const checkRequiredFunctions = () => {
  const required = ['createPlayerDeck', 'drawCards', 'playCard', 'computerPlay', 
                    'handleCardSelection', 'makePrediction', 'endPlayerTurn', 'endComputerTurn'];
  const missing = required.filter(name => !window[name]);
  
  if (missing.length > 0) {
    console.error('缺少必要的全局函数:', missing.join(', '));
    return false;
  }
  return true;
};

const initialGameState = {
  player: {
    deck: [],
    hand: [],
    discard: [],
    health: 10,
    shields: 0,
    reflectDamage: 0,
    extraActions: 0,
    doubledCard: null,
    mbtiDisguise: null
  },
  computer: {
    deck: [],
    hand: [],
    discard: [],
    health: 10,
    shields: 0,
    reflectDamage: 0,
    extraActions: 0,
    doubledCard: null,
    mbtiDisguise: null
  },
  activePlayer: 'player',
  actionsLeft: 2,
  roundCount: 1,
  playerScore: 0,
  computerScore: 0,
  selectedCard: null,
  selectingFromOpponent: false,
  selectingFromDrawn: false,
  selectingFromHand: false,
  selectingFromDiscard: false,
  selectingFromRevealed: false,
  exchangingCards: false,
  predicting: false,
  drawnCards: [],
  revealedCards: [],
  viewedCards: [],
  scryingCards: [],
  selectionPurpose: null,
  playerPrediction: null,
  computerPrediction: null,
  functionsReversed: false
};

const GameBoard = ({ onEndGame, onShowRules }) => {
  console.log('GameBoard组件初始化');
  
  // 检查必要的全局函数是否已定义
  const [functionCheckResult, setFunctionCheckResult] = useState(true);
  
  // 保存调试状态
  if (window.debugState) {
    window.debugState.gameBoard = 'initializing';
  }
  
  const [gameState, setGameState] = useState(initialGameState);
  const [gameLog, setGameLog] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const computerTurnTimeout = useRef(null);
  
  // 验证全局函数
  useEffect(() => {
    const result = checkRequiredFunctions();
    setFunctionCheckResult(result);
    
    if (!result) {
      const errorDiv = document.createElement('div');
      errorDiv.style.position = 'fixed';
      errorDiv.style.top = '110px';
      errorDiv.style.left = '10px';
      errorDiv.style.backgroundColor = 'rgba(255,0,0,0.8)';
      errorDiv.style.color = 'white';
      errorDiv.style.padding = '10px';
      errorDiv.style.borderRadius = '5px';
      errorDiv.style.zIndex = '9999';
      errorDiv.textContent = '游戏功能未正确加载，请刷新页面重试';
      document.body.appendChild(errorDiv);
    }
  }, []);
  
  // Initialize the game
  useEffect(() => {
    console.log('GameBoard useEffect - 初始化游戏');
    
    if (window.debugState) {
      window.debugState.gameBoard = 'initializing game';
    }
    
    if (!functionCheckResult) {
      console.error('由于缺少必要函数，游戏无法初始化');
      return;
    }
    
    try {
      // Create decks
      console.log('开始创建卡组...');
      const playerDeck = window.createPlayerDeck();
      const computerDeck = window.createPlayerDeck();
      
      // Draw initial hands
      console.log('初始抽牌...');
      const playerInitialDraw = window.drawCards(playerDeck, 5);
      const computerInitialDraw = window.drawCards(computerDeck, 5);
      
      console.log('设置初始游戏状态...');
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          deck: playerInitialDraw.remainingDeck,
          hand: playerInitialDraw.cards
        },
        computer: {
          ...prev.computer,
          deck: computerInitialDraw.remainingDeck,
          hand: computerInitialDraw.cards
        }
      }));
      
      addToLog([
        { text: '游戏开始！', type: 'system' },
        { text: '玩家和电脑各抽5张牌作为初始手牌', type: 'system' },
        { text: '轮到玩家行动', type: 'system' }
      ]);
      
      if (window.debugState) {
        window.debugState.gameBoard = 'initialized';
      }
    } catch (error) {
      console.error('游戏初始化失败:', error);
      const errorDiv = document.createElement('div');
      errorDiv.style.position = 'fixed';
      errorDiv.style.top = '160px';
      errorDiv.style.left = '10px';
      errorDiv.style.backgroundColor = 'rgba(255,0,0,0.8)';
      errorDiv.style.color = 'white';
      errorDiv.style.padding = '10px';
      errorDiv.style.borderRadius = '5px';
      errorDiv.style.zIndex = '9999';
      errorDiv.textContent = '游戏初始化错误: ' + error.message;
      document.body.appendChild(errorDiv);
    }
  }, [functionCheckResult]);
  
  // Handle game over conditions
  useEffect(() => {
    if (gameState.player.health <= 0 || gameState.computer.health <= 0) {
      const winner = gameState.player.health <= 0 ? 'computer' : 'player';
      clearTimeout(computerTurnTimeout.current);
      
      onEndGame({
        winner,
        rounds: gameState.roundCount,
        playerScore: gameState.playerScore,
        computerScore: gameState.computerScore,
        cardsPlayed: gameState.playerScore + gameState.computerScore
      });
    }
  }, [gameState.player.health, gameState.computer.health, onEndGame]);
  
  // Handle computer's turn
  useEffect(() => {
    if (isComputerTurn) {
      computerTurnTimeout.current = setTimeout(() => {
        executeComputerTurn();
      }, 1500);
      
      return () => clearTimeout(computerTurnTimeout.current);
    }
  }, [isComputerTurn, gameState]);
  
  // Add messages to the game log
  const addToLog = (messages) => {
    setGameLog(prevLog => [...prevLog, ...messages]);
  };
  
  // Handle card selection in player's hand
  const handlePlayerCardSelect = (card) => {
    if (gameState.activePlayer !== 'player' || gameState.actionsLeft <= 0) {
      return;
    }
    
    setSelectedCard(card);
  };
  
  // Handle playing a card
  const handlePlayCard = () => {
    if (!selectedCard || gameState.activePlayer !== 'player' || gameState.actionsLeft <= 0) {
      return;
    }
    
    // Check if card is nullified by opponent's prediction
    if (gameState.computerPrediction && 
        (gameState.computerPrediction === selectedCard.type || 
         (gameState.computerPrediction === 'core' && selectedCard.type === 'core'))) {
      
      // Remove card from hand
      const newHand = gameState.player.hand.filter(c => c.id !== selectedCard.id);
      const newDiscard = [...gameState.player.discard, selectedCard];
      
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          hand: newHand,
          discard: newDiscard
        },
        computerPrediction: null,
        actionsLeft: prev.actionsLeft - 1
      }));
      
      addToLog([
        { text: `玩家使用 ${selectedCard.name}，但被电脑的预言效果抵消`, type: 'system' }
      ]);
      
      setSelectedCard(null);
      return;
    }
    
    // Remove card from hand
    const newHand = gameState.player.hand.filter(c => c.id !== selectedCard.id);
    
    // Check if this is a doubled effect
    const isDoubled = gameState.player.doubledCard === selectedCard.id;
    
    // Apply card effect
    const {newState, log} = window.playCard(selectedCard, {
      ...gameState,
      player: {
        ...gameState.player,
        hand: newHand
      }
    }, 'player');
    
    // If doubled, apply effect twice
    let finalState = newState;
    if (isDoubled && !newState.selectionPurpose) {
      const doubledResult = window.playCard(selectedCard, newState, 'player');
      finalState = doubledResult.newState;
      log.push(...doubledResult.log);
      log.push({ text: '内向情感的翻倍效果已生效！', type: 'system' });
    }
    
    // Add card to discard
    if (!newState.selectionPurpose) {
      finalState = {
        ...finalState,
        player: {
          ...finalState.player,
          discard: [...finalState.player.discard, selectedCard],
          doubledCard: null
        },
        actionsLeft: finalState.actionsLeft - 1
      };
    }
    
    setGameState(finalState);
    addToLog(log.map(entry => typeof entry === 'string' ? { text: entry, type: 'player' } : entry));
    setSelectedCard(null);
  };
  
  // Handle card selection from different sources
  const handleCardSelectionConfirm = (card) => {
    const { newState, log } = window.handleCardSelection(gameState, card, 'player');
    setGameState(newState);
    addToLog(log.map(entry => typeof entry === 'string' ? { text: entry, type: 'player' } : entry));
  };
  
  // Handle prediction for Ni card
  const handlePredictionSelect = (type) => {
    const { newState, log } = window.makePrediction(gameState, type);
    setGameState(newState);
    addToLog(log.map(entry => typeof entry === 'string' ? { text: entry, type: 'player' } : entry));
  };
  
  // End player's turn
  const handleEndTurn = () => {
    const { newState, log } = window.endPlayerTurn(gameState);
    setGameState(newState);
    addToLog(log.map(entry => typeof entry === 'string' ? { text: entry, type: 'system' } : entry));
    setIsComputerTurn(true);
  };
  
  // Execute computer's turn
  const executeComputerTurn = () => {
    let currentState = { ...gameState };
    
    // Computer gets 2 actions
    let actionsLeft = 2 + (currentState.computer.extraActions || 0);
    currentState.computer.extraActions = 0;
    
    // Execute actions one by one with delay
    const executeAction = () => {
      if (actionsLeft > 0 && currentState.computer.hand.length > 0) {
        // Choose a card to play
        const cardToPlay = window.computerPlay(currentState);
        
        if (cardToPlay) {
          // Check if card is nullified by player's prediction
          if (currentState.playerPrediction && 
              (currentState.playerPrediction === cardToPlay.type || 
               (currentState.playerPrediction === 'core' && cardToPlay.type === 'core'))) {
            
            // Remove card from hand
            const newHand = currentState.computer.hand.filter(c => c.id !== cardToPlay.id);
            const newDiscard = [...currentState.computer.discard, cardToPlay];
            
            currentState = {
              ...currentState,
              computer: {
                ...currentState.computer,
                hand: newHand,
                discard: newDiscard
              },
              playerPrediction: null
            };
            
            addToLog([
              { text: `电脑使用 ${cardToPlay.name}，但被玩家的预言效果抵消`, type: 'system' }
            ]);
            
            actionsLeft--;
            setTimeout(executeAction, 1000);
            return;
          }
          
          // Remove card from hand
          const newHand = currentState.computer.hand.filter(c => c.id !== cardToPlay.id);
          
          // Check if this is a doubled effect
          const isDoubled = currentState.computer.doubledCard === cardToPlay.id;
          
          // Apply card effect
          const {newState, log} = window.playCard(cardToPlay, {
            ...currentState,
            computer: {
              ...currentState.computer,
              hand: newHand
            }
          }, 'computer');
          
          // If doubled, apply effect twice
          let finalState = newState;
          if (isDoubled && !newState.selectionPurpose) {
            const doubledResult = window.playCard(cardToPlay, newState, 'computer');
            finalState = doubledResult.newState;
            log.push(...doubledResult.log);
            log.push({ text: '电脑的内向情感翻倍效果已生效！', type: 'system' });
          }
          
          // If selection is needed, make the selection
          if (finalState.selectionPurpose) {
            let selectedCard = null;
            
            // Simple AI for card selection
            if (finalState.selectionPurpose === 'discard') {
              // Choose highest value card to discard
              const playerCards = [...finalState.player.hand];
              playerCards.sort((a, b) => (b.value || 0) - (a.value || 0));
              selectedCard = playerCards[0];
            } else if (finalState.selectionPurpose === 'return') {
              // Choose lower value card to return to deck
              const drawnCards = [...finalState.drawnCards];
              drawnCards.sort((a, b) => (a.value || 0) - (b.value || 0));
              selectedCard = drawnCards[0];
            } else if (finalState.selectionPurpose === 'choose') {
              // Choose highest value card to keep
              const revealedCards = [...finalState.revealedCards];
              revealedCards.sort((a, b) => (b.value || 0) - (a.value || 0));
              selectedCard = revealedCards[0];
            } else if (finalState.selectionPurpose === 'retrieve') {
              // Choose highest value card from discard
              const discardCards = [...finalState.computer.discard];
              discardCards.sort((a, b) => (b.value || 0) - (a.value || 0));
              selectedCard = discardCards[0];
            } else if (finalState.selectionPurpose === 'double') {
              // Choose highest value card to double
              const handCards = [...finalState.computer.hand];
              handCards.sort((a, b) => (b.value || 0) - (a.value || 0));
              selectedCard = handCards[0];
            } else if (finalState.selectionPurpose === 'play') {
              // Choose highest value card to play
              const drawnCards = [...finalState.drawnCards];
              drawnCards.sort((a, b) => (b.value || 0) - (a.value || 0));
              selectedCard = drawnCards[0];
            }
            
            if (selectedCard) {
              const selectionResult = window.handleCardSelection(finalState, selectedCard, 'computer');
              finalState = selectionResult.newState;
              log.push(...selectionResult.log);
            }
          }
          
          // Add card to discard if not a selection card
          if (!finalState.selectionPurpose) {
            finalState = {
              ...finalState,
              computer: {
                ...finalState.computer,
                discard: [...finalState.computer.discard, cardToPlay],
                doubledCard: null
              }
            };
          }
          
          addToLog(log.map(entry => typeof entry === 'string' ? { text: entry, type: 'computer' } : entry));
          currentState = finalState;
        }
        
        actionsLeft--;
        setTimeout(executeAction, 1000);
      } else {
        // End computer's turn
        const endTurnResult = window.endComputerTurn(currentState);
        setGameState(prevState => ({
          ...endTurnResult.newState,
          roundCount: prevState.roundCount + 1
        }));
        addToLog(endTurnResult.log.map(entry => typeof entry === 'string' ? { text: entry, type: 'system' } : entry));
        setIsComputerTurn(false);
      }
    };
    
    // Start executing actions
    executeAction();
  };
  
  // Calculate health percentage for UI
  const playerHealthPercent = Math.max(0, Math.min(100, (gameState.player.health / 10) * 100));
  const computerHealthPercent = Math.max(0, Math.min(100, (gameState.computer.health / 10) * 100));
  
  // Prediction card type options for Ni
  const cardTypeOptions = [
    { id: 'predict-attack', type: 'attack', name: '攻击' },
    { id: 'predict-defense', type: 'defense', name: '防御' },
    { id: 'predict-support', type: 'support', name: '辅助' },
    { id: 'predict-special', type: 'special', name: '锦囊' },
    { id: 'predict-core', type: 'core', name: '核心功能' }
  ];
  
  return (
    <div className="game-board">
      {/* Computer Area */}
      <div className="opponent-area">
        <div className="player-info">
          <h2>电脑</h2>
          <div className="health-container">
            <span>生命值: {gameState.computer.health}/10</span>
            <div className="health-bar">
              <div 
                className="health-fill" 
                style={{ width: `${computerHealthPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="score-display">得分: {gameState.computerScore}</div>
          
          <div className="deck-discard">
            <div className="deck">
              <div className="card card-back"></div>
              <div className="card-count">牌库: {gameState.computer.deck.length}</div>
            </div>
            <div className="discard">
              <div className="card card-back"></div>
              <div className="card-count">弃牌: {gameState.computer.discard.length}</div>
            </div>
          </div>
        </div>
        
        <div className="hand-container">
          {gameState.computer.hand.map((card, index) => (
            <Card
              key={`computer-card-${index}`}
              card={{ id: `computer-card-${index}`, name: '未知卡牌' }}
              isPlayable={false}
              isHidden={true}
            />
          ))}
        </div>
      </div>
      
      {/* Game Log */}
      <GameLog logEntries={gameLog} />
      
      {/* Player Area */}
      <div className="player-area">
        <div className="hand-container">
          {gameState.player.hand.map(card => (
            <Card
              key={card.id}
              card={card}
              isPlayable={gameState.activePlayer === 'player' && gameState.actionsLeft > 0}
              onSelect={handlePlayerCardSelect}
              isSelected={selectedCard && selectedCard.id === card.id}
              isHidden={false}
            />
          ))}
        </div>
        
        <div className="player-info">
          <div className="deck-discard">
            <div className="deck">
              <div className="card card-back"></div>
              <div className="card-count">牌库: {gameState.player.deck.length}</div>
            </div>
            <div className="discard">
              <div className="card card-back"></div>
              <div className="card-count">弃牌: {gameState.player.discard.length}</div>
            </div>
          </div>
          
          <h2>玩家</h2>
          <div className="health-container">
            <span>生命值: {gameState.player.health}/10</span>
            <div className="health-bar">
              <div 
                className="health-fill" 
                style={{ width: `${playerHealthPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="score-display">得分: {gameState.playerScore}</div>
          
          <div className="action-buttons">
            <div className="actions-info">
              回合: {gameState.roundCount} | 
              行动次数: {gameState.actionsLeft + (gameState.player.extraActions || 0)}
            </div>
            
            {selectedCard && gameState.activePlayer === 'player' && gameState.actionsLeft > 0 && (
              <button 
                className="play-button" 
                onClick={handlePlayCard}
              >
                使用卡牌
              </button>
            )}
            
            {gameState.activePlayer === 'player' && !isComputerTurn && (
              <button 
                className="end-turn-button" 
                onClick={handleEndTurn}
              >
                结束回合
              </button>
            )}
            
            <button 
              className="rules-button" 
              onClick={onShowRules}
            >
              游戏规则
            </button>
          </div>
        </div>
      </div>
      
      {/* Selection Modals */}
      {gameState.selectingFromOpponent && (
        <CardSelection
          cards={gameState.viewedCards}
          title="选择对手手牌弃置"
          onSelect={handleCardSelectionConfirm}
          onCancel={() => setGameState(prev => ({ ...prev, selectingFromOpponent: false, viewedCards: [] }))}
        />
      )}
      
      {gameState.selectingFromDrawn && (
        <CardSelection
          cards={gameState.drawnCards}
          title={gameState.selectionPurpose === 'return' ? "选择放回牌库顶的卡牌" : "选择立即使用的卡牌"}
          onSelect={handleCardSelectionConfirm}
          onCancel={() => {
            // If cancelable, add all to hand, otherwise just one
            if (gameState.selectionPurpose === 'play') {
              setGameState(prev => ({
                ...prev,
                player: {
                  ...prev.player,
                  hand: [...prev.player.hand, ...prev.drawnCards]
                },
                selectingFromDrawn: false,
                drawnCards: [],
                selectionPurpose: null
              }));
            } else {
              // For return, add all to hand
              setGameState(prev => ({
                ...prev,
                player: {
                  ...prev.player,
                  hand: [...prev.player.hand, ...prev.drawnCards]
                },
                selectingFromDrawn: false,
                drawnCards: [],
                selectionPurpose: null
              }));
            }
          }}
        />
      )}
      
      {gameState.selectingFromHand && (
        <CardSelection
          cards={gameState.player.hand}
          title="选择一张卡牌加强效果"
          onSelect={handleCardSelectionConfirm}
          onCancel={() => setGameState(prev => ({ ...prev, selectingFromHand: false, selectionPurpose: null }))}
        />
      )}
      
      {gameState.selectingFromDiscard && (
        <CardSelection
          cards={gameState.player.discard}
          title="从弃牌堆中选择一张卡牌"
          onSelect={handleCardSelectionConfirm}
          onCancel={() => setGameState(prev => ({ ...prev, selectingFromDiscard: false, selectionPurpose: null }))}
        />
      )}
      
      {gameState.selectingFromRevealed && (
        <CardSelection
          cards={gameState.revealedCards}
          title="查看牌库顶部卡牌，选择一张加入手牌"
          onSelect={handleCardSelectionConfirm}
          onCancel={() => {
            // Put all revealed cards back
            setGameState(prev => ({
              ...prev,
              selectingFromRevealed: false,
              revealedCards: [],
              selectionPurpose: null
            }));
          }}
        />
      )}
      
      {gameState.exchangingCards && (
        <CardSelection
          cards={gameState.player.hand}
          title="选择一张卡牌与对手交换"
          onSelect={handleCardSelectionConfirm}
          onCancel={() => setGameState(prev => ({ ...prev, exchangingCards: false, selectionPurpose: null }))}
        />
      )}
      
      {gameState.predicting && (
        <CardSelection
          cards={cardTypeOptions}
          title="预言对手下回合将使用的卡牌类型"
          onSelect={(option) => handlePredictionSelect(option.type)}
          onCancel={() => setGameState(prev => ({ ...prev, predicting: false }))}
        />
      )}
    </div>
  );
};

// Make component globally available
window.GameBoard = GameBoard; 