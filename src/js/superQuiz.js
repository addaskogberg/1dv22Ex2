
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
      document.querySelector('#playername').appendChild(myname)
      event.stopPropagation()
      SetValue()
    })
  }

  if (typeof (Storage) === 'undefined') {
    document.getElementById('value').innerHTML = 'Sorry, your browser does not support Web Storage...'
  } else if (window.localStorage.getItem('value') !== null) {
    document.getElementById('value').innerHTML = window.localStorage.getItem('value')
  } else {
    console.log('localStorage is null')
  }

  function SetValue () {
    window.localStorage.setItem('value', document.getElementById('nameinput').value)
    document.getElementById('result').innerHTML = window.localStorage.getItem('value')
  }

  /* function displayQuestion () {
    var url = 'http://vhost3.lnu.se:20080/question/1'
    var question

    window.fetch(url)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data)
      question = data
      setUpData()
    })

    function setUpData () {
     // var headlineElement = document.querySelector('#headline')
      // headline.textContent = animal.species

      var textElement = document.querySelector('#image')
      textElement.src = question.Url
    }

    function updateQuestionUrlData (newUrl) {
      var copyOfQuestion = Object.assign({}, question)
      copyOfQuestion.Url = newUrl

      var headers = new Headers({
        'Content-Type': 'application/json ; charset=utf-8'
      })

      var fetchData = {
        method: 'PUT',
        body: JSON.stringify(copyOfQuestion),
        headers: headers
      }

      window.fetch(url, fetchData)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        question = data
        setUpData()
      })
    }
  } */

  module.exports = {
    addUserName
    // displayQuestion
  }
