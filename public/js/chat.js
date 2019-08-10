 const socket = io()

 //elements
 const $messageForm = document.querySelector('#form')
 const $messageFormInput = $messageForm.querySelector('input')
 const $messageFormButton = $messageForm.querySelector('button')
 const $sendLocationButton = document.querySelector('#send-location')
 const $messages = document.querySelector('#messages')


 //templates
 const messageTemplates = document.querySelector('#message-template').innerHTML
 const locationTemplates = document.querySelector('#location-template').innerHTML
 const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
 

 //Options
 const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    
}

socket.on('message', (message) => {
    console.log(message)       
    const html = Mustache.render(messageTemplates, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()

})


socket.on('locationMessage', (message) => {
     console.log(message)
     const html = Mustache.render(locationTemplates, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({ room, users }) => {
   const html = Mustache.render(sidebarTemplate, {
       room,
       users
   })
   document.querySelector('#sidebar').innerHTML = html
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

socket.emit('join', { username, room }, (error) => {
    if (error){
      alert(error)
      location.href = '/'
    }
})