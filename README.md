# Socketioredis

## Installation

Socketioredis is a Redis pub/sub consumer using Socket.io library. To start a plain Node.js HTTP server listening on port `6001`:

    npm install
    cp .env.example .env
    node socketioredis.js
    
Use [pm2](https://github.com/Unitech/pm2) for deploying to production.

### In conjunction with AngularJS

Install [socket.io-client](https://github.com/socketio/socket.io-client) to your project.

Then, create a service for socket.io like the following:

```js
(function() {
    'use strict';

    angular
        .module('app.services')
        .factory('socketioService', socketioService);

    socketioService.$inject = ['$rootScope', '$localStorage'];

    function socketioService($rootScope, $localStorage) {
        var socket = io('http://localhost:6001', {query: "Authorization=" + $localStorage.token});

        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    }
})();
```

Include the `socketioService` in your controller, then binding by event:

```js
socketioService.on(channel, function () {
    // Your code is here
});
```

## License

Socketioredis is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).