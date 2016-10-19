# stella

### Packages:
nodemon : development efficiency

ngStorage : clean session management in angular for user name and session

body-parser : handling parsing of data received from client

passport, passport-local, express ,express-session : session handling

mocha chai chai-as-promised bluebird : my preferred testing environment     

### Design Decisions

I am using passport and session to generate a unique id for generating a user's avatar.  That way you can have two 'bill's in a chat room and tell them apart by the avatar.  You can't set your avatar so you can't impersonate someone.

downsides:  if the server goes down, you have to re-login and lose your avatar.  And you lose track of your posts on the left side if you log out and back in.  This would be solved with a real user management.

### Areas for future improvement
Full user management

Store gifs from avatar on my local server
