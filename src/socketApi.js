const socketio = require('socket.io');

const io=socketio();

const socketApi={};

socketApi.io=io;        // sunucunun basladıgı bin www da kullanabilmek için socketio constructorunu/ www da attach işlemi gerceklestirmem gerekiyor.

io.on('connection',(socket)=>{          //herhangi bir connection eventi oldugunda tetiklenecek method.
    console.log('a user connected');
});

module.exports = socketApi;