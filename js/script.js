const wordText = document.querySelector(".word"),
hintText = document.querySelector(".hint span"),
timeText = document.querySelector(".time b"),
inputField = document.querySelector("input"),
refreshBtn = document.querySelector(".refresh-word"),
checkBtn = document.querySelector(".check-word");
contentBox = document.querySelector(".container .content");
startArea = document.querySelector(".startArea");
scoreArea = document.querySelector(".score");
modalContent = document.querySelector(".modal-content");
countdownText = document.createElement("div");

countdownText.classList.add("countdown");
document.body.appendChild(countdownText);

// Get modal elements
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modalText = document.getElementById("modalText");

let correctWord, timer;
let score = 0;

const initTimer = (maxTime) => {
    clearInterval(timer);
    timer = setInterval(() => {
        if (maxTime > 0) {
            maxTime--;
            let minutes = Math.floor(maxTime / 60);
            let seconds = maxTime % 60;
            seconds = seconds < 10 ? "0" + seconds : seconds; // Ensure two-digit seconds
            timeText.innerText = `${minutes}:${seconds}`; // Format MM:SS
            return;
        }
        modal.style.display = "block";
        modalContent.classList.add("modal-wrong");
        modalText.innerHTML = `<br>Time off! <b>${correctWord.toUpperCase()}</b> was the correct word`;
        endGame();
    }, 1000);
}

const showTopics = () => {
    document.getElementById("start-container").style.display = "none"; 
    document.getElementById("topic-selection").style.display = "block"; 
}

const startCountdown = (selectedTopic) => {
    console.log("Selected Topic:", selectedTopic);
    document.getElementById("topic-selection").innerHTML = `<h2>Selected: ${selectedTopic}</h2><p>Get ready!</p>`;

    let countdown = 3;
    const countdownText = document.createElement("h2");
    countdownText.classList.add("countdown");
    countdownText.innerText = countdown;
    document.getElementById("topic-selection").appendChild(countdownText);

    let countdownInterval = setInterval(() => {
        countdown--;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownText.innerText = "GO!";
            setTimeout(() => {
                document.getElementById("topic-selection").style.display = "none";
                contentBox.style.display = "block"; 
                loadWordFile(selectedTopic); // Load words dynamically
            }, 1000);
        } else {
            countdownText.innerText = countdown;
        }
    }, 1000);
}

const loadWordFile = (topic) => {
    // Remove previous word script if it exists
    let existingScript = document.getElementById("word-script");
    if (existingScript) {
        existingScript.remove();
    }

    // Reset words array
    words = [];

    // Create and load new script
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "word-script";

    if (topic === "Topic 1") {
        script.src = "js/word1.js";
    } else if (topic === "Topic 2") {
        script.src = "js/word2.js";
    } else if (topic === "Topic 3") {
        script.src = "js/word3.js";
    }

    script.onload = () => {
        console.log(`${script.src} loaded successfully`);
        console.log("Loaded words:", words); // Debugging
        initGame(); // Start the game after words load
    };

    script.onerror = () => {
        console.error(`Failed to load ${script.src}`);
    };

    document.body.appendChild(script);
};

const endGame = () => {
    clearInterval(timer);
    contentBox.style.display = "none";
    startArea.style.display = "block";
    modal.style.display = "block";
    modalContent.classList.remove("modal-correct");
    modalContent.classList.add("modal-wrong");
    modalText.innerHTML = `
    <center><br>Time off! <b>${correctWord.toUpperCase()}</b> was the correct word.
    <br>You Lost The Game! :(</center><br>
    </center>
    `;

}

const winGame = () => {
    clearInterval(timer);
    contentBox.style.display = "none";  // Hide the game content
    modal.style.display = "block";      // Show the modal

    // Set the modal content for winning
    modalContent.classList.remove("modal-wrong");
    modalContent.classList.add("modal-correct");
    modalText.innerHTML = `
        <br><center>🎉 Congratulations! YOU WIN THE GAME!!! 🎉</center><br>
        <center><button id="restart-btn" onclick="restartGame()">Restart Game</button></center>
    `;
};

// Function to restart the game from the beginning
const restartGame = () => {
    // Reset game state
    score = 0;
    correctWord = "";
    words = [];
    clearInterval(timer);

    // Hide and reset all UI elements
    modal.style.display = "none";  
    contentBox.style.display = "none";  
    document.getElementById("topic-selection").style.display = "none";  
    document.getElementById("start-container").style.display = "block";  

    // Remove old word script if it exists
    let existingScript = document.getElementById("word-script");
    if (existingScript) {
        existingScript.remove();
    }

    // Restore topic selection screen
    document.getElementById("topic-selection").innerHTML = `
        <h2>Choose a Topic</h2>
        <div class="topic-container">
            <center><button class="topic-btn" onclick="startCountdown('Topic 1')">Module 1</button></center>
            <center><button class="topic-btn" onclick="startCountdown('Topic 2')">Module 2</button></center>
            <center><button class="topic-btn" onclick="startCountdown('Topic 3')">Module 3</button></center>
        </div>
    `;

    console.log("Game fully reset. Ready for a new topic.");
};


const initGame = () => {
    if (!timer) initTimer(300);  // Start timer if it hasn't started yet

    let randomObj = words[Math.floor(Math.random() * words.length)];
    let wordArray = randomObj.word.split("");
    
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    
    wordText.innerText = wordArray.join("");
    hintText.innerText = randomObj.hint;
    correctWord = randomObj.word.toLowerCase();
    inputField.value = "";
    inputField.setAttribute("maxlength", correctWord.length);
    scoreArea.innerHTML = score;

    if (score >= 10) {
        winGame();
    }
}

const checkWord = () => {
    let userWord = inputField.value.toLowerCase();

    if (!userWord) { 
        modal.style.display = "block";
        modalContent.classList.remove("modal-wrong");
        modalContent.classList.remove("modal-correct");
        return modalText.innerHTML = `<br>Please enter the word to check!`;
    }

    if (userWord !== correctWord) { 
        if (score >= 1) {
            score -= 1;
            scoreArea.innerHTML = score;
        }
        modal.style.display = "block";
        modalContent.classList.add("modal-wrong");
        return modalText.innerHTML = `<br>Oops! <b>${userWord}</b> is not a correct word`;
    } else {
        modal.style.display = "block";
        modalContent.classList.remove("modal-wrong");
        modalContent.classList.add("modal-correct");
        modalText.innerHTML = `<br>Congrats! <b>${correctWord.toUpperCase()}</b> is the correct word`;
        score++;
    }

    if (score >= 10) {
        winGame();
        return; // Stop function to prevent reinitializing
    }
    initGame();
}

refreshBtn.addEventListener("click", initGame);
checkBtn.addEventListener("click", checkWord);
inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWord();
    }
});

// Modal close behavior
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
