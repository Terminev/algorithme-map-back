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
    socketIO.emit('dataRoomResponse', dataRoom)

    //Editer l'heure du rendez-vous
    socket.on('editRoom', (socket) => {
        dataRoom.map(room => {
            if (room.idRoom === socket.idRoom) {
                room.date = socket.date

            }
        })
        socketIO.emit('dataRoomResponse', dataRoom)
    })

    //Créer une room
    socket.on('createRoom', (socket) => {
        dataRoom.push({
            idRoom: socket.idRoom,
            nameRoom: socket.nameRoom,
            users: [],
            messages: [],
            appointment: null,
            date: socket.date,
        })
        socketIO.emit('dataRoomResponse', dataRoom)
    })

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
                        ],
                        messages: [],
                        appointment: null,
                        date: ""

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
                messages: [],
                appointment: null,
                date: "",
            })
        }
        socketIO.emit('dataRoomResponse', dataRoom)
    })

    // Ajouter l'adresse du restaurant a un utilisateur
    socket.on('setRestauPosition', (socket) => {
        dataRoom.map((room) => {
            if (room.idRoom === socket.idRoom) {
                room.users.map((user) => {
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
            }
        })
        //Return du tableau de données mis a jour
        socketIO.emit('dataRoomResponse', dataRoom)
    })

    //Permet d'ajouter le point de rendez-vous
    socket.on('setAppointment', (socket) => {
        dataRoom.map((room) => {
            if (room.idRoom === socket.idRoom) {
                room.appointment = socket.appointment
            }
        })
        console.log(dataRoom)
        socketIO.emit('dataRoomResponse', dataRoom)
    })

    //Permet de stocker les messages dans la room
    socket.on('sendMessage', (socket) => {
        console.log("dans le send message")
        dataRoom.map((room) => {

            if (room.idRoom === socket.idRoom) {
                console.log(room)
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