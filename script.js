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
        Answer:0
    },

    {
        Question:"question_3 [string]",
        Choices:['question_3 A [string]','question_3 B [string]','question_3 C [string]','question_3 D [string]'],
        Answer:0
    },

    {
        Question:"question_4 [string]",
        Choices:['question_4 A [string]','question_4 B [string]','question_4 C [string]','question_4 D [string]'],
        Answer:0
    },

    {
        Question:"question_5 [string]",
        Choices:['question_5 A [string]','question_5 B [string]','question_5 C [string]','question_5 D [string]'],
        Answer:0
    },

    {
        Question:"question_6 [string]",
        Choices:['question_6 A [string]','question_6 B [string]','question_6 C [string]','question_6 D [string]'],
        Answer:0
    }
]

const previousResultPrompt = ['Well done, that was Correct!','Sorry, that was incorrect!']   // Last answer prompt
var timer = 30              // Total time (in second)
const timePenalty = -10      // Wrong answer time penalty
const scorePenalty = -2     // Wrong answer score penalty
const scoreGain = +1        // Correct answer score
const recordScoreToKeep = 5 // How many record do we want to keep when history is to be shown

//  Buttons
//  Buttons to trigger events
const startQuizBtn = document.getElementById("startQuizBtn")
const viewScoreBtn = document.getElementById("viewBoardBtn")
const backToMainBtn = document.getElementById("backToMainBtn")
const submitBtn = document.getElementById("submitName")
const userInitialInput = document.getElementById("initialInput")

// HTML elements whose contents need to be updated
const questionNumberEl = document.querySelector(".questionNumber")              // This question number
const questionContentEl = document.querySelector(".questionContent")            // This question content
const residualTimeDisplayContent = document.querySelector(".residualTime")      // timer content to be updated
const lastResultEl = document.querySelector(".lastResult")                      // how was the last question, was it correct or incorrect?
const thisResultBlockEl = document.querySelector('.thisResultBlock')            // My last result
const scoreHistoryEl = document.querySelector('.scoreHistory')                  // Score board list

//  Blocks to be displayed in DIFFERENT stages of quiz
const viewScoreBoardEl = document.querySelector('.viewScoreBoardBlock')
const quizIntroEl = document.querySelector('.quizIntroBlock')
const startButtonEl = document.querySelector('.startButtonBlock')
const countDownEl = document.querySelector(".countDownBlock")
const previousResultEl = document.querySelector(".previousResultBlock")
const questionBlockEl = document.querySelector(".questionBlock")
const answerBlockEl = document.querySelector('.answerBlock')
const historyDisplayBlockEl = document.querySelector('.historyDisplayBlock')
const backToMainEl = document.querySelector('.backToMainBlock')

// Items to be displayed in different stages
const allElementArr = [viewScoreBoardEl, quizIntroEl, startButtonEl, countDownEl, previousResultEl, questionBlockEl, answerBlockEl, thisResultBlockEl, historyDisplayBlockEl, backToMainEl]
// Break down list of elements to display in different stage of the quiz
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
// Last question result prompt - was the last question correct or not?
var lastQuestionResult
// Score
var score = 0
// Create a variable called recordList to append records
var recordList = JSON.parse(localStorage.getItem('record'));
//  What page is currently being displayed, it is
var thisDisplay = startDisplayElementArr
//  Previous result text area
var previousResultText = document.querySelector('.previousResultText')

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
        //add event listener to each button, when each button is triggered, execute checkAnswer function
        thisAnswerButton.addEventListener('click',checkAnswer)
        //put this answer button 
        thisAnswerListItem.append(thisAnswerButton)
        document.querySelector(".answerList").append(thisAnswerListItem)

    }
}

function startQuiz(event){

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

function interruptAndShowScore(event){

    //the key difference between this function and the displayHistory function is
    // that this function has to prevent default 
    event.preventDefault()

    // Let timer know that the quiz is interrupted
    timer = 'interrupted'

    //Display history
    displayHistory()
}

function interruptAndBackToMain(event){

    event.preventDefault()

    // Let timer know that the quiz is interrupted
    timer = 'interrupted'

    //Disable the previous content in the start screen
    disableEl(thisDisplay)

    //Update the list of elements to be displayed and enable the new contents
    thisDisplay=startDisplayElementArr
    enableEl(thisDisplay)

    window.location.reload();
}

function showResult(){

    //Disable the previous content in the start screen
    disableEl(thisDisplay)

    //Update the list of elements to be displayed and enable the new contents
    thisDisplay=resultPageDisplayElementArr
    enableEl(thisDisplay)

    //render this result
    lastResultEl.innerHTML = score

}

function checkAnswer(event){

    // prevent default
    event.preventDefault()

    // extract the answer from 
    var selectedAnswer = parseInt((event.target.getAttribute("data-answerkey")))
    
    // when answer is correct
    if (selectedAnswer === questionArray[currentQuestionIndex].Answer){
        //update score
        score += scoreGain
        // update previous result strip (didn't want to use window.alert)
        previousResultText.innerHTML = previousResultPrompt[0]
    }
    else{
        //update score
        score += scorePenalty
        //update timer
        timer += timePenalty
        // update previous result strip (didn't want to use window.alert)
        previousResultText.innerHTML = previousResultPrompt[1]
    }

    // update 
    currentQuestionIndex += 1

    // If this is the last question
    if (currentQuestionIndex === questionArray.length){
        showResult()
    }
    
    // If this is not the last question
    else {
        getQuestion(currentQuestionIndex)
    }

}

function initTimer(){
    
    var timerInterval = setInterval(function() {

        timer--;

        residualTimeDisplayContent.innerHTML = timer;
        
        //Once the timer runs out, either due to time loss or wrong answers, it will clear
        if(timer <= 0) {
            clearInterval(timerInterval);
            showResult();
        }

        //When the game is interrupted by button
        else if (timer ==='interrupted'){
            clearInterval(timerInterval);
        }

    }, 1000);
} 

function submitRecord(event){

    event.preventDefault()

    var thisName = userInitialInput.value.trim();

    // create a variable for the most recent result
    var lastRecord = {
        // variable defined in row 52
        thisName: thisName,
        thisScore: parseInt(score)  //Make sure this is saved as an INTEGER
    }

    // What is the last history in the local storage?
    // Row 91: var record = JSON.parse(localStorage.getItem('record'));
    // If the recordList has NEVER BEEN CREATED, then create a blank list to append items 
    if (!recordList){
        recordList=[]
    }
    // append this result to the score history list
    recordList.push(lastRecord);

    // sort the history in a DECENDING MANNER
    // max to min, comparing their "thisScore" attribute!!!
    recordList.sort(function(min, max) {
        return max.thisScore - min.thisScore;
    });

    // Only keep the last three records and update it
    recordList.splice(3)

    // update this last history to the local sotrage
    localStorage.setItem('record', JSON.stringify(recordList))

    //Disable the previous content in the start screen
    disableEl(thisDisplay)

    //Update the list of elements to be displayed and enable the new contents
    thisDisplay=scoreBoardDisplayElementArr
    enableEl(thisDisplay)

    //Display history
    displayHistory()
}

function displayHistory(){

    //Disable the previous content in the start screen
    disableEl(thisDisplay)

    //Update the list of elements to be displayed and enable the new contents
    thisDisplay = scoreBoardDisplayElementArr
    enableEl(thisDisplay)

    // If someone click the button without finishing one round of quiz, then we still need a blank list to make the next step work
    if (!recordList) {
        recordList = []
    };

    for (i in recordList) {
        var singleRecordEntry = document.createElement('li');
        singleRecordEntry.innerHTML = i + ' - ' + recordList[i].thisName + ' - ' + recordList[i].thisScore;
        scoreHistoryEl.appendChild(singleRecordEntry)
    }

}

// Button functions
// When the "Start Quiz" button is clicked, start the game
startQuizBtn.addEventListener('click', startQuiz)
// When the "View Score Board" button is clicked, start the game
viewScoreBtn.addEventListener('click', interruptAndShowScore)
// When the "Back to main" button is clicked, start the game
backToMainBtn.addEventListener('click', interruptAndBackToMain)
// submit button once we finish the quiz
submitBtn.addEventListener('click', submitRecord)

init()