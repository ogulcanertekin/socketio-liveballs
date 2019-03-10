app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
    
    $scope.init = () =>{                        //index.pug sayfa acıldıgında calısacak.index.pug içerisinde tanımlı dive ng-init="init()" ile bu kısmı tanımlıyoruz.
        const username = prompt('Please enter username');   //prompt ile kullanıcıdan isim alacagız.

        if(username)                    //eger prompta isim girilmiş ise initsocket fonks cagırarak kullanıcı adı  datasını socket.emit ile back ende gönderiyoruz.
            initSocket(username);
        else
            return false;
    };


    function initSocket(username){

        const connectionOptions = {
            reconnectionAttempts:3,
            reconnectionDelay:600
        };
    
        indexFactory.connectSocket('http://localhost:3000',connectionOptions)   //fonksiyon cagrıldıktan sonra connect saglanırsa socket.on('connect') resolve dönüyor ve then ile burda yakalıyoruz..
        .then((socket)=>{                                   //başarılı oldugunda thene düştügünde --> indexFactoryde promisela  gelen socket datasını alıyoruz.
            socket.emit('newUser',{username:username})  //prompta girillen kullanıcı adını alarak newUser adlı emit ile back ende gönderiyoruz.   src içerisinde socketApi.js de karsılıyoruz.  
        }).catch((err)=>{
            console.log(err);
        });
    }
   

}]);