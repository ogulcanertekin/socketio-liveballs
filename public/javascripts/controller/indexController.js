app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
    
    const connectionOptions = {
        reconnectionAttempts:3,
        reconnectionDelay:600
    };

    indexFactory.connectSocket('http://localhost:3000',connectionOptions)   //fonksiyon cagrıldıktan sonra connect saglanırsa socket.on('connect') resolve dönüyor ve then ile burda yakalıyoruz..
    .then((socket)=>{                                   //başarılı oldugunda thene düştügünde --> indexFactoryde promisela  gelen socket datasını alıyoruz.
        console.log('connect succesfull',socket);       //bağlantı yapan objeyi console a yazdırıyoruz.
    }).catch((err)=>{
        console.log(err);
    });

}]);