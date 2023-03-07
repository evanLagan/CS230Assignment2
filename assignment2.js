//tested in windows on chrome

const topLeft = document.querySelector('.top-left-panel');
const topRight = document.querySelector('.top-right-panel');
const bottomLeft = document.querySelector('.bottom-left-panel');
const bottomRight = document.querySelector('.bottom-right-panel');
const startButton = document.getElementById('start-btn');
const currentScoreElement = document.getElementById('current-score');
const highScoreElement = document.getElementById('high-score');

const light = document.getElementById("light");
let highScore = parseInt(highScoreElement.innerText);
let currentScore = parseInt(currentScoreElement.innerText);
let timer;

const sequences = [];
let sequenceToGuess = [];

const getRandomPanel = () => {
    const panels = [topLeft, bottomRight, bottomLeft, topRight];
    return panels[parseInt(Math.random() * panels.length)];
};

const flash = panel => {
    return new Promise((resolve, reject) => {
        panel.className += ' active';
        setTimeout(() => {
            panel.className = panel.className.replace(' active', '');
            setTimeout(() => {
                resolve();
            }, 500);
        }, 750);
    });
};

let canClick = false;
const panelClicked = panelClicked => {
    startTimer();
    if (!canClick) {
        return;
    }
    const expectedPanel = sequenceToGuess.shift();
    
    if(expectedPanel === panelClicked) {
        
        if (sequenceToGuess.length === 0) {
            currentScore++;
            currentScoreElement.innerText = currentScore.toString();
            sequences.push(getRandomPanel());
            sequenceToGuess = [...sequences];
            startFlashing();
        }
    } 
    else 
    {
        endGame();
    }
}

const startFlashing = async () => {
    clearTimeout(timer);
    canClick = false;
    //delay time is based upon the current level (sequence length)
    //might not be working as expected 
    for (let i = 0; i < sequences.length; i++) {
      const panel = sequences[i];
      const delayTime = i >= 13 ? 1 : i >= 9 ? 5 : i >= 5 ? 15 : 50;
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(flash(panel));
        }, delayTime);
      });
    }
    
    startTimer();
    canClick = true;
   
};

const startGame = () => {
    startButton.disabled = true;
    light.style.backgroundColor = "rgb(0,239,64)";
    setTimeout(() => {
      sequences.push(getRandomPanel());
      sequenceToGuess = [...sequences];
      startFlashing();
      startButton.disabled = false;
    }, 3000);
    
};

const endGame = async() => {
    clearTimeout(timer);
    light.style.backgroundColor = "red";
    
    flashPanelsGameOver();

    //reseting arrays for next game
    sequences.length = 0;
    sequenceToGuess.length = 0;
    
    //setting highscores 
    if (currentScore >= highScore) {
      highScore = currentScore;
      highScoreElement.innerText = highScore.toString();
    }
    currentScore = 0;
    currentScoreElement.innerText = currentScore.toString();
}

const startTimer = () =>{
    clearTimeout(timer);
    timer = setTimeout(() => {
      endGame();
    }, 5000);
}

const flashPanelsGameOver = async () => {
    for (let i = 0; i < 5; i++) {
      topLeft.classList.add('active');
      topRight.classList.add('active');
      bottomLeft.classList.add('active');
      bottomRight.classList.add('active');
      await new Promise((resolve) => setTimeout(resolve, 250));
      topLeft.classList.remove('active');
      topRight.classList.remove('active');
      bottomLeft.classList.remove('active');
      bottomRight.classList.remove('active');
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
};

startButton.addEventListener('click', startGame);

