/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

/* 
1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn (Hint: always save previous dice roll in a separate variable)

2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript)

3. Add another dice to the game, so that there are two dices in the game now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one)
*/

let scores, 
roundScore, 
activePlayer, 
diceDOM, previousLeftDOM, previousRightDOM,
gameState, 
previousDice,
winOptions, win,
oneOrTwo, dices,
versusOptions, gameStyle;

let game = document.getElementById('initialization');

let preInitialization = document.getElementById('pre-initialization');
let start = document.getElementById('start');

function preInitialize() {
    preInitialization.style.display = 'block';
    game.style.display = 'none';
}

preInitialize();

function setWinningScore() {
    winOptions = document.getElementsByName('win-at');
    for (let i = 0; i < winOptions.length; i++) {
        if(winOptions[i].checked) {
            win = Number(winOptions[i].value);
        }
    }
    return win;
}

function setNumberOfDices() {
    oneOrTwo = document.getElementsByName('one-or-two');
    for (let i = 0; i < oneOrTwo.length; i++) {
        if(oneOrTwo[i].checked) {
            dices = Number(oneOrTwo[i].value);
        }
    }
    return dices;
}

function setGameStyle() {
    versusOptions = document.getElementsByName('versus');
    for (let i = 0; i < versusOptions.length; i++) {
        if(versusOptions[i].checked) {
            gameStyle = versusOptions[i].value;
        }
    }
    return gameStyle;
}

start.addEventListener('click', (e) => {
    e.preventDefault();
    setWinningScore();
    setNumberOfDices();
    setGameStyle();
    initialize();
});


function initialize() {
    preInitialization.style.display = 'none';
    game.style.display = 'block';
    document.querySelector('#winning-at').style.display = 'block';

    gameState = true;
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    previousDice = 0;
    
    diceDOM = document.querySelector('.dice');
    diceOne = document.querySelector('#dices-0');
    diceTwo = document.querySelector('#dices-1');
    previousLeftDOM = document.querySelector('.previous-0');
    previousRightDOM = document.querySelector('.previous-1');

    document.querySelector('.btn-new').style.display = 'none';
    document.querySelector('#winning-at').textContent = `Game closes at ${win} points`;
    clearDices();

    if(dices === 2) {
        document.getElementById('p-left').style.display = 'none';
        document.getElementById('p-right').style.display = 'none';
    }

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    
    document.querySelector('.player-0-panel').classList.add('active');
    addEventListeners();
}

// initialize();

function addEventListeners() {
    document.querySelector('.btn-roll').addEventListener('click', gameplayRoll);
    document.querySelector('.btn-hold').addEventListener('click', gameplayHold); 
}

function removeEventListeners() {
    document.querySelector('.btn-roll').removeEventListener('click', gameplayRoll);
    document.querySelector('.btn-hold').removeEventListener('click', gameplayHold); 
}

function gameplayRoll() {
    if(gameState) {
        document.querySelector('.bad-roll').textContent = '';
/////////////////////////////////////////////////////////////////////////////////
//ONE-DICE GAME
        if(dices === 1) {
            //generate random number to replicate a dice roll
            let dice = Math.floor(Math.random() * 6) + 1; 

            //display the result
            diceDOM.style.display = 'block';
            diceDOM.src = 'dice-' + dice + '.png';

            if(previousDice) {
                if (activePlayer === 0) {
                    previousLeftDOM.style.display = 'block';
                    previousLeftDOM.src = 'dice-' + previousDice + '.png';
                } else {
                    previousRightDOM.style.display = 'block';
                    previousRightDOM.src = 'dice-' + previousDice + '.png';
                }
            }

            //update roundScore IF rolled number is NOT a 1
            if (dice !== 1) {
                //add to score
                roundScore += dice;
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
            } else if (dice === 6 && previousDice === 6) {
                //new rule for two 6s in a row
                scores[activePlayer] = 0;
                dice = 0;
                document.querySelector('#score-' + activePlayer).textContent = '0';
                document.querySelector('.bad-roll').textContent = 'You rolled 6 in a row';
                if(gameStyle === 'PvP') {
                    nextPlayer();
                } else {
                    removeEventListeners();
                    nextPlayer();
                    // computerPlay.roll();
                    randomComputerPlay.firstRoll();
                    randomComputerPlay.makeProgress();
                }
            } else {
                //next player's turn
                dice = 0;
                document.querySelector('.bad-roll').textContent = 'You rolled 1';
                if(gameStyle === 'PvP') {
                    nextPlayer();
                } else {
                    removeEventListeners();
                    nextPlayer();
                    // computerPlay.roll();
                    randomComputerPlay.firstRoll();
                    randomComputerPlay.makeProgress();
                }
            }

            previousDice = dice;
        }

/////////////////////////////////////////////////////////////////////////////////
//TWO-DICE GAME
        if(dices === 2) {
            let rollOne = Math.floor(Math.random() * 6) + 1;
            let rollTwo = Math.floor(Math.random() * 6) + 1; 
            
            diceOne.style.display = 'block';
            diceTwo.style.display = 'block';

            diceOne.src = 'dice-' + rollOne + '.png';
            diceTwo.src = 'dice-' + rollTwo + '.png';

            if (rollOne !== 1 && rollTwo !== 1) {
                //add to score
                roundScore += (rollOne + rollTwo);
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
            } else {
                //next player's turn
                document.querySelector('.bad-roll').textContent = 'You rolled 1';
                nextPlayer();
            }

            //new rule for two 6s
            if (rollOne === 6 && rollTwo === 6) {
                scores[activePlayer] = 0;
                document.querySelector('#score-' + activePlayer).textContent = '0';
                document.querySelector('.bad-roll').textContent = 'You rolled double 6';
                nextPlayer();
            }
        }
    }
}

function gameplayHold() {
    if(gameState && roundScore !== 0) {
        //add current score to global score
        scores[activePlayer] += roundScore;

        //update UI 
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        //check if player won the game
        if(scores[activePlayer] >= win) {
            roundScore = 0;
            clearDices();
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gameState = false;
            document.querySelector('#winning-at').style.display = 'none';
            document.querySelector('.btn-new').style.display = 'block';
        } else {
            if(gameStyle === 'PvP') {
                nextPlayer();
            } else {
                removeEventListeners();
                nextPlayer();
                // computerPlay.roll();
                randomComputerPlay.firstRoll();
                randomComputerPlay.makeProgress();
            }
        }
    }
}


function nextPlayer() {
    clearDices();
    activePlayer = (activePlayer === 0) ? 1 : 0;
    roundScore = 0;
    previousDice = 0;

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
}

function clearDices() {
    diceDOM.style.display = 'none';
    diceOne.style.display = 'none';
    diceTwo.style.display = 'none';
    previousLeftDOM.style.display = 'none';
    previousRightDOM.style.display = 'none';
}

document.querySelector('.btn-new').addEventListener('click', () => {
    preInitialize();
});

const computerPlay = {
    roll: function() {
        document.querySelector('.bad-roll').textContent = '';

        let dice = Math.floor(Math.random() * 6) + 1; 

        //display the result
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-' + dice + '.png';

        if(previousDice) {
            previousRightDOM.style.display = 'block';
            previousRightDOM.src = 'dice-' + previousDice + '.png';
        }

        //update roundScore IF rolled number is NOT a 1
        if (dice !== 1) {
            //add to score
            roundScore += dice;
            document.querySelector('#current-1').textContent = roundScore;
        } else if (dice === 6 && previousDice === 6) {
            //new rule for two 6s in a row
            scores[activePlayer] = 0;
            dice = 0;
            document.querySelector('#score-1').textContent = '0';
            document.querySelector('.bad-roll').textContent = 'Computer rolled 6 in a row';
            nextPlayer();
            addEventListeners();
        } else {
            //next player's turn
            dice = 0;
            document.querySelector('.bad-roll').textContent = 'Computer rolled 1';
            nextPlayer();
            addEventListeners();
        }

        previousDice = dice;
    },

    hold: function() {
        if(gameState && roundScore !== 0) {
            //add current score to global score
            scores[1] += roundScore;
    
            //update UI 
            document.querySelector('#score-1').textContent = scores[activePlayer];
    
            //check if player won the game
            if(scores[1] >= win) {
                clearDices();
                roundScore = 0;

                document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
                document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
                document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
                gameState = false;
                document.querySelector('#winning-at').style.display = 'none';
                document.querySelector('.btn-new').style.display = 'block';
            } else {
                //next player
                nextPlayer();
                addEventListeners();
            }
        }
    }
};

function flipCoin() {
    let chance = Math.random();
    chance = (chance <= 0.5) ? Math.floor(chance) : Math.ceil(chance);
    return chance;
}

const randomComputerPlay = {
    time: 1000,
    firstRoll: function() {
        setTimeout( () => computerPlay.roll(), this.time);
    },
    makeProgress: function() {
        if (activePlayer === 1) {
            let chance = flipCoin();
            if(chance) {
                this.time += 1000;
                setTimeout( () => computerPlay.roll(), this.time);
                this.makeProgress();
            } else {
                this.time += 1000;
                setTimeout( () => computerPlay.hold(), this.time);
            }
        }
        this.time = 1000;
    }
};