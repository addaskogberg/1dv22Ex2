
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
    })
  }

  module.exports = {
    addUserName
  }
