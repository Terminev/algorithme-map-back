const express = require('express');
const app = express();
const PORT = 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let dataRoom = []

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    //Listens and logs the message to the console
    socket.on('message', (data) => {
        // console.log(data)
        socketIO.emit('messageResponse', data);
    });



    socket.on('onJoin', (socket) => {
        console.log(socket)
        if(dataRoom.length > 0){
            dataRoom.map(data => {
            console.log(data)
            if(!data.includes(socket.idRoom)){
                dataRoom = [...data, {
                    id : socket.idRoom, 
                    name : socket.nameRoom, 
                    [
                        {
                            userName : ,
                            userPosition : ,
                            restauPosition : ,
                        }
                    ]
                }]
            
                console.log(dataRoom)
            }else{
                data = [
                    ...data,
                    [

                    ]
                ]
            }
        })
        }else{
                dataRoom = [[socket.idRoom, socket.nameRoom, []]]
                console.log(dataRoom, 'coucou')
        }
        
    })

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});

// Listing room


app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});