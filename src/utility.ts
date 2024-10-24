export function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


export const bustPlayer = () => {
    const playerBusts = document.querySelector('.player-busts') as HTMLDivElement;
    playerBusts.style.display = 'block';
    playerBusts.classList.add('animate')
    setTimeout(() => {
        playerBusts.classList.remove('animate')
        playerBusts.style.display = 'none';
    }, 4000)
}

export const bustDealer = () => {
    const playerBusts = document.querySelector('.dealer-busts') as HTMLDivElement;
    playerBusts.style.display = 'block';
    playerBusts.classList.add('animate')
    setTimeout(() => {
        playerBusts.classList.remove('animate')
        playerBusts.style.display = 'none';
    }, 4000)
}

export const playerWins = () => {
    const playerBusts = document.querySelector('.player-wins') as HTMLDivElement;
    playerBusts.style.display = 'block';
    playerBusts.classList.add('animate')
    setTimeout(() => {
        playerBusts.classList.remove('animate')
        playerBusts.style.display = 'none';
    }, 4000)
}

export const dealerWins = () => {
    const playerBusts = document.querySelector('.dealer-wins') as HTMLDivElement;
    playerBusts.style.display = 'block';
    playerBusts.classList.add('animate')
    setTimeout(() => {
        playerBusts.classList.remove('animate')
        playerBusts.style.display = 'none';
    }, 4000)
}