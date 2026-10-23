const { on } = require('node:events');

// Attach immediately so frames arriving together are buffered between assertions.
function graphqlMessages(ws, signal = AbortSignal.timeout(5000)) {
  const messages = on(ws, 'message', { signal, close: ['close'] });
  return {
    async next() {
      for (;;) {
        const { value, done } = await messages.next();
        if (done) throw new Error('WebSocket closed before the expected GraphQL message');
        const message = JSON.parse(value[0].toString());
        if (message.type !== 'ka') return message;
      }
    },
    close: () => messages.return(),
  };
}

module.exports = { graphqlMessages };
