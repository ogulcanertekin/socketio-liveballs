const socketio = require('socket.io');

const io=socketio();

const socketApi={};

socketApi.io=io;        // sunucunun basladıgı bin www da kullanabilmek için socketio constructorunu/ www da attach işlemi gerceklestirmem gerekiyor.

const users = [];       //Baglanan her kullanıcı datalarını dizide tutmam gerekli.

io.on('connection',(socket)=>{          //herhangi bir connection eventi oldugunda tetiklenecek method.
    console.log('a user connected');

    socket.on('newUser',(data)=>{       //Client de (indexCntroller) prompt ile gelen emiti(data->username) karsıladık.
        const defaultData = {
            id: socket.id,
            position: {
                x:0,
                y:0
            }
        }

        const userData = Object.assign(data,defaultData);  //emitle gelen username datasını ve kullanıcı id ve position datalarını tek bir obje içinde birleştiriyoruz.
        users.push(userData);
        console.log(users);
    });

});

module.exports = socketApi;