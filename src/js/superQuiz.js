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

const request = async () => {
  const response = await window.fetch('http://vhost3.lnu.se:20080/question/1')
  const json = await response.json()
  console.log(json)
  let question = document.createElement('text')
  question.innerText = JSON.stringify(json)
  document.querySelector('#displayQuestion').appendChild(question)
}

function answer () {

}

module.exports = {
  addUserName,
  checkDom,
  request,
  answer
}
