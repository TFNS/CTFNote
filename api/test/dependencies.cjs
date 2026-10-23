const assert = require('node:assert/strict');
const { once } = require('node:events');
const http = require('node:http');
const { createRequire } = require('node:module');
const { test } = require('node:test');
const axios = require('axios');
const express = require('express');

test('Axios enforces size limits on data URLs', async () => {
  await assert.rejects(
    axios.get(`data:text/plain;base64,${Buffer.alloc(4096).toString('base64')}`, {
      maxContentLength: 1024,
    }),
    /maxContentLength/
  );
});

test('HedgeDoc creation preserves markdown and returns the unfollowed redirect', async () => {
  let received;
  const server = http.createServer(async (req, res) => {
    assert.equal(req.url, '/new');
    assert.equal(req.headers['content-type'], 'text/markdown');
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    received = Buffer.concat(chunks).toString();
    res.writeHead(302, { Location: '/test-pad' }).end();
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    Object.assign(process.env, {
      NODE_ENV: 'production', DB_DATABASE: 'test', DB_USER_LOGIN: 'test',
      DB_USER_PASSWORD: 'test', DB_ADMIN_LOGIN: 'test', DB_ADMIN_PASSWORD: 'test',
      DB_HOST: '127.0.0.1', DB_PORT: '5432', WEB_PORT: '3000',
      PAD_CREATE_URL: `http://127.0.0.1:${server.address().port}/new`,
      PAD_SHOW_URL: '/pad/', DISCORD_BOT_TOKEN: 'test', DISCORD_SERVER_ID: 'test',
      DISCORD_VOICE_CHANNELS: '3',
    });
    const { createPad } = require('../dist/plugins/createTask');
    assert.equal(await createPad('Example', 'Description', ['web']), '/test-pad');
    assert.match(received, /^# Example - web\n\n## Description\n\nDescription/);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test('Express rejects pathological route parameters and matches normal ones', () => {
  const app = express();
  app.get('/:a-:b', () => {});
  const layer = app._router.stack.at(-1);
  assert.equal(layer.match('/hello-world'), true);
  assert.equal(layer.match(`/${'-'.repeat(20000)}/missing`), false);
});

for (const owner of ['postgraphile', '@discordjs/ws']) {
  test(`${owner} WebSocket receiver rejects excessive fragments`, async () => {
    const ownerRequire = createRequire(require.resolve(owner));
    const { Receiver, Server } = ownerRequire('ws');
    assert.ok(new Server({ noServer: true }).options.maxFragments > 0);
    const major = Number(ownerRequire('ws/package.json').version.split('.')[0]);
    const receiver = major === 7
      ? new Receiver(undefined, undefined, false, 0, 0, 2)
      : new Receiver({ maxFragments: 2 });
    const error = once(receiver, 'error');
    // Three non-final unmasked binary/continuation frames with one-byte payloads.
    receiver.write(Buffer.from([0x02, 1, 65, 0, 1, 66, 0, 1, 67]));
    assert.equal((await error)[0].code, 'WS_ERR_TOO_MANY_BUFFERED_PARTS');
  });

  test(`${owner} WebSocket receiver preserves ordinary fragmented messages`, async () => {
    const ownerRequire = createRequire(require.resolve(owner));
    const { Receiver, Server } = ownerRequire('ws');
    assert.ok(new Server({ noServer: true }).options.maxFragments > 0);
    const major = Number(ownerRequire('ws/package.json').version.split('.')[0]);
    const receiver = major === 7
      ? new Receiver(undefined, undefined, false, 0, 0, 2)
      : new Receiver({ maxFragments: 2 });
    const message = once(receiver, 'message');
    receiver.write(Buffer.from([0x02, 1, 65, 0x80, 1, 66]));
    assert.equal((await message)[0].toString(), 'AB');
  });
}
