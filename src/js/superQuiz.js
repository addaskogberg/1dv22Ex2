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
  })
}
function question (nextURL) {
  const request1 = async () => {
    let response = await window.fetch(nextURL)
    let json = await response.json()
    console.log(json)
    let question = document.createElement('text')
    question.innerText = JSON.stringify(json.question)
    document.querySelector('#displayQuestion').appendChild(question)
    console.log(json.alternatives)
    console.log(json.nextURL)
    nextAnswer = json.nextURL
  }
  request1()
}
function answer () {
  let button = document.querySelector('#answerQuestion button')
  button.addEventListener('click', event => {
    let value = button.previousElementSibling.value
    console.log(value)

    var data = JSON.stringify({
      'answer': value
    })

    var xhr = new window.XMLHttpRequest()

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log('responseText: ' + this.responseText)
        var response = JSON.parse(this.responseText)
        console.log(response.nextURL)
        question(response.nextURL)
      }
    })

    xhr.open('POST', nextAnswer, true)
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    xhr.send(data)
  })
}
var nextAnswer = 'http://vhost3.lnu.se:20080/answer/1'

module.exports = {
  addUserName,
  checkDom,
  question,
  answer
}
