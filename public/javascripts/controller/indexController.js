app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
    
    $scope.messages=[];         // angularda index scope altında bu sekilde degisken tanımlanabiliyor.Ve bu indexte dolasılabiliyor.
    $scope.players={};

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

                socket.on('initPlayers',(players)=>{        // o an online olan kullanıcıları socketApi da users ile tutuyorduk ve buraya emit ile gönderiyoruz.
                    $scope.players=players;
                    $scope.$apply();
                });

                socket.on('newUserJoined',(data)=>{         // Sunucuya gönderilen kullanıcı adını diger kullanıcılara göndermek için sunucuda broadcast ile emitledikten sonra burda yakalayıyoruz ve diger kullanıcıların görmesini saglıyoruz.
                    const messageData = {
                        type: {
                            code: 0 ,   // Server or User Message
                            status:1    // Login or Disconnect
                        },
                        username: data.username
                    };

                    $scope.messages.push(messageData);      // Angular scopeta tanımladıgımız messages arrayine bu mesajı atadık.
                    $scope.$apply();
                });

                socket.on('disconnectUser',(data)=>{        
                    const messageData = {
                        type: {
                            code: 0 ,
                            status:0
                        },
                        username: data.username
                    };
                    $scope.messages.push(messageData);
                    $scope.$apply();
                });

                let animate = false;        //bir animasyon bitmeden öteki baslamaması için.
                $scope.onClickPlayer = ($event)=>{          // ui.stacked.segment.gameArea ya bu eventi atadık. Bu div alanı içersinde nereye tıklanırsa tıklansın angular herhangi bir event (click oldugunda) tetiklenecek 
                    if(!animate){
                        animate =true;
                        $('#'+socket.id).animate({'left':$event.offsetX,'top':$event.offsetY},()=>{     //daha önceden idsine useridyi atadıgımız divi $event.offsetx ile koordinatını angular ile alıp animate ile hareket ettiriyoruz.
                            animate=false;
                        })
                    }
                };

            }).catch((err)=>{
                console.log(err);
            });
    }

}]);