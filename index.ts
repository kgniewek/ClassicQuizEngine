import questionsData from './quiz.json';

type Question = {
    question: string;
    options: string[];
    answer: string;
};

//DOM
const startButton = document.getElementById('start-button') as HTMLButtonElement;
const questionContainerElement = document.getElementById('question-container')!;
const questionElement = document.getElementById('question')!;
const answerButtonsElement = document.getElementById('answer-buttons')!;
const nextButton = document.getElementById('next-button') as HTMLButtonElement;
const previousButton = document.getElementById('previous-button') as HTMLButtonElement;
const finishButton = document.getElementById('finish-button') as HTMLButtonElement;
const resultContainer = document.getElementById('result-container')!;
const introductionElement = document.getElementById('introduction')!;
const quizTimerElement = document.getElementById('quiz-timer')!;
const questionTimerElement = document.getElementById('question-timer')!;
const totalQuestionsElement = document.getElementById('total-questions')!;
const answeredQuestionsElement = document.getElementById('answered-questions')!;
const remainingQuestionsElement = document.getElementById('remaining-questions')!;

let currentQuestionIndex = 0;
let answers: Record<number, string> = {};
let questions: Question[] = shuffleQuestions(questionsData);
let quizStartTime: Date;
let questionStartTime: Date;
let quizTimer: number;
let questionTimer: number;
let questionTimeSpent: Record<number, number> = {};

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    selectAnswer();
    showNextQuestion();
});
previousButton.addEventListener('click', showPreviousQuestion);
finishButton.addEventListener('click', finishQuiz);

function resetQuiz() {
    console.log("Resetowanie quizu");

    questionContainerElement.style.display = 'none';
    resultContainer.style.display = 'none';
    introductionElement.style.display = 'block';
    startButton.style.display = 'block';

    const cancelButton = document.getElementById('cancel-button');
    if (cancelButton) {
        cancelButton.remove();
    }

    currentQuestionIndex = 0;
    answers = {};
    questions = shuffleQuestions(questionsData);

    localStorage.removeItem('quizResults');
}


function startGame() {
    loadResultsFromLocalStorage();
    startButton.style.display = 'none';
    questionContainerElement.style.display = 'block';

    let cancelButton = document.getElementById('cancel-button') as HTMLButtonElement;
    if (!cancelButton) {
        //anuluj
        cancelButton = document.createElement("button");
        cancelButton.id = 'cancel-button';
        cancelButton.textContent = "Anuluj i wróć";
        questionContainerElement.appendChild(cancelButton);
    }

    cancelButton.addEventListener('click', () => {
        resetQuiz();
    });

    quizStartTime = new Date();
    questionStartTime = new Date();

    startQuizTimer();
    startQuestionTimer();
    showQuestion(questions[currentQuestionIndex]);
    updateQuestionStatus();
}



function updateQuestionStatus() {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const remainingQuestions = totalQuestions - answeredQuestions;

    totalQuestionsElement.textContent = `Liczba wszystkich pytań: ${totalQuestions}`;
    answeredQuestionsElement.textContent = `Liczba pytań, na które odpowiedziano: ${answeredQuestions}`;
    remainingQuestionsElement.textContent = `Liczba pytań, na które nie odpowiedziano: ${remainingQuestions}`;
}


function startQuizTimer() {
    quizTimer = setInterval(() => {
        const now = new Date();
        const elapsed = now.getTime() - quizStartTime.getTime();
        quizTimerElement.textContent = `Czas od rozpoczęcia quizu: ${formatTime(elapsed)}`;
    }, 1000);
}

function startQuestionTimer() {
    questionTimer = setInterval(() => {
        const now = new Date();
        const elapsed = now.getTime() - questionStartTime.getTime();
        questionTimerElement.textContent = `Czas od rozpoczęcia pytania: ${formatTime(elapsed)}`;
    }, 1000);
}

function formatTime(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function resetQuestionTimer() {
    clearInterval(questionTimer);
    questionStartTime = new Date();
    startQuestionTimer();
}

function shuffleQuestions(array: Question[]): Question[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showQuestion(question: Question) {
    resetQuestionTimer(); 
    const questionNumber = currentQuestionIndex + 1;
    questionElement.innerHTML = `<strong>${questionNumber}. </strong> ${question.question}`; 
    answerButtonsElement.innerHTML = '';

    question.options.forEach((option, index) => {
        const container = document.createElement('div');
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.id = 'answer_' + index;
        radioInput.name = 'answer';
        radioInput.value = option;

        if (answers[currentQuestionIndex]) {
            radioInput.disabled = true; //blokada odpowiedzi
        }

        if (answers[currentQuestionIndex] === option) {
            radioInput.checked = true;
        }

        const label = document.createElement('label');
        label.htmlFor = 'answer_' + index;
        label.innerText = option;

        container.appendChild(radioInput);
        container.appendChild(label);
        answerButtonsElement.appendChild(container);
    });

    updateNavigation();
}

function saveResultsToLocalStorage(score: number, incorrectAnswers: number, totalTimeElapsed: number, passScore: number, passed: boolean) {
    const results = {
        score,
        incorrectAnswers,
        questions: questions.map((question, index) => {
            return {
                question: question.question,
                userAnswer: answers[index],
                correctAnswer: question.answer,
                questionScore: questions[index].answer === answers[index] ? 1 : 0,
                timeSpent: questionTimeSpent[index]
            };
        }),
        totalTimeElapsed,
        passScore,
        passed
    };
    localStorage.setItem('quizResults', JSON.stringify(results));
}



function loadResultsFromLocalStorage() {
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
        const results = JSON.parse(storedResults);
        console.log(results);
    }
}

function selectAnswer() {
    const selectedOption = answerButtonsElement.querySelector('input[name="answer"]:checked') as HTMLInputElement | null;
    if (selectedOption) {
        answers[currentQuestionIndex] = selectedOption.value;
        questionTimeSpent[currentQuestionIndex] = new Date().getTime() - questionStartTime.getTime();
    }
    updateQuestionStatus();

}

function showNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(questions[currentQuestionIndex]);
    }
}

function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(questions[currentQuestionIndex]);
    }
}

function updateNavigation() {
    previousButton.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    nextButton.style.display = currentQuestionIndex < questions.length - 1 ? 'block' : 'none';
    finishButton.style.display = currentQuestionIndex === questions.length - 1 ? 'block' : 'none';
}

function finishQuiz() {
    clearInterval(quizTimer);
    clearInterval(questionTimer);
    selectAnswer();
    if (Object.keys(answers).length < questions.length) {
        alert("Nie odpowiedziałeś na wszystkie pytania. Proszę odpowiedzieć na brakujące pytania przed zakończeniem quizu.");
        return;
    }
    questionContainerElement.style.display = 'none';
    resultContainer.style.display = 'block';

    const totalTimeElapsed = new Date().getTime() - quizStartTime.getTime();
    const formattedTotalTime = formatTime(totalTimeElapsed);

    const score = questions.filter((_, index) => questions[index].answer === answers[index]).length;
    const incorrectAnswers = questions.length - score;
    const passScore = Math.ceil(questions.length * 0.5);
    const passed = score >= passScore;

    resultContainer.innerHTML = `
        <h1>Wynik Quizu</h1>
        <p>Maksymalna liczba punktów: ${questions.length}</p>
        <p>Uzyskana liczba punktów: ${score}</p>
        <p>Błędne odpowiedzi: ${incorrectAnswers}</p>
        <p>Liczba punktów potrzebnych do zaliczenia: ${passScore} (${Math.ceil(50)}%)</p>
        <p>Czy zaliczono: ${passed}</p>
        <p>Całkowity czas spędzony na teście: ${formattedTotalTime}</p>
        <h2>Szczegółowe Wyniki</h2>`;

    const resultsTable = document.createElement('table');
    resultsTable.innerHTML = `
        <tr>
            <th>Numer pytania</th>
            <th>Treść pytania</th>
            <th>Moja odpowiedź</th>
            <th>Poprawna odpowiedź</th>
            <th>Uzyskane punkty</th>
            <th>Czas na pytaniu</th>
        </tr>`;

    questions.forEach((question, index) => {
        const questionScore = questions[index].answer === answers[index] ? 1 : 0;
        const timeSpent = formatTime(questionTimeSpent[index] || 0);
        const userAnswer = answers[index] || "Nie udzielono odpowiedzi";

        resultsTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${question.question}</td>
                <td>${userAnswer}</td>
                <td>${question.answer}</td>
                <td>${questionScore}</td>
                <td>${timeSpent}</td>
            </tr>`;
    });

    resultContainer.appendChild(resultsTable);

    //improwizowany separator
    const breakLine = document.createElement("br");
    resultContainer.appendChild(breakLine);

    const backButtonDynamic = document.createElement("button");
    backButtonDynamic.textContent = "Wróć do strony pierwszej";
    backButtonDynamic.addEventListener('click', resetQuiz);
    resultContainer.appendChild(backButtonDynamic);

    saveResultsToLocalStorage(score, incorrectAnswers, totalTimeElapsed, passScore, passed);
}
