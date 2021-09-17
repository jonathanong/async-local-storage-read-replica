const { AsyncLocalStorage } = require('async_hooks')
const { Pool } = require('pg')

const WRITE_DATABASE_URL = process.env.WRITE_DATABASE_URL || 'postgres://write-user@localhost/async-local-storage'
const READ_DATABASE_URL = process.env.READ_DATABASE_URL || 'postgres://read-user@localhost/async-local-storage'

const WRITE_POOL = new Pool({
    connectionString: WRITE_DATABASE_URL
})

const READ_POOL = new Pool({
    connectionString: READ_DATABASE_URL
})

const asyncLocalStorage = new AsyncLocalStorage()

function getClient (_options = {}) {
    const options = {
        ...(asyncLocalStorage.getStore() || {}),
        ..._options
    }
    return options.readonly || options.read_only ? READ_POOL : WRITE_POOL
}

Object.assign(exports, {
    READ_POOL,
    WRITE_POOL,
    asyncLocalStorage,
    getClient
})