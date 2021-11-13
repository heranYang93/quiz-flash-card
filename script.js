//  Preset set-ups
//  specific to the quiz
const questionArray =[ 
    {
        Question:"question_1 [string]",
        Choices:['question_1 A [string]','question_1 B [string]','question_1 C [string]','question_1 D [string]'],
        Answer:0
    },

    {
        Question:"question_2 [string]",
        Choices:['question_2 A [string]','question_2 B [string]','question_2 C [string]','question_2 D [string]'],
        Answer:3
    },

    {
        Question:"question_3 [string]",
        Choices:['question_3 A [string]','question_3 B [string]','question_3 C [string]','question_3 D [string]'],
        Answer:2
    },

    {
        Question:"question_4 [string]",
        Choices:['question_4 A [string]','question_4 B [string]','question_4 C [string]','question_4 D [string]'],
        Answer:3
    },

    {
        Question:"question_5 [string]",
        Choices:['question_5 A [string]','question_5 B [string]','question_5 C [string]','question_5 D [string]'],
        Answer:2
    },

    {
        Question:"question_6 [string]",
        Choices:['question_6 A [string]','question_6 B [string]','question_6 C [string]','question_6 D [string]'],
        Answer:3
    }
]
const previousResultPrompt = ['That is correct!','Wrong anwser!']   // Last answer prompt
const totalTime=60          // Total time
const timePenalty=-10       // Wrong answer time penalty
const scorePenalty=-2       // Wrong answer score penalty
const scoreGain=+5          // Correct answer score

//  Buttons
    //  Buttons to trigger events
const startQuizBtn = document.getElementById("startQuizBtn")
const viewScoreBtn = document.getElementById("viewBoardBtn")
const backToMainBtn = document.getElementById("backToMainBtn")

//     //  Buttons for answers  (this to be created dynamically)
// const answer0Btn = document.getElementById("#answerA")
// const answer1Btn = document.getElementById("#answerB")
// const answer2Btn = document.getElementById("#answerC")
// const answer3Btn = document.getElementById("#answerD")

// HTML elements whose contents need to be updated
const questionNumberEl = document.querySelector(".questionNumber")              // This question number
const questionContentEl = document.querySelector(".questionContent")            // This question content
const residualTimeDisplayContent = document.querySelector(".residualTime")      // timer content to be updated

//  Blocks to be displayed in DIFFERENT stages of quiz
const viewScoreBoardEl = document.querySelector('.viewScoreBoardBlock')
const quizIntroEl = document.querySelector('.quizIntroBlock')
const startButtonEl = document.querySelector('.startButtonBlock')
const countDownEl = document.querySelector(".countDownBlock")
const previousResultEl = document.querySelector(".previousResultBlock")
const questionBlockEl = document.querySelector(".questionBlock")
const answerBlockEl = document.querySelector('.answerBlock')
const thisResultBlockEl = document.querySelector('.thisResultBlock')
const historyDisplayBlockEl = document.querySelector('.historyDisplayBlock')
const backToMainEl = document.querySelector('.backToMainBlock')

// Items to be displayed in different stages
const allElementArr = [viewScoreBoardEl, quizIntroEl, startButtonEl, countDownEl, previousResultEl, questionBlockEl, answerBlockEl, thisResultBlockEl, historyDisplayBlockEl, backToMainEl]

const startDisplayElementArr = [viewScoreBoardEl, quizIntroEl, startButtonEl]
const inQuizDisplayElementArr = [viewScoreBoardEl, countDownEl, previousResultEl, questionBlockEl, answerBlockEl, backToMainEl]
const resultPageDisplayElementArr = [viewScoreBoardEl,thisResultBlockEl,backToMainEl]
const scoreBoardDisplayElementArr = [historyDisplayBlockEl,backToMainEl]

//Variables for functionality and display
//  Display stage, which stage is being displayed
//  Three options: 'start' 'inQuiz' 'result'
var currentDisplayStage = 'start'
//  Current question, which question is currently being displayed?
var currentQuestionIndex = 0
// Timer - how many seconds left
var countDown = totalTime   
// Last question result prompt - was the last question correct or not?
var lastQuestionResult
// Score
var score
// Result by question, 1 is correct, 0 is wrong, this list is to be used to display the last round of quiz
var scoreHistory = []
// Update the score to the local storage
localStorage.setItem('scoreHistory',scoreHistory)
//  What page is currently being displayed, it is
var thisDisplay = startDisplayElementArr

// Button functions
// When the "Start Quiz" button is clicked, start the game
startQuizBtn.addEventListener("click", startQuiz)
// When the "View Score Board" button is clicked, start the game
viewScoreBtn.addEventListener('click', interruptAndShowScore)
// When the "Back to main" button is clicked, start the game
backToMainBtn.addEventListener('click', interruptAndBackToMain)
// When an answer button is clicked, 


function init(){
    for (i in allElementArr) {
        if (! thisDisplay.includes(allElementArr[i])){
            allElementArr[i].style.display="none"
        }
    }
}

function disableEl(thisDisplay){
    // input a list of items that you want to 
    for (i in allElementArr) {
        if (thisDisplay.includes(allElementArr[i])){
            allElementArr[i].style.display="none"
        }
    }
}

function enableEl(thisDisplay){
    for (i in allElementArr) {
        if (thisDisplay.includes(allElementArr[i])){
            allElementArr[i].style.display="block"
        }
    }
}

function getQuestion(questionId){
    //Clear the old data
    document.querySelector(".answerList").innerHTML=''

    //Extract question
    var qId = questionId + 1
    var qContent = questionArray[questionId].Question
    var qChoicesArray = questionArray[questionId].Choices
    var qAnswer = questionArray[questionId].Answer

    //Render content and choices
    questionNumberEl.innerHTML = qId
    questionContentEl.innerHTML = qContent
    
    for (i in qChoicesArray){
        //create a list item li
        var thisAnswerListItem = document.createElement('li');
        // create a button within the list item button
        var thisAnswerButton = document.createElement('button');
        // put answer into each button
        thisAnswerButton.innerHTML = qChoicesArray[i]
        // put a answer key to each button so that each button has a number to compare the result
        thisAnswerButton.setAttribute('data-answerKey',i)
        //asign a class called 'singleAnswerBtn' to each class
        thisAnswerButton.setAttribute('class','singleAnswerBtn')
        //put this answer button 
        thisAnswerListItem.append(thisAnswerButton)
        document.querySelector(".answerList").append(thisAnswerListItem)
    }
}

//timer function should be revised 
function initTimer() {

    countDown = totalTime

    // Sets interval in a variable called timer its interval is set as 1000ms
    var timer = setInterval(function() {

        countDown--;
        residualTimeDisplayContent.innerHTML = countDown;
  
        if (countDown == 0) {
            clearInterval(timer)
            showResult()
        }
    }, 1000);
  }

function startQuiz(event) {

    event.preventDefault()

    //Disable the previous content in the start screen
    disableEl(thisDisplay)

    //Update the list of elements to be displayed and enable the new contents
    thisDisplay=inQuizDisplayElementArr
    enableEl(thisDisplay)

    // Reset question
    currentQuestionIndex=0

    //Get next question question
    getQuestion(currentQuestionIndex)

    //Initiate timer
    initTimer()
}

function interruptAndShowScore (event) {

    event.preventDefault()

    //Disable the previous content in the start screen
    disableEl(thisDisplay)

    //Update the list of elements to be displayed and enable the new contents
    thisDisplay=scoreBoardDisplayElementArr
    enableEl(thisDisplay)

    //Display history
    displayHistory()
}

function interruptAndBackToMain(event){

    event.preventDefault()

    //Disable the previous content in the start screen
    disableEl(thisDisplay)

    //Update the list of elements to be displayed and enable the new contents
    thisDisplay=startDisplayElementArr
    enableEl(thisDisplay)
    
}

function showResult(){
    //Disable the previous content in the start screen
    disableEl(thisDisplay)

    //Update the list of elements to be displayed and enable the new contents
    thisDisplay=resultPageDisplayElementArr
    enableEl(thisDisplay)
}

function answerBtn(event){
    
}

init()

// //text to add
// startQuizEl.addEventListener('click',function startGame(){
//     //display
//     startQuizEl.setAttribute('class','hide')
//     startQuizEl.removeAttribute('class','hide')

//     getQuestion()
//     startTimer()
    
// }
// )

// function getQuestion(){
//     questionNumberEl.textContent = 
//     questionContentEl.textContent = questionArray[currentQuestionIndex].Question
    
//     var buttonAreaEl=document.createElement('button')
//     buttonAreaEl.innerHTML=''
    
//     //var questionChoices=questionArray[currentQuestionIndex].Choices

//     for (var i=0; i<questionArray[currentQuestionIndex].Choices.length;i++){
//         //create a differnet vriabl
//         var thisButton=document.createElement('button')
//         thisButton.setAttribute('class','answer')
//         thisButton.innerHTML=questionArray[currentQuestionIndex].Choices[i]
//         buttonAreaEl.appendChild(thisButton)
//         thisButton.onclick=checkAnser
//     }
// }

// function checkAnswer(){
//     if (this.textContent === questionArray[currentQuestionIndex].Answer){
//         alert('correct')
//         score+=1
//         console.log('score',score)
//     }
//     else{
//         alert('incorrect')
//         incorrectScore+=1
//         //time penalty
        
//         console.log('incorrectScore',incorrectScore)
//     }

//     currentQuestionIndex++

//     if (currentQuestionIndex===questionArray.length){
//         endGame()
//     }
//     else {
//         getQuestion()
//     }

// }

// function startTimer(){
//     var timeInterval=setInterval(function(){
//         time--
//         timerEl.textContent='You have '+time+' seconds left'

//         if (time===0){
            
//             timerEl.textContent='Game Ends'
//             clearInterval(timeInterval)
//             endGame()
//         }

//     }
//     ,1000)

//     if (this.textContent !== questionArray[currentQuestionIndex].Answer){
//         time-=10
//     }
// }
