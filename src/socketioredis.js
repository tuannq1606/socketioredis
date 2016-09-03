var config = require('./config.js');
var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var request = require('request');
var Redis = require('ioredis');

var redis = new Redis({
    port: config.redis.default.port,
    host: config.redis.default.host,
    password: config.redis.default.password
});

app.listen(config.app.port, function () {
    console.log('Server is running on Port ' + config.app.port + '!');
});

function handler(req, res) {
    res.writeHead(200);
    res.end('');
}

io.use(function (socket, next) {
    if (! config.auth.enabled) {
        return next();
    }

    if (! socket.handshake.query.Authorization) {
        return nextOnError(next, 'Token invalid');
    }

    var options = {
        url: config.auth.endpoint,
        headers: {
            Authorization: 'Bearer ' + socket.handshake.query.Authorization
        }
    };

    request.get(options, function (error, response, body) {
        if (error || response.statusCode != 200) {
            return nextOnError(next, body);
        }

        try {
            var identifier = JSON.parse(body);

            var identifierPath = config.auth.identifier_path.split('.');

            identifierPath.forEach(function (item) {
                identifier = identifier[item];
            });
            
            socket.userIdentifier = identifier; 

            return next();
        } catch (e) {
            return nextOnError(next, e);
        }
    });
});

io.on('connection', function (socket) {
    if (config.auth.enabled && socket.userIdentifier) {
        socket.join(privateChannelOfUser(socket.userIdentifier));

        console.log('User ' + socket.userIdentifier + ' connected');
    }
});

redis.psubscribe('*', function (err, count) {
    //
});

redis.on('pmessage', function (subscribed, channel, message) {
    console.log('Channel: ' + channel + ' - Message: ' + message);

    message = JSON.parse(message);

    io.emit(channel + ':' + message.event, message.data);
});

function nextOnError(next, e) {
    if (config.app.debug) {
        console.error(e);
    }

    next(new Error(e));
}

function privateChannelOfUser(identifier) {
    return 'user-' + identifier;
}
