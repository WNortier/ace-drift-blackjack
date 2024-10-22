import React, { useState, useRef, useEffect } from 'react';
import './style/App.css';
import './style/CardStack.css';
import './style/DealCards.css';
import './style/DealCardsToDealer.css';
import { cards, cardBack, chips } from './assets';
import { shuffleArray } from './utility';


function App() {
  const [playerDealtCards, setPlayerDealtCards] = useState<number[]>([]);
  const [dealerDealtCards, setDealerDealtCards] = useState<number[]>([]);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);
  const cardSoundRef = useRef<HTMLAudioElement>(null)
  const cardStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShuffledCards(shuffleArray([...cards]));
  }, []);

  const getNextCardIndex = (allDealtCards: number[]) => {
    const dealtSet = new Set(allDealtCards);
    for (let i = shuffledCards.length - 1; i >= 0; i--) {
      if (!dealtSet.has(i)) {
        return i;
      }
    }
    return -1; // No more cards available
  };

  // Player Methods 
  const handleDealCardsToPlayer = () => {
    if (cardSoundRef.current) {
      cardSoundRef.current.play();
    }
    const allDealtCards = [...playerDealtCards, ...dealerDealtCards];
    const nextCardIndex1 = getNextCardIndex(allDealtCards);
    const nextCardIndex2 = getNextCardIndex([...allDealtCards, nextCardIndex1]);
    if (nextCardIndex1 !== -1 && nextCardIndex2 !== -1) {
      setPlayerDealtCards((prevCards) => [...prevCards, nextCardIndex1, nextCardIndex2]);
    }
  };

  const handleHit = () => {
    if (cardSoundRef.current) {
      cardSoundRef.current.play();
    }
    const allDealtCards = [...playerDealtCards, ...dealerDealtCards];
    const nextCardIndex = getNextCardIndex(allDealtCards);
    if (nextCardIndex !== -1) {
      setPlayerDealtCards((prevCards) => [...prevCards, nextCardIndex]);
    }
  };

  // Dealer Methods
  const handleDealCardsToDealer = () => {
    if (cardSoundRef.current) {
      cardSoundRef.current.play();
    }
    const allDealtCards = [...playerDealtCards, ...dealerDealtCards];
    const nextCardIndex1 = getNextCardIndex(allDealtCards);
    const nextCardIndex2 = getNextCardIndex([...allDealtCards, nextCardIndex1]);
    if (nextCardIndex1 !== -1 && nextCardIndex2 !== -1) {
      setDealerDealtCards((prevCards) => [...prevCards, nextCardIndex1, nextCardIndex2]);
    }
  };

  const handleDealerHit = () => {
    if (cardSoundRef.current) {
      cardSoundRef.current.play();
    }
    const allDealtCards = [...playerDealtCards, ...dealerDealtCards];
    const nextCardIndex = getNextCardIndex(allDealtCards);
    if (nextCardIndex !== -1) {
      setDealerDealtCards((prevCards) => [...prevCards, nextCardIndex]);
    }
  };

  return (
    <div className="App">
      <button onClick={handleDealCardsToPlayer}>Deal Cards</button>
      <button onClick={handleDealCardsToDealer}>Deal Cards To Dealer</button>
      <button onClick={handleHit}>Hit Player</button>
      <button onClick={handleDealerHit}>Hit Dealer</button>
      {/*<button onClick={handleSpeech}>Speak</button>*/}

      <div className="card-stack" ref={cardStackRef}>
        {shuffledCards.map((card, index) => {
          const playerIndex = playerDealtCards.indexOf(index);
          const dealerIndex = dealerDealtCards.indexOf(index);
          const isPlayerCard = playerIndex !== -1;
          const isDealerCard = dealerIndex !== -1;
          const isFirstDealerCard = isDealerCard && dealerIndex === 0;

          return (
            <div
              key={index}
              className={`card-stack-card
                ${isPlayerCard ? `deal-card-player-${playerIndex + 1}`
                  : isDealerCard ? `deal-card-dealer-${dealerIndex + 1} ${isFirstDealerCard ? 'first-dealer-card' : ''}`
                    : ''
                }`}
              style={isPlayerCard ? { zIndex: playerIndex + 1 } :
                isDealerCard ? { zIndex: dealerIndex + 1 } : {}}
            >
              <div className={` card-stack-card-${index} card-inner`}>
                <div className={`card-front ${isFirstDealerCard ? 'hidden' : ''}`}>
                  <img src={`/cards/${card.name}`} alt={card.name} style={{ border: '0.1px solid grey' }} />
                </div>
                <div className={`card-back ${isFirstDealerCard ? '' : 'hidden'}`}>
                  <img src={cardBack} style={{ border: '0.1px solid grey' }} alt="card-back" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <audio ref={cardSoundRef} src="/card-sound.mp3"></audio>
    </div>
  );
}

export default App;