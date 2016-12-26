var trim = require('lodash/trim'),
    parseUrl = require('parse-url');

function stringifyConn(conn, defaults) {
    defaults = defaults || {};

    // try to fill with default values any missing properties
    var protocol = conn.protocol || defaults.protocol,
        username = conn.username || defaults.username,
        password = conn.password || defaults.password,
        database = conn.database || defaults.database,
        port = conn.port || defaults.port;

    var uri = '';

    if (protocol) {
        uri = protocol+'://';
    }

    if (username || password) {
        if (username) {
            uri += encodeURIComponent(username);
        }

        if (password) {
            uri += ':'+encodeURIComponent(password);
        }

        uri += '@';
    }

    uri += conn.host;

    if (port) {
        uri += ':'+port;
    }

    uri += '/'+database;

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
