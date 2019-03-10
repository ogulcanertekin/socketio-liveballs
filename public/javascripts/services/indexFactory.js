app.factory('indexFactory',[()=>{
    const connectSocket = (url,options)=>{
        return new Promise((resolve,reject)=>{
            const socket=io.connect(url,options);

            socket.on('connect',()=>{       // Connect başarılı oldugunda resolve ile datayı döndürüyor ve indexController da then ile yakalıyoruz.
                resolve(socket);
            });

            socket.on('connect_error',()=>{
                reject(new Error('connect_error'));
            });
        });
    };

    return {
        connectSocket
    }

}]);