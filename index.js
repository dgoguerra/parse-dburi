var trim = require('lodash/trim'),
    parseUrl = require('parse-url');

function stringifyConn(conn) {
    var uri = '';

    if (conn.protocol) {
        uri = conn.protocol+'://';
    }

    if (conn.username || conn.password) {
        if (conn.username) {
            uri += encodeURIComponent(conn.username);
        }

        if (conn.password) {
            uri += ':'+encodeURIComponent(conn.password);
        }

        uri += '@';
    }

    uri += conn.host;

    if (conn.port) {
        uri += ':'+conn.port;
    }

    uri += '/'+conn.database;

    return uri;
}

module.exports.stringify = stringifyConn;

function parseDbUri(uri, defaults) {
    defaults = defaults || {};

    // if there was a user and password, they will have been
    // extracted as a string separated by ':'
    function parseUserPassword(userStr) {
        var obj = {username: null, password: null};

        var arr = userStr && userStr.split(':');

        if (!arr || arr.length === 0) {
            return obj;
        }

        obj.username = decodeURIComponent(arr[0]);

        if (arr.length === 2) {
            obj.password = decodeURIComponent(arr[1]);
        }

        return obj;
    }

    var parsed = parseUrl(uri),
        user = parseUserPassword(parsed.user);

    // 'parse-url' sets the protocol to 'file' or 'ssh'
    // if none was found and the uri looks like its one
    // of those. don't let it do it
    if (parsed.protocol === 'ssh' || parsed.protocol === 'file') {
        parsed.protocol = '';
    }

    var conn = {
        uri: uri,
        host: parsed.resource
    };

    if (parsed.protocol || defaults.protocol) {
        conn.protocol = parsed.protocol || defaults.protocol;
    }

    if (parsed.port || defaults.port) {
        conn.port = parsed.port || defaults.port;
    }

    var database = trim(parsed.pathname, '/');
    if (database || defaults.database) {
        conn.database = database || defaults.database;
    }

    if (user.username || defaults.username) {
        conn.username = user.username || defaults.username;
    }

    if (user.password || defaults.password) {
        conn.password = user.password || defaults.password;
    }

    conn.fullUri = stringifyConn(conn);

    return conn;
}

module.exports.parse = parseDbUri;

function resolveDbUri(uri, defaults) {
    var conn = parseDbUri(uri, defaults);

    return conn.fullUri;
}

module.exports.resolve = resolveDbUri;
