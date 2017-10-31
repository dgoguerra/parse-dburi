
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

    var dbUriRegex = /^((\w+):\/\/)?(([^:]+)(:([^@]+))?@)?(([^\/:]+)(:(\d+))?)(\/(\w+)?)?$/;

    var match = uri.match(dbUriRegex);

    if (!match) return null;

    var conn = {
        uri: uri,
        protocol: match[2] || defaults.protocol,
        // username or password's special characters may be encoded
        username: match[4] && decodeURIComponent(match[4]) || defaults.username,
        password: match[6] && decodeURIComponent(match[6]) || defaults.password,
        host: match[8] || defaults.host,
        port: Number(match[10]) || defaults.port,
        database: match[12] || defaults.database
    };

    conn.fullUri = stringifyConn(conn);

    // remove undefined keys from the result
    Object.keys(conn).forEach(function(k) {
        if (typeof conn[k] === 'undefined') {
            delete conn[k];
        }
    });

    return conn;
}

module.exports.parse = parseDbUri;

function resolveDbUri(uri, defaults) {
    var conn = parseDbUri(uri, defaults);

    return conn.fullUri;
}

module.exports.resolve = resolveDbUri;
