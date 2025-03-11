// GameLog component
const GameLog = ({ logEntries }) => {
  const logRef = React.useRef(null);
  
  React.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logEntries]);
  
  return (
    <div className="game-log" ref={logRef}>
      {logEntries.map((entry, index) => (
        <div 
          key={index} 
          className={`log-entry ${entry.type}-log`}
        >
          {entry.text}
        </div>
      ))}
      {logEntries.length === 0 && (
        <div className="log-entry system-log">游戏日志将显示在这里...</div>
      )}
    </div>
  );
};

// Make GameLog available globally
window.GameLog = GameLog; 