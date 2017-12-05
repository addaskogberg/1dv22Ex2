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

function startGame () {
  let button = document.querySelector('#startGame')
  button.addEventListener('click', event => {
    question('http://vhost3.lnu.se:20080/question/1')
    myTimer()
    setInterval(setTime, 1000)
  })
}

function question (nextURL) {
  timer = 19
  const request1 = async () => {
    let response = await window.fetch(nextURL)
    let json = await response.json()
   // console.log(json)
    let question = document.getElementById('displayQuestion')
    question.innerText = JSON.stringify(json.question)
    let alternative = document.getElementById('displayAlternative')
    // console.log(json.nextURL)
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

var minutesLabel = document.getElementById('minutes')
var secondsLabel = document.getElementById('seconds')
var totalSeconds = 0
function setTime () {
  ++totalSeconds
  secondsLabel.innerHTML = pad(totalSeconds % 60)
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60))
 // console.log(pad(totalSeconds % 60))
}

function pad (val) {
  var valString = val + ''
  if (valString.length < 2) {
    return '0' + valString
  } else {
    return valString
  }
}

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
       // console.log('responseText: ' + this.responseText)
        var response = JSON.parse(this.responseText)
        // console.log(response.nextURL)
        if (response.nextURL === undefined) {
          gameWin()
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
var nextAnswer = 'http://vhost3.lnu.se:20080/answer/1'

var win = false
async function gameOver () {
  if (!win) {
    await window.alert('game over')
    document.location.reload()
  }
}
async function gameWin () {
  console.log(pad(pad(parseInt(totalSeconds / 60)) + totalSeconds % 60))
  let timeGameWin = pad(pad(parseInt(totalSeconds / 60)) + totalSeconds % 60)
  if (timeGameWin.length === 0) return
  window.localStorage.setItem('valueTime', timeGameWin)
  await window.alert('you win')
  setHighScore()
  win = true
  document.location.reload()
}

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
  // window.localStorage.removeItem('highscore')
}

function getHighScore () {
  let highscore = window.localStorage.getItem('highscore')
  var highscoreList = ''
  if (highscore !== null) {
    let highscoreArray = highscore.split(',')
    var sorted = []
    var name = ''
    var i = 0
    for (var item in highscoreArray) {
      if (i % 2 === 0) {
        name = highscoreArray[item]
      } else {
        sorted.push([name, highscoreArray[item]])
        highscoreList += name + ' (' + highscoreArray[item] + ')<br>'
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
