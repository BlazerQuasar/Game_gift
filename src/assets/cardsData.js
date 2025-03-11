const cardsData = {
  // Core Function Cards
  coreFunctionCards: [
    {
      id: 'card-te',
      name: '外向思维 (Te)',
      type: 'core',
      function: 'Te',
      description: '回合开始时，查看对手手牌中的一张卡牌，并可强制对手弃置该卡牌。',
      effect: 'viewAndDiscard',
      value: 0
    },
    {
      id: 'card-ti',
      name: '内向思维 (Ti)',
      type: 'core',
      function: 'Ti',
      description: '从牌库中抽取两张卡牌，选择一张放回牌库顶部。',
      effect: 'drawAndReturn',
      value: 0
    },
    {
      id: 'card-fe',
      name: '外向情感 (Fe)',
      type: 'core',
      function: 'Fe',
      description: '双方各抽一张卡牌，并可交换一张手牌。',
      effect: 'drawAndExchange',
      value: 0
    },
    {
      id: 'card-fi',
      name: '内向情感 (Fi)',
      type: 'core',
      function: 'Fi',
      description: '选择一张手牌，该回合内其效果翻倍。',
      effect: 'doubleEffect',
      value: 0
    },
    {
      id: 'card-se',
      name: '外向感觉 (Se)',
      type: 'core',
      function: 'Se',
      description: '立即执行一个额外行动（如出牌或使用技能）。',
      effect: 'extraAction',
      value: 0
    },
    {
      id: 'card-si',
      name: '内向感觉 (Si)',
      type: 'core',
      function: 'Si',
      description: '从弃牌堆中选择一张卡牌放回手牌。',
      effect: 'retrieveFromDiscard',
      value: 0
    },
    {
      id: 'card-ne',
      name: '外向直觉 (Ne)',
      type: 'core',
      function: 'Ne',
      description: '随机查看牌库顶部三张卡牌，选择一张加入手牌。',
      effect: 'viewAndChoose',
      value: 0
    },
    {
      id: 'card-ni',
      name: '内向直觉 (Ni)',
      type: 'core',
      function: 'Ni',
      description: '预言对手下回合将打出的卡牌类型（如攻击、防御、辅助），若猜中，该卡牌失效。',
      effect: 'predict',
      value: 0
    }
  ],
  
  // Attack Cards
  attackCards: [
    {
      id: 'card-attack-1',
      name: '逻辑打击',
      type: 'attack',
      description: '对对手造成2点伤害。',
      effect: 'damage',
      value: 2
    },
    {
      id: 'card-attack-2',
      name: '思维冲击',
      type: 'attack',
      description: '对对手造成1点伤害，并使其弃置一张手牌。',
      effect: 'damageAndDiscard',
      value: 1
    },
    {
      id: 'card-attack-3',
      name: '情感震荡',
      type: 'attack',
      description: '对对手造成3点伤害。',
      effect: 'damage',
      value: 3
    },
    {
      id: 'card-attack-4',
      name: '直觉穿刺',
      type: 'attack',
      description: '对对手造成1-4点伤害（随机）。',
      effect: 'randomDamage',
      minValue: 1,
      maxValue: 4
    },
    {
      id: 'card-attack-5',
      name: '感官攻击',
      type: 'attack',
      description: '对对手造成2点伤害，并查看其手牌。',
      effect: 'damageAndView',
      value: 2
    }
  ],
  
  // Defense Cards
  defenseCards: [
    {
      id: 'card-defense-1',
      name: '思维屏障',
      type: 'defense',
      description: '抵消对手的下一次攻击。',
      effect: 'preventAttack',
      value: 1
    },
    {
      id: 'card-defense-2',
      name: '情感护盾',
      type: 'defense',
      description: '恢复2点生命值。',
      effect: 'heal',
      value: 2
    },
    {
      id: 'card-defense-3',
      name: '感觉反射',
      type: 'defense',
      description: '抵消对手的攻击并反弹一半伤害给对手。',
      effect: 'reflectDamage',
      value: 0.5
    },
    {
      id: 'card-defense-4',
      name: '直觉预警',
      type: 'defense',
      description: '抵消对手的下两次攻击。',
      effect: 'preventAttack',
      value: 2
    }
  ],
  
  // Support Cards
  supportCards: [
    {
      id: 'card-support-1',
      name: '思维加速',
      type: 'support',
      description: '抽两张卡牌。',
      effect: 'draw',
      value: 2
    },
    {
      id: 'card-support-2',
      name: '情感连接',
      type: 'support',
      description: '抽一张卡牌,并恢复1点生命值。',
      effect: 'drawAndHeal',
      drawValue: 1,
      healValue: 1
    },
    {
      id: 'card-support-3',
      name: '感官集中',
      type: 'support',
      description: '查看牌库顶部5张卡牌,并按任意顺序排列。',
      effect: 'scry',
      value: 5
    },
    {
      id: 'card-support-4',
      name: '直觉闪光',
      type: 'support',
      description: '查看对手手牌。',
      effect: 'viewHand',
      value: 0
    }
  ],
  
  
  specialCards: [
    {
      id: 'card-special-1',
      name: '心理共鸣',
      type: 'special',
      description: '双方交换手牌。',
      effect: 'exchangeHands',
      value: 0
    },
    {
      id: 'card-special-2',
      name: '功能反转',
      type: 'special',
      description: '该回合内，所有玩家的内外向功能卡牌效果对调。',
      effect: 'reverseFunctions',
      value: 0
    },
    {
      id: 'card-special-3',
      name: '潜意识爆发',
      type: 'special',
      description: '从牌库中随机抽取三张卡牌，立即使用其中一张。',
      effect: 'drawAndPlay',
      value: 3
    },
    {
      id: 'card-special-4',
      name: '人格面具',
      type: 'special',
      description: '伪装成另一种MBTI类型，暂时获得该类型的特殊能力。',
      effect: 'disguise',
      value: 0
    }
  ]
};

// Function to get all cards in a single array
const getAllCards = () => {
  return [
    ...cardsData.coreFunctionCards,
    ...cardsData.attackCards,
    ...cardsData.defenseCards,
    ...cardsData.supportCards,
    ...cardsData.specialCards
  ];
};

// Function to create a player deck
const createPlayerDeck = () => {
  const allCards = getAllCards();
  return shuffleArray([...allCards]);
};

// Function to shuffle an array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Make these available globally
console.log('正在将卡牌数据和函数注册到全局作用域...');
window.cardsData = cardsData;
window.getAllCards = getAllCards;
window.createPlayerDeck = createPlayerDeck;
window.shuffleArray = shuffleArray;

// 添加验证函数，确保注册成功
(function validateGlobalCardFunctions() {
  const vars = ['cardsData', 'getAllCards', 'createPlayerDeck', 'shuffleArray'];
  
  const missing = vars.filter(name => window[name] === undefined);
  
  if (missing.length > 0) {
    console.error('卡牌数据和函数未正确注册到全局作用域:', missing.join(', '));
  } else {
    console.log('所有卡牌数据和函数已成功注册到全局作用域');
  }
})();

// Keep this for compatibility
export default cardsData; 