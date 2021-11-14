- [ORIGINAL] This stands for original requirement
- [ADDITIONAL] This stands for additional requirement that I personally regard necessary for a smooth user experience

# Table of Contents
    [Project title]
    [Task description]
    [User Story]
    [Acceptance Criteria]
    [Reference]
    [Repository structure]

# Project title
A multiple-choice quiz template

# Task description
- [ORIGINAL] Original task
This is a timed coding quiz with multiple-choice questions.
This app will run in the browser and will feature dynamically updated HTML and CSS powered by JavaScript code that is written.
It will have a clean, polished, and responsive user interface.

- [ADDITIONAL] Original task
This is a multiple-choice quiz, certain input can be updated from line 1 to line 46
It can potentially be modified for personal use on testing the knowledge of other questions.

# User Story
(Original) AS A coding boot camp student
I WANT to take a timed quiz on JavaScript fundamentals that stores high scores
SO THAT I can gauge my progress compared to my peers

# Acceptance Criteria

- [ORIGINAL] Start and render
GIVEN I am taking a code quiz
WHEN I click the start button
THEN a timer starts and I am presented with a question

- [ORIGINAL] Answer and render
WHEN I answer a question
THEN I am presented with another question

- [ORIGINAL] Condition and update global timer
WHEN I answer a question incorrectly
THEN time is subtracted from the clock

- [ORIGINAL] Condition and render
WHEN all questions are answered or the timer reaches 0
THEN the game is over

- [ORIGINAL] Input and local storage
WHEN the game is over
THEN I can save my initials and my score

- [ADDITIONAL] Interrupt and render
WHEN I want to view the score board
THEN I visualise it at ANY stage of this quiz (beginning, middle, end)

- [ADDITIONAL] Sorting score board
WHEN I view the score board
THEN I am presented with the top 3 scores

# Reference

The following picture has been taken as a reference (./assets/04-web-apis-homework-demo.gif)

# Repository structure

quiz-flash-card/assets/
    This is a sketch of four different phases of app interface. (./assets/taskDescription.md)

quiz-flash-card/Develop
    Javascript to functionalise the app (./script.js)
    CSS file to style the app (./style.css)