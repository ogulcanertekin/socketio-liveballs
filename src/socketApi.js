const socketio = require('socket.io');

const io=socketio();

const socketApi={};

socketApi.io=io;        // sunucunun basladıgı bin www da kullanabilmek için socketio constructorunu/ www da attach işlemi gerceklestirmem gerekiyor.

const users = {};       // bir dizide tutmak yerine bu sekilde tutarsam socket idlerine karsılık kullanıcı datalarını key value seklinde tutabilirim.

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
        users[socket.id]= userData;       // users bir object oldugundan her yeni gelen kullanıcı idsini key olarak datasını da value olarak atıyoruz.
        
        socket.broadcast.emit('newUserJoined',users[socket.id]);      //Sunucudan cliente emit--> chat kısmında odaya katılan kişi ismini socket.on ile yukarda aldıktan sonra, diger kullanıcılara göstermek için.Angular indexController kısmında karsılıyoruz.

    });

    socket.on('disconnect',()=>{                            
        socket.broadcast.emit('disconnectUser',users[socket.id]);
        delete users[socket.id];            //Keye karsılık gelen useri aktif useerlardan cıkarıyoruz.
        console.log(users);
    });

});

module.exports = socketApi;