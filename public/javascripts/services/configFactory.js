app.factory('configFactory',['$http',($http)=>{         // http call
    const getConfig = ()=>{
        return new Promise((resolve,reject)=>{
            $http
            .get('/getEnv')
            .then((data)=>{                             //routes-->index.js --> /getEnv den product-develop ortamlarından hangisinde isem ona göre farklı datayı dönecek
                resolve(data);                          
            })
            .catch((err)=>{
                reject(err);
            })
        });
    };

    return {
        getConfig
    }

}]);