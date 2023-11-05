document.addEventListener("DOMContentLoaded", function () {
    const difficultyRadioButtons = document.querySelectorAll('input[type="radio"]');
    const numberInput = document.getElementById("numberInput");
    const submitBtn = document.getElementById("submitBtn");
    const resultDisplay = document.querySelector(".result");
    const triesLeft = document.querySelector(".ntry");
    const numberLen = document.querySelector(".len");
    const prevIn = document.querySelector(".prevIn");
    const buttonContainer = document.querySelector(".buttonContainer");

    const difficultySettings = {
        kid: { N: 2, n_tries: 20 },
        easy: { N: 3, n_tries: 10 },
        normal: { N: 4, n_tries: 5 },
        hard: { N: 6, n_tries: 5 },
        impossible: { N: 10, n_tries: 3 }
    };

    const colors = {
        "Pico": "info",
        "Fermi": "success",
        "Bagels": "danger"
    };

    let N = difficultySettings.easy.N;
    let n_tries = difficultySettings.easy.n_tries;
    let randNum = generateRandomNumber(N).toString();
    let tries = 0;

    difficultyRadioButtons.forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (this.checked) {
                const difficulty = this.value;
                N = difficultySettings[difficulty].N;
                n_tries = difficultySettings[difficulty].n_tries;
                randNum = generateRandomNumber(N).toString();
                tries = 0;
                triesLeft.textContent = n_tries;
                numberLen.textContent = N;
                prevIn.textContent = "";
                updateResult("default");
                submitBtn.disabled = false;
            }
        });
    });

    function updateResult(result) {
        if (result === "default") {
            buttonContainer.innerHTML = `
                <button class="btn btn-dark">Play</button>
                <button class="btn btn-dark">Play</button>
                <button class="btn btn-dark">Play</button>
            `;
        } else if (result === "win") {
            buttonContainer.innerHTML = `<h3 class="winText text-success text-center">CORRECT!</h3>`;
        } else if (result === "lost") {
            buttonContainer.innerHTML = `
            <h3 class="winText text-danger text-center">You LOST!</h3>`;

        } else {
            buttonContainer.innerHTML = "";
            result.split(" ").forEach(state => {
                const button = document.createElement("button");
                button.textContent = state;
                button.className = "btn btn-lg btn-" + colors[state];
                buttonContainer.appendChild(button);
            });
        }
    }

    function generateRandomNumber(N) {
        const min = Math.pow(10, N - 1);
        const max = Math.pow(10, N) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateTriesLeft() {
        triesLeft.textContent = n_tries - tries;
    }

    submitBtn.addEventListener("click", handleGuess);
    numberInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            handleGuess();
        }
    });

    function handleGuess() {
        const userInput = numberInput.value;
        prevIn.textContent = userInput;

        if (userInput.length !== N) {
            alert(`The number should have ${N} digits.`);
            return;
        }

        const result = checkGuess(userInput, randNum, N);
        console.log(result);

        updateResult(result);

        numberInput.value = "";
        tries++;

        const correctAnswer = "Fermi ".repeat(N).trim();

        if (result.trim() === correctAnswer) {
            updateResult("win");
            document.querySelector(".winText").classList.add("animate-firework");
            submitBtn.disabled = true;
            resetGame();
        }

        if (tries === n_tries) {
            updateResult("lost");
            submitBtn.disabled = true;
        }

        updateTriesLeft();
    }

    function resetGame() {
        tries = 0;
        numberInput.value = "";
        randNum = generateRandomNumber(N).toString();
        updateTriesLeft();
        submitBtn.disabled = false;
    }

    function checkGuess(userInput, randNum, N) {
        const states = [];

        for (let i = 0; i < N; i++) {
            if (randNum.includes(userInput[i])) {

                if (userInput[i] === randNum[i]) {
                    states.push("Fermi");
                }
                else {
                    states.push("Pico");
                }

            } else {
                states.push("Bagels");
            }
        }

        return states.join(' ');
    }
});
