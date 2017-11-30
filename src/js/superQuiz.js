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
    let myname = document.createElement('h2')
    myname.innerText = value
    window.localStorage.setItem('value', value)
    console.log('my webstorage value: ' + window.localStorage.getItem('value'))
    document.querySelector('#playername').appendChild(myname)
    event.stopPropagation()
  })
}

const request = async () => {
  const response = await window.fetch('http://vhost3.lnu.se:20080/question/1')
  const json = await response.json()
  console.log(json)
  let question = document.createElement('text')
  question.innerText = json
  document.querySelector('#displayQuestion').appendChild(question)
}

module.exports = {
  addUserName,
  checkDom,
  request
}
