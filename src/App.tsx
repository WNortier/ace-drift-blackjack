import React, { useState, useRef, useEffect } from 'react';
import './style/App.css';
import './style/CardStack.css';
import './style/DealCards.css';
import './style/DealCardsToDealer.css';
import './style/Insurance.css'
import './style/Controls.css'
import './style/Outcome.css'

import { cards, cardBack, chips } from './assets';
import { shuffleArray, playerWins, dealerWins, bustPlayer, bustDealer } from './utility';


function App() {
  const [playerDealtCards, setPlayerDealtCards] = useState<number[]>([]);
  const [dealerDealtCards, setDealerDealtCards] = useState<number[]>([]);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);
  const [openInsuranceModal, setOpenInsuranceModal] = useState(false);
  const cardSoundRef = useRef<HTMLAudioElement>(null)
  const cardStackRef = useRef<HTMLDivElement>(null);
  const [playerBank, setPlayerBank] = useState(1000);
  const [playerScore, setPlayerScore] = useState('')
  const [dealerScore, setDealerScore] = useState('')
  const [lastCardOfRound, setLastCardOfRound] = useState<null | number>(null)

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

  useEffect(() => {
    evaluateCards()
  }, [playerDealtCards, dealerDealtCards])

  const concludeRound = () => {
    const lastCardOfRound = [...playerDealtCards, ...dealerDealtCards].at(-1) as number
    console.log(lastCardOfRound)
    setLastCardOfRound(lastCardOfRound)
    setShuffledCards((prev) => prev.filter((_, index) => ![...playerDealtCards, ...dealerDealtCards].includes(index)));
    setPlayerDealtCards([])
    setDealerDealtCards([])
  }

  const evaluateCards = () => {
    const calculateScore = (dealtCards: number[]) => {
      let score = 0;
      let aceCount = 0;

      dealtCards.forEach(index => {
        const cardValue = shuffledCards[index].value;
        if (Array.isArray(cardValue)) {
          // It's an ace
          score += 11;
          aceCount += 1;
        } else {
          score += cardValue;
        }
      });

      // Adjust for aces if score is over 21
      while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount -= 1;
      }

      return score;
    };

    const playerScore = calculateScore(playerDealtCards);
    const dealerScore = calculateScore(dealerDealtCards);

    if (playerScore > 21) {
      bustPlayer();
    }

    if (dealerScore > 21) {
      bustDealer();
    }

    setPlayerScore(playerScore.toString());
    setDealerScore(dealerScore.toString());
    console.log('Player Score:', playerScore);
    console.log('Dealer Score:', dealerScore);
  };

  const handleFlipDealerCard = () => {
    // Assuming you have a reference to the first dealer card element
    const firstDealerCard = document.querySelector('.card-stack-card.deal-card-dealer-1.first-dealer-card') as HTMLDivElement;
    firstDealerCard.classList.add('flip-first-dealer-card')
    // console.log(firstDealerCard)
    // if (firstDealerCard) {
    //   firstDealerCard.style.translate = 'rotateY(0deg)';
    // }
  }

  const playOutcomes = () => {
    bustPlayer();
    bustDealer();
    playerWins();
    dealerWins();
  }

  const handleBank = (e: React.MouseEvent<HTMLImageElement>, chip: { ['name']: string, ['value']: number }) => {
    const chipValue = parseInt(chip.name.match(/\d+/)?.[0] || '0', 10);
    setPlayerBank((prevBank) => prevBank - chipValue);
    const clickedChip = document.querySelector(`.chip-${chipValue}`) as HTMLImageElement;
    clickedChip.style.display = 'none';
  };

  return (
    <div className="table">


      {/*<button onClick={handleSpeech}>Speak</button>*/}
      <div className="outcomes">
        <div className="player-busts">Player Busts</div>
        <div className="dealer-busts">Dealer Busts</div>
        <div className="player-wins">Player Busts</div>
        <div className="dealer-wins">Dealer Busts</div>
      </div>

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
      <button onClick={handleDealCardsToPlayer}>Deal Cards</button>
      <button onClick={handleDealCardsToDealer}>Deal Cards To Dealer</button>
      <button onClick={handleHit}>Hit Player</button>
      <button onClick={handleDealerHit}>Hit Dealer</button>
      <button onClick={evaluateCards}>Eval</button>
      <button onClick={() => setOpenInsuranceModal(!openInsuranceModal)}>Insurance</button>
      <button onClick={handleFlipDealerCard}>Flip Dealer Card</button>
      <button onClick={playOutcomes}>Bust Player</button>
      <button onClick={concludeRound}>Conclude Round</button>
      {/* <div className="controls">
        <div className="controls-buttons">
        </div>
      </div> */}
      <audio ref={cardSoundRef} src="/card-sound.mp3"></audio>
      <div className={`insurance ${openInsuranceModal ? 'insurance-open' : 'insurance-closed'}`}>
        <div className="insurance-modal">
          Dealer offers insurance
          <div className="insurance-modal-buttons">
            <button onClick={() => setOpenInsuranceModal((prev) => !prev)}>Yes</button>
            <button>No</button>
          </div>
        </div>
      </div>
      <div className="chips">
        <h4>Bank: {`$${playerBank}`}</h4>
        <div className="chips-container">
          {chips.map((chip, index) => (
            <div key={index} className="chip">
              <img height="55px" className={`chip-${chip.value}`} src={`/chips/${chip.name}`} alt={`chip.name-${chip.name}`} onClick={(e) => handleBank(e, chip)} />
            </div>
          ))}
        </div>
        <div className="player-game-state">
          <h5>Player: {playerScore}</h5>
          <h5>Dealer: {dealerScore}</h5>
        </div>
      </div>
    </div>
  );
}

export default App;