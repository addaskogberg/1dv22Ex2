function checkDom () {
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof (Storage) === 'undefined') {
      document.getElementById('playername').innerHTML = 'Sorry, your browser does not support Web Storage...'
    } else if (window.localStorage.getItem('value') !== null) {
      document.getElementById('playername').innerHTML = window.localStorage.getItem('value')
    } else {
      console.log('localStorage is null')
    }
    setHighScore()
    getHighScore()
  })
}

function startGame () {
  let button = document.querySelector('#startGame')
  button.addEventListener('click', event => {
    question('http://vhost3.lnu.se:20080/question/326')
    myTimer()
    setInterval(setTime, 1000)
  })
}

function addUserName () {
  let tag = document.querySelector('#player')
  let myHeadline = document.createElement('h2')
  myHeadline.innerText = 'The players name is:'
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
      document.getElementById('demo').innerHTML = timer + ' sekunder kvar'
      timer--
    } else if (timer === 0) {
      document.getElementById('demo').innerHTML = 'Tiden är ute'
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
        console.log('responseText: ' + this.responseText)
        var response = JSON.parse(this.responseText)
        console.log(response.nextURL)
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

async function gameOver () {
  await window.alert('game over')
  document.location.reload()
}
async function gameWin () {
  console.log(pad(pad(parseInt(totalSeconds / 60)) + totalSeconds % 60))
  let timeGameWin = pad(pad(parseInt(totalSeconds / 60)) + totalSeconds % 60)
  if (timeGameWin.length === 0) return
  window.localStorage.setItem('valueTime', timeGameWin)
  await window.alert('you win')
  document.location.reload()
}

function setHighScore (time) {
  let highscore = window.localStorage.getItem('highscore')
  let json = JSON.parse(highscore)
  let scores = []

  let i = 1
  let name = ''
  for (var property in json) {
    // console.log(json[property])
    if (i % 2 === 0) {
      scores.push([name, json[property]])
    } else {
      name = json[property]
    }
    i++
  }
  // console.log(scores)

  var player = window.localStorage.getItem('value') // document.getElementById('playername').innerHTML =
  var result = window.localStorage.getItem('valueTime')

  scores.push([player, result])
  console.log(scores)

  for (let score in scores) {
    console.log(scores[score])
  }

  var item = {'name': player, 'score': result}
  window.localStorage.setItem('highscore', JSON.stringify(item))
  /*
  var score = []
  score.push({name: player, time: result})
  if (score['highscore'] !== undefined) {
    score = JSON.parse(score['highscore'])
  } else {
    score = []
  }
  */
}

function getHighScore () {
  let highscore = window.localStorage.getItem('highscore')
  let json = JSON.parse(highscore)
  if (highscore !== null) {
    console.log(highscore)
    console.log(json)
    document.getElementById('highscore').innerHTML = ''

    let highscorestring = ''
    let i = 0
    for (var property in json) {
      console.log(json[property])
      if (i % 2 === 0) {
        highscorestring += json[property]
      } else {
        highscorestring += ' (' + json[property] + ')<br>'
      }
      i++
    }

    document.getElementById('highscore').innerHTML += highscorestring
  }
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
