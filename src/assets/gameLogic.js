// Game Logic Utilities

// Draw cards from deck
const drawCards = (deck, count) => {
  if (deck.length < count) {
    return { cards: deck, remainingDeck: [] };
  }
  
  const cards = deck.slice(0, count);
  const remainingDeck = deck.slice(count);
  
  return { cards, remainingDeck };
};

// Play a card (handles all card effects)
const playCard = (card, gameState, playerType) => {
  const newState = { ...gameState };
  const isPlayer = playerType === 'player';
  const target = isPlayer ? 'computer' : 'player';
  let log = [];
  
  // Add score for playing a card
  if (isPlayer) {
    newState.playerScore += 1;
  } else {
    newState.computerScore += 1;
  }
  
  // Handle card effects based on card type and effect
  switch (card.effect) {
    // Attack effects
    case 'damage':
      newState[target].health -= card.value;
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 对 ${isPlayer ? '电脑' : '玩家'} 造成 ${card.value} 点伤害`);
      break;
      
    case 'damageAndDiscard':
      newState[target].health -= card.value;
      if (newState[target].hand.length > 0) {
        const randomIndex = Math.floor(Math.random() * newState[target].hand.length);
        const discardedCard = newState[target].hand.splice(randomIndex, 1)[0];
        newState[target].discard.push(discardedCard);
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 对 ${isPlayer ? '电脑' : '玩家'} 造成 ${card.value} 点伤害并弃置一张牌`);
      } else {
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 对 ${isPlayer ? '电脑' : '玩家'} 造成 ${card.value} 点伤害`);
      }
      break;
      
    case 'randomDamage':
      const damage = Math.floor(Math.random() * (card.maxValue - card.minValue + 1)) + card.minValue;
      newState[target].health -= damage;
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 对 ${isPlayer ? '电脑' : '玩家'} 造成 ${damage} 点伤害`);
      break;
      
    case 'damageAndView':
      newState[target].health -= card.value;
      newState.viewedCards = [...newState[target].hand];
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 对 ${isPlayer ? '电脑' : '玩家'} 造成 ${card.value} 点伤害并查看对手手牌`);
      break;
    
    // Defense effects
    case 'preventAttack':
      newState[playerType].shields += card.value;
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 获得 ${card.value} 点护盾`);
      break;
      
    case 'heal':
      newState[playerType].health = Math.min(10, newState[playerType].health + card.value);
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 恢复 ${card.value} 点生命值`);
      break;
      
    case 'reflectDamage':
      newState[playerType].reflectDamage = card.value;
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 下次受到攻击时将反弹 ${card.value * 100}% 的伤害`);
      break;
    
    // Support effects
    case 'draw':
      const drawResult = drawCards(newState[playerType].deck, card.value);
      newState[playerType].hand.push(...drawResult.cards);
      newState[playerType].deck = drawResult.remainingDeck;
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 抽取 ${card.value} 张卡牌`);
      break;
      
    case 'drawAndHeal':
      const drawHealResult = drawCards(newState[playerType].deck, card.drawValue);
      newState[playerType].hand.push(...drawHealResult.cards);
      newState[playerType].deck = drawHealResult.remainingDeck;
      newState[playerType].health = Math.min(10, newState[playerType].health + card.healValue);
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 抽取 ${card.drawValue} 张卡牌并恢复 ${card.healValue} 点生命值`);
      break;
      
    case 'scry':
      newState.scryingCards = newState[playerType].deck.slice(0, Math.min(card.value, newState[playerType].deck.length));
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 查看了牌库顶部的卡牌`);
      break;
      
    case 'viewHand':
      newState.viewedCards = [...newState[target].hand];
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 查看对手手牌`);
      break;
    
    // Core function effects
    case 'viewAndDiscard':
      if (newState[target].hand.length > 0) {
        newState.selectingFromOpponent = true;
        newState.selectionPurpose = 'discard';
        newState.viewedCards = [...newState[target].hand];
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 查看对手手牌并可强制弃置`);
      } else {
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name}，但对手没有手牌`);
      }
      break;
      
    case 'drawAndReturn':
      const drawReturnResult = drawCards(newState[playerType].deck, 2);
      if (drawReturnResult.cards.length > 0) {
        newState.selectingFromDrawn = true;
        newState.drawnCards = drawReturnResult.cards;
        newState.selectionPurpose = 'return';
        newState[playerType].deck = drawReturnResult.remainingDeck;
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 抽取两张牌，选择一张放回`);
      } else {
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name}，但牌库已空`);
      }
      break;
      
    case 'drawAndExchange':
      const playerDrawResult = drawCards(newState.player.deck, 1);
      const computerDrawResult = drawCards(newState.computer.deck, 1);
      
      newState.player.hand.push(...playerDrawResult.cards);
      newState.player.deck = playerDrawResult.remainingDeck;
      
      newState.computer.hand.push(...computerDrawResult.cards);
      newState.computer.deck = computerDrawResult.remainingDeck;
      
      if (isPlayer && newState.player.hand.length > 0 && newState.computer.hand.length > 0) {
        newState.exchangingCards = true;
        newState.selectionPurpose = 'exchange';
        log.push(`玩家使用 ${card.name} 双方各抽一张牌，玩家可选择交换`);
      } else if (!isPlayer) {
        if (newState.player.hand.length > 0 && newState.computer.hand.length > 0) {
          // Computer AI makes a simple decision: always exchange the lowest value card
          const computerHandCopy = [...newState.computer.hand];
          computerHandCopy.sort((a, b) => (a.value || 0) - (b.value || 0));
          const cardToExchange = computerHandCopy[0];
          
          const randomPlayerIndex = Math.floor(Math.random() * newState.player.hand.length);
          const playerCard = newState.player.hand.splice(randomPlayerIndex, 1)[0];
          
          const computerCardIndex = newState.computer.hand.findIndex(c => c.id === cardToExchange.id);
          const computerCard = newState.computer.hand.splice(computerCardIndex, 1)[0];
          
          newState.player.hand.push(computerCard);
          newState.computer.hand.push(playerCard);
          
          log.push(`电脑使用 ${card.name} 双方各抽一张牌，并交换了卡牌`);
        } else {
          log.push(`电脑使用 ${card.name} 双方各抽一张牌`);
        }
      }
      break;
      
    case 'doubleEffect':
      if (newState[playerType].hand.length > 0) {
        newState.selectingFromHand = true;
        newState.selectionPurpose = 'double';
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 选择一张手牌翻倍效果`);
      } else {
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name}，但没有手牌可以加强`);
      }
      break;
      
    case 'extraAction':
      newState[playerType].extraActions += 1;
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 获得一次额外行动`);
      break;
      
    case 'retrieveFromDiscard':
      if (newState[playerType].discard.length > 0) {
        newState.selectingFromDiscard = true;
        newState.selectionPurpose = 'retrieve';
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 从弃牌堆中选择一张`);
      } else {
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name}，但弃牌堆为空`);
      }
      break;
      
    case 'viewAndChoose':
      const topCards = newState[playerType].deck.slice(0, Math.min(3, newState[playerType].deck.length));
      if (topCards.length > 0) {
        newState.selectingFromRevealed = true;
        newState.revealedCards = topCards;
        newState.selectionPurpose = 'choose';
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 查看牌库顶部三张牌`);
      } else {
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name}，但牌库已空`);
      }
      break;
      
    case 'predict':
      if (isPlayer) {
        newState.predicting = true;
        log.push(`玩家使用 ${card.name} 预言对手下回合出牌类型`);
      } else {
        // Computer AI makes a random prediction
        const cardTypes = ['attack', 'defense', 'support', 'special', 'core'];
        const prediction = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        newState.computerPrediction = prediction;
        log.push(`电脑使用 ${card.name} 预言了玩家下回合的出牌类型`);
      }
      break;
      
    // Special card effects
    case 'exchangeHands':
      const tempHand = [...newState.player.hand];
      newState.player.hand = [...newState.computer.hand];
      newState.computer.hand = tempHand;
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 双方交换了手牌`);
      break;
      
    case 'reverseFunctions':
      newState.functionsReversed = true;
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 内外向功能卡牌效果对调`);
      break;
      
    case 'drawAndPlay':
      const drawnForPlay = drawCards(newState[playerType].deck, Math.min(3, newState[playerType].deck.length));
      if (drawnForPlay.cards.length > 0) {
        newState.selectingFromDrawn = true;
        newState.drawnCards = drawnForPlay.cards;
        newState.selectionPurpose = 'play';
        newState[playerType].deck = drawnForPlay.remainingDeck;
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 抽取三张牌并立即使用其中一张`);
      } else {
        log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name}，但牌库已空`);
      }
      break;
      
    case 'disguise':
      // List of MBTI types and their respective function stacks
      const mbtiTypes = [
        { type: 'INTJ', functions: ['Ni', 'Te', 'Fi', 'Se'] },
        { type: 'INTP', functions: ['Ti', 'Ne', 'Si', 'Fe'] },
        { type: 'ENTJ', functions: ['Te', 'Ni', 'Se', 'Fi'] },
        { type: 'ENTP', functions: ['Ne', 'Ti', 'Fe', 'Si'] },
        { type: 'INFJ', functions: ['Ni', 'Fe', 'Ti', 'Se'] },
        { type: 'INFP', functions: ['Fi', 'Ne', 'Si', 'Te'] },
        { type: 'ENFJ', functions: ['Fe', 'Ni', 'Se', 'Ti'] },
        { type: 'ENFP', functions: ['Ne', 'Fi', 'Te', 'Si'] },
        { type: 'ISTJ', functions: ['Si', 'Te', 'Fi', 'Ne'] },
        { type: 'ISFJ', functions: ['Si', 'Fe', 'Ti', 'Ne'] },
        { type: 'ESTJ', functions: ['Te', 'Si', 'Ne', 'Fi'] },
        { type: 'ESFJ', functions: ['Fe', 'Si', 'Ne', 'Ti'] },
        { type: 'ISTP', functions: ['Ti', 'Se', 'Ni', 'Fe'] },
        { type: 'ISFP', functions: ['Fi', 'Se', 'Ni', 'Te'] },
        { type: 'ESTP', functions: ['Se', 'Ti', 'Fe', 'Ni'] },
        { type: 'ESFP', functions: ['Se', 'Fi', 'Te', 'Ni'] }
      ];
      
      // Randomly select a MBTI type
      const selectedType = mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)];
      newState[playerType].mbtiDisguise = selectedType;
      log.push(`${isPlayer ? '玩家' : '电脑'}使用 ${card.name} 伪装成 ${selectedType.type} 类型`);
      break;
      
    default:
      log.push(`${isPlayer ? '玩家' : '电脑'}使用了 ${card.name}`);
      break;
  }
  
  // Return the updated state and log
  return { newState, log };
};

// Computer AI - decide which card to play
const computerPlay = (gameState) => {
  const { computer, player } = gameState;
  const hand = [...computer.hand];
  
  if (hand.length === 0) {
    return null;
  }
  
  // Simplified AI strategy
  // 1. If player health is low, prioritize attack cards
  // 2. If computer health is low, prioritize defense cards
  // 3. Otherwise, use a mix of strategies
  
  // Evaluate each card based on current game state
  const evaluatedCards = hand.map(card => {
    let score = 0;
    
    // If player has prediction active, avoid playing that card type
    if (gameState.playerPrediction && gameState.playerPrediction === card.type) {
      score -= 10;
    }
    
    // Base scoring for different card types
    switch (card.type) {
      case 'attack':
        // Prioritize attacks when player health is low
        score += (10 - player.health) * 2;
        // Value high damage cards more
        score += (card.value || 0) * 2;
        break;
        
      case 'defense':
        // Prioritize defense when computer health is low
        score += (10 - computer.health) * 1.5;
        // Value high healing/prevention more
        score += (card.value || 0) * 1.5;
        break;
        
      case 'support':
        // Draw cards are more valuable when hand is small
        if (card.effect === 'draw' || card.effect === 'drawAndHeal') {
          score += (5 - hand.length) * 2;
        }
        break;
        
      case 'special':
        // Special cards get a baseline score
        score += 5;
        // If player has many cards, exchange hands is valuable
        if (card.effect === 'exchangeHands' && player.hand.length > computer.hand.length + 2) {
          score += 10;
        }
        break;
        
      case 'core':
        // Core function cards get a baseline score
        score += 4;
        // Prioritize based on function
        if (computer.health < 5 && card.function === 'Si') {
          score += 5; // Si is good for recovery
        }
        if (player.hand.length > 3 && card.function === 'Te') {
          score += 6; // Te is good for disrupting player's hand
        }
        break;
    }
    
    return { card, score };
  });
  
  // Sort by score and select best card
  evaluatedCards.sort((a, b) => b.score - a.score);
  return evaluatedCards[0].card;
};

// Handle card selection aftermath
const handleCardSelection = (gameState, selectedCard, playerType) => {
  const newState = { ...gameState };
  const isPlayer = playerType === 'player';
  const player = isPlayer ? 'player' : 'computer';
  const log = [];
  
  switch (newState.selectionPurpose) {
    case 'discard':
      // Find and remove selected card from opponent's hand
      const target = isPlayer ? 'computer' : 'player';
      const cardIndex = newState[target].hand.findIndex(c => c.id === selectedCard.id);
      if (cardIndex !== -1) {
        const removedCard = newState[target].hand.splice(cardIndex, 1)[0];
        newState[target].discard.push(removedCard);
        log.push(`${isPlayer ? '玩家' : '电脑'}使用外向思维，迫使对手弃置 ${removedCard.name}`);
      }
      break;
      
    case 'return':
      // Return selected card to top of deck
      const notSelectedIndex = newState.drawnCards.findIndex(c => c.id !== selectedCard.id);
      if (notSelectedIndex !== -1) {
        const notSelectedCard = newState.drawnCards[notSelectedIndex];
        newState[player].hand.push(notSelectedCard);
        log.push(`${isPlayer ? '玩家' : '电脑'}将 ${selectedCard.name} 放回牌库顶，并将 ${notSelectedCard.name} 加入手牌`);
      }
      // Add selected card to top of deck
      newState[player].deck.unshift(selectedCard);
      break;
      
    case 'exchange':
      // Find computer card to exchange with player
      const randomComputerIndex = Math.floor(Math.random() * newState.computer.hand.length);
      const computerCard = newState.computer.hand.splice(randomComputerIndex, 1)[0];
      
      // Find selected card in player's hand
      const selectedIndex = newState.player.hand.findIndex(c => c.id === selectedCard.id);
      if (selectedIndex !== -1) {
        const playerCard = newState.player.hand.splice(selectedIndex, 1)[0];
        newState.player.hand.push(computerCard);
        newState.computer.hand.push(playerCard);
        log.push(`玩家交换了 ${playerCard.name} 获得了 ${computerCard.name}`);
      }
      break;
      
    case 'double':
      // Mark card for doubled effect
      newState[player].doubledCard = selectedCard.id;
      log.push(`${isPlayer ? '玩家' : '电脑'}选择翻倍 ${selectedCard.name} 的效果`);
      break;
      
    case 'retrieve':
      // Move card from discard to hand
      const discardIndex = newState[player].discard.findIndex(c => c.id === selectedCard.id);
      if (discardIndex !== -1) {
        const retrievedCard = newState[player].discard.splice(discardIndex, 1)[0];
        newState[player].hand.push(retrievedCard);
        log.push(`${isPlayer ? '玩家' : '电脑'}从弃牌堆回收了 ${retrievedCard.name}`);
      }
      break;
      
    case 'choose':
      // Add selected card to hand and remove from revealed
      const revealedIndex = newState.revealedCards.findIndex(c => c.id === selectedCard.id);
      if (revealedIndex !== -1) {
        // Remove from deck and add to hand
        const chosenCard = selectedCard;
        newState[player].hand.push(chosenCard);
        
        // Remove all revealed cards from deck
        newState[player].deck = newState[player].deck.filter(card => 
          !newState.revealedCards.some(revealed => revealed.id === card.id)
        );
        
        log.push(`${isPlayer ? '玩家' : '电脑'}选择了 ${chosenCard.name} 加入手牌`);
      }
      break;
      
    case 'play':
      // Immediately play the selected card
      const playResult = playCard(selectedCard, newState, player);
      newState.drawnCards = newState.drawnCards.filter(c => c.id !== selectedCard.id);
      
      // Add remaining cards to hand
      newState[player].hand.push(...newState.drawnCards);
      
      return { newState: playResult.newState, log: [...log, ...playResult.log] };
  }
  
  // Clear all selection states
  newState.selectingFromOpponent = false;
  newState.selectingFromDrawn = false;
  newState.selectingFromHand = false;
  newState.selectingFromDiscard = false;
  newState.selectingFromRevealed = false;
  newState.exchangingCards = false;
  newState.predicting = false;
  newState.drawnCards = [];
  newState.revealedCards = [];
  newState.viewedCards = [];
  newState.selectionPurpose = null;
  
  return { newState, log };
};

// Make a prediction for Ni card
const makePrediction = (gameState, predictedType) => {
  const newState = { ...gameState };
  newState.playerPrediction = predictedType;
  newState.predicting = false;
  
  return { 
    newState, 
    log: [`玩家预言对手下回合将使用 ${
      {
        'attack': '攻击',
        'defense': '防御',
        'support': '辅助',
        'special': '锦囊',
        'core': '核心功能'
      }[predictedType]
    } 卡牌`]
  };
};

// End player turn and start computer turn
const endPlayerTurn = (gameState) => {
  const newState = { ...gameState };
  const log = [];
  
  // Reset action points and draw cards for computer
  newState.activePlayer = 'computer';
  newState.actionsLeft = 2;
  newState.functionsReversed = false;
  
  // Handle player prediction
  if (newState.playerPrediction) {
    log.push('玩家的预言效果生效中...');
  }
  
  // Computer draws cards
  const drawResult = drawCards(newState.computer.deck, 2);
  newState.computer.hand.push(...drawResult.cards);
  newState.computer.deck = drawResult.remainingDeck;
  log.push(`电脑回合开始，抽取了 ${drawResult.cards.length} 张卡牌`);
  
  return { newState, log };
};

// End computer turn and start player turn
const endComputerTurn = (gameState) => {
  const newState = { ...gameState };
  const log = [];
  
  // Reset action points and draw cards for player
  newState.activePlayer = 'player';
  newState.actionsLeft = 2;
  newState.functionsReversed = false;
  
  // Handle computer prediction
  if (newState.computerPrediction) {
    log.push('电脑的预言效果生效中...');
  }
  
  // Player draws cards
  const drawResult = drawCards(newState.player.deck, 2);
  newState.player.hand.push(...drawResult.cards);
  newState.player.deck = drawResult.remainingDeck;
  log.push(`玩家回合开始，抽取了 ${drawResult.cards.length} 张卡牌`);
  
  // Reset doubled card effect
  newState.player.doubledCard = null;
  
  return { newState, log };
};

// Make all game logic functions available globally - 确保这部分代码不会被误删
console.log('正在将游戏逻辑函数注册到全局作用域...');
window.drawCards = drawCards;
window.playCard = playCard;
window.computerPlay = computerPlay;
window.handleCardSelection = handleCardSelection;
window.makePrediction = makePrediction;
window.endPlayerTurn = endPlayerTurn;
window.endComputerTurn = endComputerTurn;

// 添加验证函数，确保注册成功
(function validateGlobalFunctions() {
  const functions = ['drawCards', 'playCard', 'computerPlay', 'handleCardSelection', 
                    'makePrediction', 'endPlayerTurn', 'endComputerTurn'];
  
  const missingFunctions = functions.filter(fn => typeof window[fn] !== 'function');
  
  if (missingFunctions.length > 0) {
    console.error('游戏逻辑函数未正确注册到全局作用域:', missingFunctions.join(', '));
  } else {
    console.log('所有游戏逻辑函数已成功注册到全局作用域');
  }
})();