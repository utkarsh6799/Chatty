 const socket = io()

 //elements
 const $messageForm = document.querySelector('#form')
 const $messageFormInput = $messageForm.querySelector('input')
 const $messageFormButton = $messageForm.querySelector('button')
 const $sendLocationButton = document.querySelector('#send-location')

socket.on('message', (message) => {
    console.log(message)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

     $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (message) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        console.log('The message was delivered', message)
    })
})

     $sendLocationButton.addEventListener('click', () => {

      if(!navigator.geolocation) {
            return alert('Geolocation is not supported by your browser')
      }
     
      $sendLocationButton.setAttribute('disabled', 'disabled')

      navigator.geolocation.getCurrentPosition((position) => {
           socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (message) => {

        $sendLocationButton.removeAttribute('disabled')    
        console.log('location shared!')
        })
      })
})