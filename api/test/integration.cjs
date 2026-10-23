// Run against a disposable, freshly migrated database; the first account is admin.
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const { createRequire } = require('node:module');
const { test } = require('node:test');
const { graphqlMessages } = require('./graphql-messages.cjs');

test('API registration, login, CTFs, tasks, uploads, calendar and subscriptions', { timeout: 20000 }, async () => {
  const base = process.env.TEST_API_URL || 'http://127.0.0.1:3000';
  let token;
  async function graphql(query, variables) {
    const response = await fetch(`${base}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    assert.equal(result.errors, undefined, JSON.stringify(result.errors));
    return result.data;
  }
  const pad = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    assert.match(Buffer.concat(chunks).toString(), /# Regression task/);
    res.writeHead(302, { Location: '/regression-pad' }).end();
  });
  if (!process.env.TEST_REAL_PAD) {
    pad.listen(Number(process.env.TEST_PAD_PORT || 53001), '127.0.0.1');
    await once(pad, 'listening');
  }
  let ws;
  let messages;
  try {
    const login = process.env.TEST_ADMIN_LOGIN || `regression-${Date.now()}`;
    const variables = { login, password: process.env.TEST_ADMIN_PASSWORD || 'test-password' };
    const auth = '($login:String!,$password:String!)';
    if (!process.env.TEST_ADMIN_LOGIN) {
      token = (await graphql(`mutation ${auth} {register(input:{login:$login,password:$password}){jwt}}`, variables)).register.jwt;
    } else {
      token = (await graphql(`mutation ${auth} {login(input:{login:$login,password:$password}){jwt}}`, variables)).login.jwt;
    }
    assert.ok(token);
    assert.ok((await graphql(`mutation ${auth} {login(input:{login:$login,password:$password}){jwt}}`, variables)).login.jwt);
    assert.equal((await graphql('{me{username}}')).me.username, login);

    const ctf = (await graphql('mutation {createCtf(input:{ctf:{title:"Regression CTF",startTime:"2026-01-01T00:00:00Z",endTime:"2026-01-02T00:00:00Z"}}){ctf{id}}}')).createCtf.ctf;
    const task = (await graphql('mutation ($id:Int!) {createTask(input:{ctfId:$id,title:"Regression task",description:"Markdown **description**",tags:["web"]}){task{id title padUrl}}}', { id: ctf.id })).createTask.task;
    assert.equal(task.title, 'Regression task');
    if (process.env.TEST_REAL_PAD) {
      assert.match(task.padUrl, /^\/pad\/[^/]+$/);
      const note = await (await fetch(`${base}${task.padUrl}/download`)).text();
      assert.match(note, /# Regression task/);
      assert.match(note, /Markdown \*\*description\*\*/);
    } else {
      assert.equal(task.padUrl, '/pad/regression-pad');
    }
    assert.equal((await graphql('mutation ($id:Int!){updateTask(input:{id:$id,patch:{flag:"flag{fixed}"}}){task{flag}}}', { id: task.id })).updateTask.task.flag, 'flag{fixed}');

    const form = new FormData();
    form.set('operations', JSON.stringify({ query: 'mutation ($file:Upload!){uploadCtfLogo(logo:$file)}', variables: { file: null } }));
    form.set('map', JSON.stringify({ 0: ['variables.file'] }));
    form.set('0', new Blob(['test logo'], { type: 'image/png' }), 'test.png');
    const upload = await (await fetch(`${base}/graphql`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form })).json();
    assert.equal(upload.errors, undefined, JSON.stringify(upload.errors));
    const download = await fetch(`${base}${upload.data.uploadCtfLogo}`);
    assert.match(download.headers.get('content-disposition'), /attachment/);
    assert.equal(await download.text(), 'test logo');
    const key = (await graphql('{settings{nodes{icalPassword}}}')).settings.nodes[0].icalPassword || '';
    assert.equal((await fetch(`${base}/calendar.ics?key=wrong-key`)).status, 403);
    const calendar = await (await fetch(`${base}/calendar.ics?key=${encodeURIComponent(key)}`)).text();
    assert.match(calendar, /BEGIN:VCALENDAR/);
    assert.match(calendar, /Regression CTF/);

    const WebSocket = createRequire(require.resolve('postgraphile'))('ws');
    ws = new WebSocket(`${base.replace(/^http/, 'ws')}/graphql`, 'graphql-ws');
    messages = graphqlMessages(ws);
    await once(ws, 'open');
    ws.send(JSON.stringify({ type: 'connection_init', payload: { Authorization: `Bearer ${token}` } }));
    assert.equal((await messages.next()).type, 'connection_ack');
    ws.send(JSON.stringify({ id: '1', type: 'start', payload: { query: 'subscription {listen(topic:"update:tasks",initialEvent:true){relatedNode{... on Task{id flag}}}}' } }));
    const initial = await messages.next();
    assert.equal(initial.type, 'data', JSON.stringify(initial));
    await graphql('mutation ($id:Int!){updateTask(input:{id:$id,patch:{flag:"flag{subscription}"}}){task{id}}}', { id: task.id });
    const result = await messages.next();
    assert.equal(result.payload.data.listen.relatedNode.id, task.id);
    assert.equal(result.payload.data.listen.relatedNode.flag, 'flag{subscription}');
  } finally {
    await messages?.close();
    ws?.terminate();
    if (pad.listening) await new Promise(resolve => pad.close(resolve));
  }
});
