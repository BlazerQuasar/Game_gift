// CardSelection component
const CardSelection = ({ cards, title, onSelect, onCancel }) => {
  const [selectedCard, setSelectedCard] = React.useState(null);
  
  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };
  
  const handleConfirm = () => {
    if (selectedCard) {
      onSelect(selectedCard);
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="selection-title">{title}</h2>
        <button className="close-button" onClick={onCancel}>×</button>
        
        <div className="card-selection">
          {cards.map(card => (
            <Card 
              key={card.id}
              card={card}
              isPlayable={true}
              isSelected={selectedCard && selectedCard.id === card.id}
              onSelect={handleCardSelect}
              isHidden={false}
            />
          ))}
        </div>
        
        <div className="selection-actions">
          <button 
            className="confirm-button" 
            onClick={handleConfirm}
            disabled={!selectedCard}
          >
            确认
          </button>
          <button className="cancel-button" onClick={onCancel}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

// Make CardSelection available globally
window.CardSelection = CardSelection; 