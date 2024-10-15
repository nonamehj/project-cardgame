import "./App.css";
import { useCallback, useEffect, useState } from "react";

const shuffleCards = () => {
  const words = [
    "a",
    "a",
    "b",
    "b",
    "c",
    "c",
    "d",
    "d",
    "e",
    "e",
    "f",
    "f",
    "g",
    "g",
    "h",
    "h",
    "i",
    "i",
    "j",
    "j",
  ];
  return words
    .map((word, index) => ({ id: `${word}-${index}`, word }))
    .sort(() => Math.random() - 0.5);
};

function App() {
  const [cards, setCards] = useState(shuffleCards());
  const [matchedCards, setMatchedCards] = useState(new Set());
  const [flippedCards, setFlippedCards] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const startGame = useCallback(() => {
    setCards(shuffleCards());
    setMatchedCards(new Set());
    setFlippedCards([]);
    setIsGameStarted(true);
    setTime(0);
  }, []);
  const resetGame = useCallback(() => {
    setCards(shuffleCards());
    setMatchedCards(new Set());
    setFlippedCards([]);
    setIsGameStarted(false);
    setTime(0);
  }, [startGame]);
  const handleCardClick = (index) => {
    if (!isGameStarted) return;
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.has(cards[index].word)
    )
      return;
    setFlippedCards((prev) => [...prev, index]);
  };
  useEffect(() => {
    // let timer;
    // if (isGameStarted) {
    //   timer = setInterval(() => {
    //     setTime((prev) => prev + 1);
    //   }, 1000);
    // }
    const timer =
      isGameStarted &&
      setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    return () => clearInterval(timer);
  }, [isGameStarted]);
  useEffect(() => {
    if (matchedCards.size === cards.length / 2) {
      setIsGameStarted(false);
    }
  }, [matchedCards, cards.length]);
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCardIndex, secondCardIndex] = flippedCards;
      const firstCardValue = cards[firstCardIndex].word;
      const secondCardValue = cards[secondCardIndex].word;
      if (firstCardValue === secondCardValue) {
        setMatchedCards((prev) => new Set([...prev, firstCardValue]));
        setFlippedCards([]);
      } else {
        const timeout = setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [flippedCards, cards]);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")} : ${secs
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <main className="game-main">
      <div className="game-container">
        <div className="card-container">
          {cards.map((card, index) => {
            const isFlipped =
              flippedCards.includes(index) || matchedCards.has(card.word);
            return (
              <div
                className={`card ${isFlipped ? "flipped" : ""}`}
                key={card.id}
                onClick={() => handleCardClick(index)}
              >
                {isFlipped ? (
                  <div className="card-word">{card.word}</div>
                ) : (
                  <div className="card-back">?</div>
                )}
              </div>
            );
          })}
        </div>
        <div className="game-info">
          <div className="game-time">
            <div className="time-title">게임 시간</div>
            <div className="time-value">{formatTime(time)}</div>
          </div>
          <div className="game-btn-container">
            {isGameStarted || matchedCards.size === 10 ? (
              <button onClick={resetGame} className="reset-btn">
                다시하기
              </button>
            ) : (
              <button onClick={startGame} className="start-btn">
                게임시작
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
