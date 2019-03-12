app.controller('indexController',['$scope','indexFactory','configFactory',($scope,indexFactory,configFactory)=>{
    
    $scope.messages=[];         // angularda index scope altında bu sekilde degisken tanımlanabiliyor.Ve bu indexte dolasılabiliyor.
    $scope.players={};

    $scope.init = () =>{                        //index.pug sayfa acıldıgında calısacak.index.pug içerisinde tanımlı dive ng-init="init()" ile bu kısmı tanımlıyoruz.
        const username = prompt('Please enter username');   //prompt ile kullanıcıdan isim alacagız.

        if(username)                    //eger prompta isim girilmiş ise initsocket fonks cagırarak kullanıcı adı  datasını socket.emit ile back ende gönderiyoruz.
            initSocket(username);
        else
            return false;
    };


    function scrollTop(){                         // Chat icin scrollbarın mesaj yazıldıkca asagıya kayması işlemi
        setTimeout(()=>{                          // Son Data geldikten sonra calısması için önce! Bind edilmeden scroll kaydırılmaya calısılırsa son data gözükmez.
            const element = document.getElementById('chat-area');
            element.scrollTop=element.scrollHeight;                 // Ikisi eşitlenirse sürekli asagıda kalacak.
        });
    };

    function showBubble(id,message){
        $('#'+id).find('.message').show().html(message);    // Oyuncuları ekranda olustururken socket idsini divlerine vermiştik o divleri bularak verilen mesajları içerisindeki message classına  basıyoruz.Jquerynin find methodu ile bularak.Display başta none oldugu için show methoduyla gösteriyoruz.

        setTimeout(()=>{
            $('#'+id).find('.message').hide();          //2sn sonra kaybolsun.
        },2000);
    }

    async function initSocket(username){

        const connectionOptions = {
            reconnectionAttempts:3,
            reconnectionDelay:600
        };
        
        try{

            const socketUrl = await configFactory.getConfig();

            const socket= await indexFactory.connectSocket(socketUrl.data.socketUrl,connectionOptions);  //fonksiyon cagrıldıktan sonra connect saglanırsa socket.on('connect') resolve dönüyor ve then ile burda yakalıyoruz..
                                                                //başarılı oldugunda thene düştügünde --> indexFactoryde promisela  gelen socket datasını alıyoruz.(await yapısında ise promise dönmeden alt satırlar işletilmeyecek)
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
                $scope.players[data.id]=data;       // yeni gelen kullanıcının da oyun alanında gözükmesi için
                $scope.$apply();

                scrollTop();

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
                delete $scope.players[data.id]; // kullanıcı ayrıldıktan sonra oyun alanından da silinmesi gerek.
                $scope.$apply();

                scrollTop();   

            });


            let animate = false;        //bir animasyon bitmeden öteki baslamaması için.
            $scope.onClickPlayer = ($event)=>{          // ui.stacked.segment.gameArea ya bu eventi atadık. Bu div alanı içersinde nereye tıklanırsa tıklansın angular herhangi bir event (click oldugunda) tetiklenecek 
                if(!animate){
                    let x=$event.offsetX;
                    let y=$event.offsetY;

                    socket.emit('animate',{x,y});  // Diger kullanıcıların da hareketten haberi olması için emit ile sunucu tarafına bu koordinatları gönderiyoruz.Sunucu tarafından da broadcast ve userid vererek diger kullanıcılara emitlencek.

                    animate =true;
                    $('#'+socket.id).animate({'left':x,'top':y},()=>{     //$('#'+socket.id)-->daha önceden idsine useridyi atadıgımız divi yani baglanan kullanıcıya ait yuvarlagı--> $event.offsetx ve y  ile koordinatını angular ile alıp animate ile hareket ettiriyoruz.
                        animate=false;
                    })
                }
            };

            socket.on('animateOtherUser',data=>{        //sunucudan gelen id ve güncel x y koordinatlarını animate emitiyle gönderdikten sonra sunucudan broadcast ederek burda yakalıyoruz ve diger kullanıcılarda da o userid ye denk gelen divi animate ile oynatıyoruz.
                
                $('#'+data.socketId).animate({'left':data.x,'top':data.y},()=>{     
                        animate=false;
                    })
                
            });

            /* CHAT SYSTEM */

            $scope.newMessage = ()=>{               // form submit oldugunda tetiklenen fonksiyon 

                let message = $scope.message;       // input içerisinde ng-model=message ile gelen texti message degiskeniyle alıyoruz.

                const messageData = {
                    type: {
                        code: 1 ,       // User or SERVER
                    },
                    username: username,     // initde promptan gelen username.
                    text : message
                };

                $scope.messages.push(messageData);
                $scope.message = '';                        //input clean

                socket.emit('newMessage',messageData);      // MessageDatayı sunucuya gonderdik tüm kullanıcılara iletmek için.

                showBubble(socket.id, message);             //Bubble Kullanıcının kendi UI gösterilmesi.

                scrollTop();                    //ScrollBar down when new message 
            };

            socket.on('newMessageUserToUsers',(data)=>{     // Broadcast emit ile gelen datayı karsılıyoruz.
                $scope.messages.push(data);
                $scope.$apply();
                showBubble(data.socketId,data.text);         // Bubble diger kullanıcıların UI gösterilmesi.
                scrollTop();                    //ScrollBar down when new message 
            });
        }catch(err){
            console.log(err);
        }
    }
}]);