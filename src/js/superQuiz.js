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

const request1 = async () => {
  const response = await window.fetch('http://vhost3.lnu.se:20080/question/1')
  const json = await response.json()
  console.log(json)
  let question = document.createElement('text')
  question.innerText = JSON.stringify(json.question)
  document.querySelector('#displayQuestion').appendChild(question)
}

function answer () {
  let button = document.querySelector('#answerQuestion button')
  button.addEventListener('click', event => {
    let value = document.querySelector('#response')
    console.log(value)
    var data = JSON.stringify({
      'answer': value
    })
    var xhr = new window.XMLHttpRequest()
    xhr.withCredentials = true

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log(this.responseText)
      }
    })

    xhr.open('POST', 'http://vhost3.lnu.se:20080/answer/1')
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.setRequestHeader('cache-control', 'no-cache')
   // xhr.setRequestHeader('postman-token', 'b498db15-f77c-3639-f373-6920d69321d9')
    xhr.setrequestheader('access - control - allow - origin', '*')

    xhr.send(data)

 /*  let button = document.querySelector('#answerQuestion button')
  button.addEventListener('click', event => {
    let req = new window.XMLHttpRequest()
    req.addEventListener('load', function () {
      console.log(req.responseText)
    })
    let value = 'button.previousElementSibling.value'
   // let value = '#response'
    console.log(value)
    let request = {
      url: 'http://vhost3.lnu.se:20080/answer/1',
      method: 'POSTT',
      json: {
        'answer': value
      }
    }

    req.open('POST', request)
    req.send()
    // req.load()
  }) */
  })
}

module.exports = {
  addUserName,
  checkDom,
  request1,
  answer
}
