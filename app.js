/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost.
- If the player hits 6 in a row (or a double of 6 for the two-dice variant of the game), his GLOBAL score gets lost.
- After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach winning-score points on GLOBAL score wins the game

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

const game = document.getElementById('initialization');
const preInitialization = document.getElementById('pre-initialization');
const start = document.getElementById('start');

//display preferences screen and hide game screen
function preInitialize() {
    preInitialization.style.display = 'block';
    game.style.display = 'none';
}
preInitialize();

//set of functions collecting player's preferences needed for initializing game screen
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

//call above fns once start-event is triggered + fn to initialize game phase
start.addEventListener('click', (e) => {
    e.preventDefault();
    setWinningScore();
    setNumberOfDices();
    setGameStyle();
    initialize();
});

//initialize game screen
function initialize() {
    preInitialization.style.display = 'none';
    game.style.display = 'block';
    document.querySelector('#winning-at').style.display = 'block';

    gameState = true;
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    previousDice = 0;
    
    //define essential elements of the visual gameplay: dices
    diceDOM = document.querySelector('.dice');
    diceOne = document.querySelector('#dices-0');
    diceTwo = document.querySelector('#dices-1');
    previousLeftDOM = document.querySelector('.previous-0');
    previousRightDOM = document.querySelector('.previous-1');

    document.querySelector('.btn-new').style.display = 'none';
    document.querySelector('#winning-at').textContent = `Winning score set at ${win} points`;

    //hide dices in the initial phase
    clearDices();

    if(dices === 2) { //hide text refference to the previous dice
        document.getElementById('p-left').style.display = 'none';
        document.getElementById('p-right').style.display = 'none';
    }

    //set the rest of the visuals to an initial state
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    
    document.getElementById('name-0').textContent = (gameStyle === 'PvP') ? 'Player 1' : 'Player';
    document.getElementById('name-1').textContent = (gameStyle === 'PvP') ? 'Player 2' : 'Computer';
    
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    
    document.querySelector('.player-0-panel').classList.add('active');

    //fn to add event listeners for roll and hold buttons
    addEventListeners();
}

function addEventListeners() {
    document.querySelector('.btn-roll').addEventListener('click', gameplayRoll);
    document.querySelector('.btn-hold').addEventListener('click', gameplayHold); 
}

function removeEventListeners() {
    document.querySelector('.btn-roll').removeEventListener('click', gameplayRoll);
    document.querySelector('.btn-hold').removeEventListener('click', gameplayHold); 
}

function clearDices() {
    diceDOM.style.display = 'none';
    diceOne.style.display = 'none';
    diceTwo.style.display = 'none';
    previousLeftDOM.style.display = 'none';
    previousRightDOM.style.display = 'none';
}

//event listener added to New Game button available
document.querySelector('.btn-new').addEventListener('click', () => {
    preInitialize();
});

// *** THE GAME ***
//fn for rolling-the-dice action
function gameplayRoll() {
    if(gameState) {
        document.querySelector('.bad-roll').textContent = '';
        //ONE-DICE GAME
        if(dices === 1) {
            //generate random number to replicate a dice roll
            let dice = Math.floor(Math.random() * 6) + 1; 

            //display the result
            diceDOM.style.display = 'block';
            diceDOM.src = 'dice-' + dice + '.png';

            //display previous dice to add visual complexity and make it easier to visually refer to rolling 6 in a row
            if(previousDice) {
                if (activePlayer === 0) {
                    previousLeftDOM.style.display = 'block';
                    previousLeftDOM.src = 'dice-' + previousDice + '.png';
                } else {
                    previousRightDOM.style.display = 'block';
                    previousRightDOM.src = 'dice-' + previousDice + '.png';
                }
            }

            //condition checks for ROUND score updating
            if (dice !== 1 && !(dice === 6 && previousDice === 6)) {
                roundScore += dice;
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
            } else if (dice === 6 && previousDice === 6) {
                scores[activePlayer] = 0;
                dice = 0;
                document.querySelector('#score-' + activePlayer).textContent = '0';
                document.querySelector('.bad-roll').textContent = `${(activePlayer === 0) ? 'First player' : 'Second player'} rolled 6 in a row`;
                (gameStyle === 'PvP') ? nextPlayer() : computerPhase();
            } else {
                dice = 0;
                document.querySelector('.bad-roll').textContent = `${(activePlayer === 0) ? 'First player' : 'Second player'} rolled 1`;
                (gameStyle === 'PvP') ? nextPlayer() : computerPhase();
            }
            //save rolled dice to previous dice
            previousDice = dice;
        } else if(dices === 2) {
            //TWO-DICE GAME
            let rollOne = Math.floor(Math.random() * 6) + 1;
            let rollTwo = Math.floor(Math.random() * 6) + 1; 
            
            //define visuals for the dices
            diceOne.style.display = 'block';
            diceTwo.style.display = 'block';

            diceOne.src = 'dice-' + rollOne + '.png';
            diceTwo.src = 'dice-' + rollTwo + '.png';

            if (rollOne !== 1 && rollTwo !== 1 && !(rollOne === 6 && rollTwo === 6)) {
                roundScore += (rollOne + rollTwo);
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
            } else if (rollOne === 6 && rollTwo === 6) {
                scores[activePlayer] = 0;
                document.querySelector('#score-' + activePlayer).textContent = '0';
                document.querySelector('.bad-roll').textContent = `${(activePlayer === 0) ? 'First player' : 'Second player'} rolled double 6`;
                (gameStyle === 'PvP') ? nextPlayer() : computerPhase();
            } else {
                document.querySelector('.bad-roll').textContent = `${(activePlayer === 0) ? 'First player' : 'Second player'} rolled 1`;
                (gameStyle === 'PvP') ? nextPlayer() : computerPhase();
            }
        }
        return activePlayer;
    }
}

function gameplayHold() {
    if(gameState && roundScore !== 0) {
        //add current score to GLOBAL score
        scores[activePlayer] += roundScore;

        //update UI 
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        //check if player won the game
        if(scores[activePlayer] >= win) {
            roundScore = 0;
            clearDices();
            displayWinner();
        } else {
            (gameStyle === 'PvP') ? nextPlayer() : computerPhase();
        }
    }
    return activePlayer;
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

function displayWinner() {
    document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
    gameState = false;
    document.querySelector('#winning-at').style.display = 'none';
    document.querySelector('.btn-new').style.display = 'block';
}

//sequence to be run if gameStyle is Player vs Computer && is Computer's turn
function computerPhase() {
    removeEventListeners();
    nextPlayer();
    randomComputerPlay.firstRoll();
    randomComputerPlay.makeProgress(activePlayer);
}

const computerPlay = {
    roll: function(player) {
        if(player) {
            document.querySelector('.bad-roll').textContent = '';
            //ONE-DICE GAME - Computer's turn
            if(dices === 1) {
                let dice = Math.floor(Math.random() * 6) + 1; 

                //display the result
                diceDOM.style.display = 'block';
                diceDOM.src = 'dice-' + dice + '.png';

                if(previousDice) {
                    previousRightDOM.style.display = 'block';
                    previousRightDOM.src = 'dice-' + previousDice + '.png';
                }

                //condition checks for ROUND score updating
                if (dice !== 1 && !(dice === 6 && previousDice === 6)) {
                    roundScore += dice;
                    document.querySelector('#current-1').textContent = roundScore;
                } else if (dice === 6 && previousDice === 6) {
                    scores[1] = 0;
                    dice = 0;
                    document.querySelector('#score-1').textContent = '0';
                    document.querySelector('.bad-roll').textContent = 'Computer rolled 6 in a row';
                    nextPlayer();
                    addEventListeners();
                } else {
                    dice = 0;
                    document.querySelector('.bad-roll').textContent = 'Computer rolled 1';
                    nextPlayer();
                    addEventListeners();
                }
                previousDice = dice;
                return activePlayer;
            } else if (dices === 2) {
                let rollOne = Math.floor(Math.random() * 6) + 1;
                let rollTwo = Math.floor(Math.random() * 6) + 1; 
                
                diceOne.style.display = 'block';
                diceTwo.style.display = 'block';
    
                diceOne.src = 'dice-' + rollOne + '.png';
                diceTwo.src = 'dice-' + rollTwo + '.png';

                //condition checks for ROUND score updating
                if (rollOne !== 1 && rollTwo !== 1) {
                    roundScore += (rollOne + rollTwo);
                    document.querySelector('#current-1').textContent = roundScore;
                } else if (rollOne === 6 && rollTwo === 6) {
                    scores[1] = 0;
                    document.querySelector('#score-1').textContent = '0';
                    document.querySelector('.bad-roll').textContent = 'Computer rolled double 6';
                    nextPlayer();
                    addEventListeners();
                } else {
                    document.querySelector('.bad-roll').textContent = 'Computer rolled 1';
                    nextPlayer();
                    addEventListeners();
                }
                return activePlayer;
            } else return false;
        }
    },

    hold: function() {
        if(gameState && roundScore !== 0) {
            //add current score to GLOBAL score
            scores[activePlayer] += roundScore;
    
            //update UI 
            document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
    
            //check if player won the game
            if(scores[activePlayer] >= win) {
                roundScore = 0;
                clearDices();
                displayWinner();
            } else {
                nextPlayer();
                addEventListeners();
            }
        }
        return activePlayer;
    }
};

//flip coin to help Computer decide what to do
function flipCoin() {
    let chance = Math.random();
    chance = (chance <= 0.5) ? Math.floor(chance) : Math.ceil(chance);
    return chance;
}

//let Computer play based on flipCoin() and set a timed sequence to display its progress
const randomComputerPlay = {
    time: 1000,
    firstRoll: function() {
        setTimeout( () => computerPlay.roll(activePlayer), this.time);
    },
    makeProgress: function(player) {
        if (player) {
            let chance = flipCoin();
            if(chance) {
                this.time += 1000;
                setTimeout( () => {
                    return this.makeProgress(computerPlay.roll(activePlayer));
                 }, this.time);
            } else {
                this.time += 1000;
                setTimeout( () => computerPlay.hold(), this.time);
            }
        } else return false;
        this.time = 1000;
    }
};