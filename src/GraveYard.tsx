import React, { useState } from 'react'
import { cards, cardBack, chips } from './assets';

const GraveYard = () => {
    const [dealerDealtCards, setDealerDealtCards] = useState<number[]>([]);
    const [playerBank, setPlayerBank] = useState(1000);
    const [shuffledCards, setShuffledCards] = useState<any[]>([]);
    const [playerDealtCards, setPlayerDealtCards] = useState<number[]>([]);

    const getNextCardIndex = (allDealtCards: number[]) => {
        const dealtSet = new Set(allDealtCards);
        for (let i = shuffledCards.length - 1; i >= 0; i--) {
            if (!dealtSet.has(i)) {
                return i;
            }
        }
        return -1; // No more cards available
    };

    const handleDealCardsToDealer = () => {
        const allDealtCards = [...playerDealtCards, ...dealerDealtCards];
        const nextCardIndex1 = getNextCardIndex(allDealtCards);
        const nextCardIndex2 = getNextCardIndex([...allDealtCards, nextCardIndex1]);
        if (nextCardIndex1 !== -1 && nextCardIndex2 !== -1) {
            setDealerDealtCards((prevCards) => [...prevCards, nextCardIndex1, nextCardIndex2]);
        }
    };

    const handleDealerHit = () => {
        const allDealtCards = [...playerDealtCards, ...dealerDealtCards];
        const nextCardIndex = getNextCardIndex(allDealtCards);
        if (nextCardIndex !== -1) {
            setDealerDealtCards((prevCards) => [...prevCards, nextCardIndex]);
        }
    };

    const handleBank = (e: React.MouseEvent<HTMLImageElement>, chip: string) => {
        const chipValue = parseInt(chip.match(/\d+/)?.[0] || '0', 10);
        setPlayerBank((prevBank) => prevBank - chipValue);
    };

    const handleSpeech = () => {
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.name === 'Arthur');
        let utterance = new SpeechSynthesisUtterance("Why is 6 afraid of 7? Well... lets be frank, 13 isn't a very good hand");
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="chips">
            <h4>Bank: {`$${playerBank}`}</h4>
            <div className="chips-container">
                {chips.map((chip, index) => (
                    <div key={index} className="chip">
                        <img height="55px" src={`/chips/${chip}`} alt={`chip-${chip}`} onClick={(e) => handleBank(e, chip.name)} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GraveYard