// Card component
const Card = ({ card, isPlayable, onSelect, isSelected, isHidden }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    if (isPlayable && onSelect) {
      onSelect(card);
    }
  };

  // Get background image URL based on card type and function
  const getCardImage = () => {
    if (card.type === 'core') {
      const functionImages = {
        'Te': 'https://source.unsplash.com/random/300x200/?logic',
        'Ti': 'https://source.unsplash.com/random/300x200/?analysis',
        'Fe': 'https://source.unsplash.com/random/300x200/?harmony',
        'Fi': 'https://source.unsplash.com/random/300x200/?values',
        'Se': 'https://source.unsplash.com/random/300x200/?action',
        'Si': 'https://source.unsplash.com/random/300x200/?memory',
        'Ne': 'https://source.unsplash.com/random/300x200/?possibilities',
        'Ni': 'https://source.unsplash.com/random/300x200/?vision'
      };
      return functionImages[card.function] || 'https://source.unsplash.com/random/300x200/?abstract';
    } else {
      const typeImages = {
        'attack': 'https://source.unsplash.com/random/300x200/?attack',
        'defense': 'https://source.unsplash.com/random/300x200/?shield',
        'support': 'https://source.unsplash.com/random/300x200/?support',
        'special': 'https://source.unsplash.com/random/300x200/?special'
      };
      return typeImages[card.type] || 'https://source.unsplash.com/random/300x200/?card';
    }
  };

  const getCardClass = () => {
    let className = 'card';
    
    if (card.type === 'core' && card.function) {
      className += ` ${card.function}`;
    } else {
      className += ` ${card.type}`;
    }
    
    if (isSelected) {
      className += ' selected-card';
    }
    
    if (isPlayable) {
      className += ' playable';
    }
    
    return className;
  };

  return (
    <div 
      className={getCardClass()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {isHidden ? (
        <div className="card-inner">
          <div className="card-back">
            <span>心理功能</span>
          </div>
        </div>
      ) : (
        <div className="card-inner">
          <div className="card-front">
            <div className="card-title">{card.name}</div>
            <div className="card-type">
              {card.type === 'core' ? `核心功能 - ${card.function}` : (
                {
                  'attack': '攻击',
                  'defense': '防御',
                  'support': '辅助',
                  'special': '锦囊'
                }[card.type]
              )}
            </div>
            <div 
              className="card-image" 
              style={{ backgroundImage: `url('${getCardImage()}')` }}
            ></div>
            <div className="card-description">
              {card.description}
            </div>
          </div>
        </div>
      )}
      
      {isHovered && !isHidden && (
        <div className="card-tooltip">
          <h4>{card.name}</h4>
          <p>{card.description}</p>
          {card.effect && <p><strong>效果:</strong> {card.effect}</p>}
        </div>
      )}
    </div>
  );
};

// Make Card available globally
window.Card = Card; 