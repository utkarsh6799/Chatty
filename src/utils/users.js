const users = []


const addUser = ({ id, username, room }) => {
   //clean the data
   username = username.trim().toLowerCase()
   room = room.trim().toLowerCase()

   //Validate the Data
   if (!username || !room) {
       return {
           error: 'Username and Room  are required'
       }

   }

   // Check for existing user
   const existingUser = users.find((user) => {
      return user.room === room && user.username === username
   })

   //Validate username
   if(existingUser) {
      return {
          error: 'Username in use!'
      }
   }

   

}