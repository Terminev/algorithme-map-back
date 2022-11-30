const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let dataRoom = []

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    // Créer une room et ajouter l'utilisateur
    socket.on('onJoin', (socket) => {
        let error = 0
        if(dataRoom.length > 0) {
            dataRoom.map((room) => {
                if (room.idRoom === socket.idRoom) {
                    room.users.push({
                        name: socket.nameUser,
                        positionUser: socket.positionUser,
                        positionRestau: socket.positionRestau,
                    })
                } else if (error === (dataRoom.length-1)) {
                    dataRoom.push({
                        idRoom: socket.idRoom,
                        nameRoom: socket.nameRoom,
                        users: [
                            {
                                name: socket.nameUser,
                                positionUser: socket.positionUser,
                                positionRestau: socket.positionRestau,
                            }
                        ]
                    })
                } else {
                    error++;
                }
            })
        }else {
            dataRoom.push({
                idRoom: socket.idRoom,
                nameRoom: socket.nameRoom,
                users: [
                    {
                        name: socket.nameUser,
                        positionUser: socket.positionUser,
                        positionRestau: socket.positionRestau,
                    }
                ],
                messages: []
            })
        }
        console.log(dataRoom)
        socketIO.emit('dataRoomResponse', dataRoom)
    })

    // Ajouter l'adresse du restaurant a un utilisateur
    socket.on('setRestauPosition', (socket) => {
        dataRoom.map((room) => {
            if (room.idRoom === socket.idRoom) {
                console.log("dans le if")
                room.users.map((user) => {
                    console.log(user.name)
                    console.log(socket.nameUser)
                    if (user.name === socket.nameUser) {
                        console.log("le user est trouvé")
                        console.log(user.positionRestau, socket.positionRestau)
                        user.positionRestau = socket.positionRestau
                    }
                })
            }
        })
        socketIO.emit('dataRoomResponse', dataRoom)
    })

    //Permet de remove l'utilisateur de la room
    socket.on('leaveRoom', (socket) => {
        dataRoom.map((room) => {
            if (room.idRoom === socket.idRoom) {
                console.log("la room est trouvé")
                room.users.map((user, index) => {
                    if (user.name === socket.nameUser) {
                        console.log("le user est trouvé")
                        room.users.splice(index, 1)
                    }
                })
            }else {
                console.log("la room n'est pas trouvé")
            }
        })
        //Return du tableau de données mis a jour
        console.log(dataRoom)
        socketIO.emit('dataRoomResponse', dataRoom)
    })

    socket.on('sendMessage', (socket) => {
        dataRoom.map((room) => {
            if (room.idRoom === socket.idRoom) {
                room.messages.push({
                    name: socket.nameUser,
                    message: socket.message
                })
            }
        })
        socketIO.emit('dataRoomResponse', dataRoom)
    })

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});


app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});