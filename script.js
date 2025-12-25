// Classes
class Question {
    constructor(questionText, answers, correctAnswer) {
        this.questionText = questionText;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }
    checkAnswer(answer) {
        return answer === this.correctAnswer;
    }
}

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.questionIndex = 0;
        this.correctAnswers = 0;
    }
    callQuestion() {
        return this.questions[this.questionIndex];
    }
}

// Questions
let questions = [
    new Question("Capital of Azerbaijan?", {a:"Baku", b:"Sumgait", c:"Ganja"}, "a"),
    new Question("Triumph Day?", {a:"28 May", b:"18 October", c:"8 November"}, "c"),
    new Question("National Dish?", {a:"Plov", b:"Doner", c:"Sushi"}, "a"),
    new Question("Birthplace of crude oil?", {a:"Saudi Arabia", b:"Azerbaijan", c:"USA"}, "b"),
    new Question("Baku European Games?", {a:"2020", b:"2017", c:"2015"}, "c")
];

// Initialize
const quiz = new Quiz(questions);
const option_list = document.querySelector(".option-list");
const counterLineElement = document.querySelector(".time-line");

// Start Button
document.querySelector(".btn-start").addEventListener("click", () => {
    document.querySelector(".quiz-box").classList.add("active");
    showQuestion(quiz.callQuestion());
    showNumber(quiz.questionIndex + 1, quiz.questions.length);
    startTimer(10);
    startLine();
});

// Next Button
document.querySelector(".next").addEventListener("click", () => {
    if (quiz.questions.length > quiz.questionIndex + 1) {
        clearInterval(counter);
        clearInterval(counterLine);
        quiz.questionIndex++;
        showQuestion(quiz.callQuestion());
        showNumber(quiz.questionIndex + 1, quiz.questions.length);
        startTimer(10);
        startLine();
    } else {
        clearInterval(counter);
        clearInterval(counterLine);
        document.querySelector(".quiz-box").classList.remove("active");
        document.querySelector(".score-box").classList.add("active");
        showScore(quiz.correctAnswers, quiz.questions.length);
    }
});

// Show Question
function showQuestion(question) {
    let question_text = `<span>${question.questionText}</span>`;
    let options = '';
    for (let answer in question.answers) {
        options += `<div class="option"><span><b>${answer}</b>: ${question.answers[answer]}</span></div>`;
    }
    document.querySelector(".question-text").innerHTML = question_text;
    option_list.innerHTML = options;
    const option = option_list.querySelectorAll(".option");
    for (let opt of option) opt.setAttribute("onclick", "optionSelected(this)");
}

// Option Selection
function optionSelected(option) {
    clearInterval(counter);
    clearInterval(counterLine);
    let answer = option.querySelector("span b").textContent;
    let question = quiz.callQuestion();
    if (question.checkAnswer(answer)) {
        option.classList.add("correct");
        quiz.correctAnswers++;
    } else {
        option.classList.add("incorrect");
    }
    for (let i = 0; i < option_list.children.length; i++)
        option_list.children[i].classList.add("disabled");
}

// Show Question Number
function showNumber(questionNumber, total) {
    document.querySelector(".badge").innerHTML = `<span>${questionNumber} / ${total}</span>`;
}

// Show Score
function showScore(correctAnswers, totalQuestions) {
    document.querySelector(".score-text").innerText = `You have ${correctAnswers} correct answers out of ${totalQuestions}`;
}

// Timer
let counter;
function startTimer(time) {
    counter = setInterval(() => {
        document.querySelector(".second").textContent = time;
        time--;
        if (time < 0) {
            clearInterval(counter);
            document.querySelector(".time-text").textContent = "Time Over";
            let answer = quiz.callQuestion().correctAnswer;
            for (let option of option_list.children) {
                if (option.querySelector("span b").textContent == answer)
                    option.classList.add("correct");
                option.classList.add("disabled");
            }
        }
    }, 1000);
}

// Timer Line
let counterLine;
function startLine() {
    let lineWidth = 0;
    counterLine = setInterval(() => {
        counterLineElement.style.width = lineWidth + "%";
        lineWidth += 0.181;
        if (lineWidth > 100.1) clearInterval(counterLine);
    }, 20);
}

// Replay / Quit
document.querySelector(".replay-btn").addEventListener("click", () => {
    quiz.questionIndex = 0;
    quiz.correctAnswers = 0;
    document.querySelector(".btn-start").click();
    document.querySelector(".score-box").classList.remove("active");
});

document.querySelector(".quit-btn").addEventListener("click", () => {
    window.location.reload();
});
