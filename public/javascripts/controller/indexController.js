app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
    
    $scope.messages=[];         // angularda index scope altında bu sekilde degisken tanımlanabiliyor.Ve bu indexte dolasılabiliyor.


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

                socket.on('newUserJoined',(data)=>{         // Sunucuya gönderilen kullanıcı adını diger kullanıcılara göndermek için sunucuda broadcast ile emitledikten sonra burda yakalayıyoruz ve diger kullanıcıların görmesini saglıyoruz.
                    const messageData ={
                        type: 0 ,                           // Sunucu tarafından gönderilen bir mesaj oldugunu belirtmek için type degiskeni olusturduk.Xlyte joined room.
                        username:data.username
                    }

                    $scope.messages.push(messageData);  // Angular scopeta tanımladıgımız messages arrayine bu mesajı atadık.
                    $scope.$apply();
                });
            }).catch((err)=>{
                console.log(err);
            });
    }
    
}]);