var tape = require('tape'),
    dbUri = require('./index.js');

tape('parse simple uri', function(t) {
    t.deepEqual(dbUri.parse('example.com/db_name'), {
        uri: 'example.com/db_name',
        fullUri: 'example.com/db_name',
        host: 'example.com',
        database: 'db_name'
    });

    t.end();
});

tape('parse uri with all fields', function(t) {
    t.deepEqual(dbUri.parse('mysql://username:password@example.com:12345/db_name'), {
        uri: 'mysql://username:password@example.com:12345/db_name',
        fullUri: 'mysql://username:password@example.com:12345/db_name',
        protocol: 'mysql',
        host: 'example.com',
        port: 12345,
        username: 'username',
        password: 'password',
        database: 'db_name'
    });

    t.end();
});

tape('parse simple url setting defaults', function(t) {
    var defaults = {protocol: 'mysql', username: 'username', password: 'password', port: 12345};

    t.deepEqual(dbUri.parse('example.com/db_name', defaults), {
        uri: 'example.com/db_name',
        fullUri: 'mysql://username:password@example.com:12345/db_name',
        protocol: 'mysql',
        host: 'example.com',
        port: 12345,
        username: 'username',
        password: 'password',
        database: 'db_name'
    });

    t.end();
});

tape('stringify connection setting defaults', function(t) {
    var defaults = {protocol: 'mysql', username: 'username', password: 'password', port: 12345};

    var uri = dbUri.stringify({host: 'example.com', database: 'db_name'}, defaults);
    t.deepEqual(uri, 'mysql://username:password@example.com:12345/db_name');

    t.end();
});

tape('parse uri overriding default values', function(t) {
    var defaults = {protocol: 'mysql', username: 'username', password: 'password', port: 12345, database: 'db_name'};

    // simple usage wheere we can ensure the defaults are being set...
    t.deepEqual(dbUri.parse('example.com', defaults), {
        uri: 'example.com',
        fullUri: 'mysql://username:password@example.com:12345/db_name',
        protocol: 'mysql',
        host: 'example.com',
        port: 12345,
        username: 'username',
        password: 'password',
        database: 'db_name'
    });

    // same defaults are ignored when the uri has different values
    t.deepEqual(dbUri.parse('otheruser:otherpassword@example.com:44556/other_db', defaults), {
        uri: 'otheruser:otherpassword@example.com:44556/other_db',
        fullUri: 'mysql://otheruser:otherpassword@example.com:44556/other_db',
        protocol: 'mysql',
        host: 'example.com',
        port: 44556,
        username: 'otheruser',
        password: 'otherpassword',
        database: 'other_db'
    });

    t.end();
});

tape('encode/decode correctly special characters in credentials', function(t) {
    var decodedUsername = 'user-123fgd4)4?sdfg@dsfg',
        encodedUsername = 'user-123fgd4)4%3Fsdfg%40dsfg',
        decodedPassword = 'password-/asdf&234=dsg+45$',
        encodedPassword = 'password-%2Fasdf%26234%3Ddsg%2B45%24';

    // ensure encoded/decoded strings match each other..
    t.equals(decodedUsername, decodeURIComponent(encodedUsername));
    t.equals(decodedPassword, decodeURIComponent(encodedPassword));

    var uriToParse = 'mysql://'+encodedUsername+':'+encodedPassword+'@example.com/db_name';

    conn = dbUri.parse(uriToParse);
    t.deepEquals(conn, {
        uri: uriToParse,
        fullUri: uriToParse,
        protocol: 'mysql',
        username: decodedUsername,
        password: decodedPassword,
        host: 'example.com',
        database: 'db_name'
    });

    t.end();
});
