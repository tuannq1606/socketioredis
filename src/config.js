require('dotenv').config('../.env');

/*
 |----------------------------------------------------------------
 | Master Configuration
 |----------------------------------------------------------------
 |
 */

var config = {

    app: {

        /*
        |--------------------------------------------------------------------------
        | Socket Server Environment
        |--------------------------------------------------------------------------
        |
        | This value determines the "environment" your socket server is currently
        | running in. This may determine how you prefer to configure various
        | services your socket server utilizes. Set this in your ".env" file.
        |
        */

        env: env('APP_ENV', 'production'), 

        /*
        |--------------------------------------------------------------------------
        | Socket Server Debug Mode
        |--------------------------------------------------------------------------
        |
        */

        debug: env('APP_DEBUG', false), 

        /*
        |--------------------------------------------------------------------------
        | Socket Server Port
        |--------------------------------------------------------------------------
        |
        | This value determines which port your socket server is running on.
        |
        */

        port: env('APP_PORT', 6001), 

    },

    /*
    |--------------------------------------------------------------------------
    | Redis Databases for Broadcaster
    |--------------------------------------------------------------------------
    |
    */

    redis: {
        cluster: false,

        default: {
            host     : env('REDIS_HOST', 'localhost'), 
            password : env('REDIS_PASSWORD', null),
            port     : env('REDIS_PORT', 6379), 
            database : 0
        }
    },

    auth: {

        /*
        |--------------------------------------------------------------------------
        | Authentication Enabled
        |--------------------------------------------------------------------------
        |
        | This option determines your socket server to authenticate users or not 
        | and allow authenticated users to subscribe their private channels.
        |
        */

        enabled: env('AUTH_ENABLED', false), 

        /*
        |--------------------------------------------------------------------------
        | Authentication Endpoint
        |--------------------------------------------------------------------------
        |
        */
        endpoint: env('AUTH_ENDPOINT'),

        /*
        |--------------------------------------------------------------------------
        | User identifier path
        |--------------------------------------------------------------------------
        |
        | Specify a unique property path of the user that will specify user's 
        | private channel.
        |
        */
        identifier_path: 'data.id'

    }

};

/**
 * Gets the value of an environment variable. Supports boolean, empty and null.
 * 
 * @param  string  key
 * @param  mixed   defaultValue
 * @return mixed
 */
function env(key, defaultValue) {
    var value = process.env[key];

    if (typeof value === 'undefined') {
        return (typeof defaultValue === 'undefined') ? '' : defaultValue;
    }

    switch (value.toLowerCase()) {
        case 'true':
        case '(true)':
            return true;

        case 'false':
        case '(false)':
            return false;

        case 'empty':
        case '(empty)':
            return '';

        case 'null':
        case '(null)':
            return null;
    }
    
    if (value.length > 1 && value.startsWith('"') && value.endsWith('"')) {
        return value.substring(1, value.length - 1);
    }

    return value;
}

module.exports = config;
