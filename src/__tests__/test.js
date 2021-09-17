
const assert = require('assert')

const {
    READ_POOL,
    WRITE_POOL,
    asyncLocalStorage,
    getClient
} = require('..')

test('getClient()', () => {
    assert.strictEqual(getClient(), WRITE_POOL)
})

test('run() => getClient() w/ callbacks', (done) => {
    asyncLocalStorage.run({
        readonly: true
    }, () => {
        setImmediate(() => {
            assert.strictEqual(getClient(), READ_POOL)
            done()
        })
    })
})

test('run() => getClient() w/ async functions', (done) => {
    asyncLocalStorage.run({
        readonly: true
    }, () => {
        testIsReadPool().then(done, done)
    })
})

test('enterWith() => getClient() w/ async functions', async () => {
    asyncLocalStorage.enterWith({
        readonly: true
    })
    await testIsReadPool()
})

test('enterWith() => getClient() w/ promises', async () => {
    asyncLocalStorage.enterWith({
        readonly: true
    })
    return Promise.resolve()
    .then(() => assert.strictEqual(getClient(), READ_POOL))
})

async function testIsReadPool () {
    await new Promise(resolve => setImmediate(resolve))
    assert.strictEqual(getClient(), READ_POOL)
}