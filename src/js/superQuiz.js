/**
 * the logic for a quiz game.
 * @module src/superQuiz
 * @author Adda Skogberg
 * @version 1.0.0
 */

/**
 * When the browser is initiated.
 * If the browser suports local storage and local storage isn't empty
 * the name of the player is fetched and presented on the page.
 *
 */
function checkDom () {
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof (Storage) === 'undefined') {
      document.getElementById('playername').innerHTML = 'Sorry, your browser does not support Web Storage...'
    } else if (window.localStorage.getItem('value') !== null) {
      document.getElementById('playername').innerHTML = window.localStorage.getItem('value')
    } else {
      console.log('localStorage is null')
    }
  })
}
/**
 * Writes the player name from textbox to local storage at button click
 * and displays it on the page.
 *
 */
function addUserName () {
  let tag = document.querySelector('#player')
  let myHeadline = document.createElement('h2')
  myHeadline.innerText = 'Curently playing:'
  tag.appendChild(myHeadline)
  let button = document.querySelector('#player button')
  button.addEventListener('click', event => {
    let value = button.previousElementSibling.value
    if (value.length === 0) return
    window.localStorage.setItem('value', value)
    document.getElementById('playername').innerHTML = window.localStorage.getItem('value')
    event.stopPropagation()
    button.previousElementSibling.value = ''
  })
}

/**
 * starts the quiz on button click and calls function question inisiated with the first question URL
 * starts the timer by initiating function myTimer
 * starts an interval calling function setTime every second
 */
function startGame () {
  let button = document.querySelector('#startGame')
  button.addEventListener('click', event => {
    question('http://vhost3.lnu.se:20080/question/1')
    myTimer()
    setInterval(setTime, 1000)
  })
}

/**
 * gets the next question from the server and displays it on the page
 * and if there are alternatives in the question those are displayed
 * @param {any} nextURL
 */
function question (nextURL) {
  timer = 19
  const request1 = async () => {
    let response = await window.fetch(nextURL)
    let json = await response.json()
    let question = document.getElementById('displayQuestion')
    question.innerText = JSON.stringify(json.question)
    let alternative = document.getElementById('displayAlternative')
    nextAnswer = json.nextURL
    if (json.alternatives !== undefined) {
      alternative.innerText = ''
      for (var property in json.alternatives) {
        alternative.innerText += property + ' = ' + json.alternatives[property] + '\n'
      }
    } else {
      alternative.innerText = ''
    }
  }
  request1()
}

/**
 * gives the player 20 seconds to answer the question and ends the game if it's not
 *
 */
var timer = 19
function myTimer () {
  setInterval(function () {
    if (timer > 0) {
      document.getElementById('demo').innerHTML = timer + ' Seconds remaining'
      timer--
    } else if (timer === 0) {
      document.getElementById('demo').innerHTML = 'Time ended'
      document.getElementById('answerButton').disabled = true
      timer--
    } else {
      gameOver()
    }
  }, 1000)
}

/**
 * gets the total time for the game during quiz
 */
var minutesLabel = document.getElementById('minutes')
var secondsLabel = document.getElementById('seconds')
var totalSeconds = 0
function setTime () {
  ++totalSeconds
  secondsLabel.innerHTML = pad(totalSeconds % 60)
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60))
}

function pad (val) {
  var valString = val + ''
  if (valString.length < 2) {
    return '0' + valString
  } else {
    return valString
  }
}

/**
 * takes the answer from the input field and posts it to the server
 * when the server responds with a new URL it is passed to question
 * if the server doesn't respond with a URL the, game is won by player
 * or answer is wrong, and the game ends
 */
var nextAnswer = 'http://vhost3.lnu.se:20080/answer/1'
function answer () {
  let button = document.querySelector('#answerQuestion button')
  button.addEventListener('click', event => {
    let value = button.previousElementSibling.value
    if (value.length === 0) return
    console.log(value)
    button.previousElementSibling.value = ''
    var data = JSON.stringify({
      'answer': value
    })

    var xhr = new window.XMLHttpRequest()
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        var response = JSON.parse(this.responseText)
        if (response.nextURL === undefined) {
          if (response.message === 'Correct answer!') {
            gameWin()
          } else {
            gameOver()
          }
        } else {
          question(response.nextURL)
        }
      }
    })

    xhr.open('POST', nextAnswer, true)
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    xhr.send(data)
  })
}

/**
 * if player fails ends the game with an alert and reloads the page
 */
var win = false
async function gameOver () {
  if (!win) {
    await window.alert('game over')
    document.location.reload()
  }
}

/**
 * if player wins alerts the player collects the time for highscore and initiates the highscore
 * and reloads the page
 */
async function gameWin () {
 // let timeGameWin = pad(pad(parseInt(totalSeconds / 60)) + '.' + totalSeconds % 60)
  // if (timeGameWin.length === 0) return
  window.localStorage.setItem('valueTime', totalSeconds)
  await window.alert('you win')
  setHighScore()
  win = true
  document.location.reload()
}

/**
 *collects the time for highscore and the player name places it in a highscore array in local storage
 * sorts the player score decending
 *
 */
function setHighScore () {
  let highscore = window.localStorage.getItem('highscore')
  console.log(highscore)
  var sorted = []
  if (highscore !== null) {
    let highscoreArray = highscore.split(',')
    var name = ''
    var i = 0
    for (var item in highscoreArray) {
      if (i % 2 === 0) {
        name = highscoreArray[item]
      } else {
        sorted.push([name, highscoreArray[item]])
      }
      i++
    }
  }
  var player = window.localStorage.getItem('value')
  var result = window.localStorage.getItem('valueTime')
  sorted.push([player, result])

  sorted.sort(function (a, b) {
    return a[1] - b[1]
  })

  console.log(sorted)
  var stored = sorted.slice(0, 5)
  window.localStorage.setItem('highscore', stored)
  // window.localStorage.removeItem('highscore') // clears the local storage
}

/**
 * collects the array in local storage and converts it to something printable
 * and displayes the updated list on the page
 */
function getHighScore () {
  let highscore = window.localStorage.getItem('highscore')
  var highscoreList = ''
  if (highscore !== null) {
    let highscoreArray = highscore.split(',')
    var name = ''
    var i = 0
    for (var item in highscoreArray) {
      if (i % 2 === 0) {
        name = highscoreArray[item]
      } else {
        let seconds = pad(highscoreArray[item] % 60)
        let minutes = pad(parseInt(highscoreArray[item] / 60))
        highscoreList += name + ' (' + minutes + ':' + seconds + ')<br>'
        // highscoreList += name + ' (' + highscoreArray[item] + ')<br>'
      }
      i++
    }
  }
  document.getElementById('highscore').innerHTML = highscoreList
}

module.exports = {
  addUserName,
  checkDom,
  question,
  answer,
  setTime,
  myTimer,
  startGame,
  setHighScore,
  getHighScore
}
