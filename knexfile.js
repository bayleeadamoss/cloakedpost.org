module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://127.0.0.1',
  },
  production: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
  },
}
