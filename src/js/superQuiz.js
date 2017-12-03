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
  myHeadline.innerText = 'This is the player name'
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

function countDown () {
  var i = 20
  setInterval(function () {
    if (i > 0) {
      document.getElementById('demo').innerHTML = i + ' sekunder kvar'
      i--
    } else {
      document.getElementById('demo').innerHTML = 'tiden är ute'
      document.getElementById('answerButton').disabled = true
    }
  }, 1000)
}

var minutesLabel = document.getElementById('minutes')
var secondsLabel = document.getElementById('seconds')
var totalSeconds = 0
setInterval(setTime, 1000)

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

function answer () {
  let button = document.querySelector('#answerQuestion button')
  button.addEventListener('click', event => {
    countDown()
    let value = button.previousElementSibling.value
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
          gameOver()
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
  let confirmAnswer = await window.confirm('game over, start again?')
  if (confirmAnswer) {
    document.location.reload()
  }
}
module.exports = {
  addUserName,
  checkDom,
  question,
  answer,
  countDown,
  setTime
}
