parse-dburi
==========

Parse and stringify a DB URI.

Installation
------------

```
npm install parse-dburi
```

Usage
-----

```js
var dbUri = require('parse-dburi');

// parse a database uri
dbUri.parse('mysql://username:password@example.com:12345/db_name');
/*
{ uri: 'mysql://username:password@example.com:12345/db_name',
  fullUri: 'mysql://username:password@example.com:12345/db_name',
  protocol: 'mysql',
  host: 'example.com',
  port: 12345,
  username: 'username',
  password: 'password',
  database: 'db_name' }
*/

// fill an incomplete uri with defaults
var defaults = {
  protocol: 'mysql',
  username: 'username',
  password: 'password',
  port: 12345
};

dbUri.parse('example.com/db_name', defaults);
/*
{ uri: 'example.com/db_name',
  fullUri: 'mysql://username:password@example.com:12345/db_name',
  protocol: 'mysql',
  host: 'example.com',
  port: 12345,
  username: 'username',
  password: 'password',
  database: 'db_name' }
*/

// resolve an incomplete uri with defaults
dbUri.resolve('example.com/db_name', defaults);
// 'mysql://username:password@example.com:12345/db_name'

// stringify a db connection object
dbUri.stringify({
  uri: 'example.com/db_name',
  fullUri: 'mysql://username:password@example.com:12345/db_name',
  protocol: 'mysql',
  host: 'example.com',
  port: 12345,
  username: 'username',
  password: 'password',
  database: 'db_name'
});
// 'mysql://username:password@example.com:12345/db_name'
```

License
-------
MIT license - http://www.opensource.org/licenses/mit-license.php