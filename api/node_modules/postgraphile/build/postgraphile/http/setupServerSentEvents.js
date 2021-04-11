"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sets the headers and streams a body for server-sent events (primarily used
 * by watch mode).
 *
 * @internal
 */
function setupServerSentEvents(res, options) {
    const req = res.getNodeServerRequest();
    const { _emitter, watchPg } = options;
    // Making sure these options are set.
    req.socket.setTimeout(0);
    req.socket.setNoDelay(true);
    req.socket.setKeepAlive(true);
    // Set headers for Server-Sent Events.
    res.statusCode = 200;
    // Don't buffer EventStream in nginx
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    if (req.httpVersionMajor >= 2) {
        // NOOP
    }
    else {
        res.setHeader('Connection', 'keep-alive');
    }
    // Creates a stream for the response
    const stream = res.endWithStream();
    // Notify client that connection is open.
    stream.write('event: open\n\n');
    // Setup listeners.
    const schemaChangedCb = () => stream.write('event: change\ndata: schema\n\n');
    if (watchPg)
        _emitter.on('schemas:changed', schemaChangedCb);
    // Clean up when connection closes.
    const cleanup = () => {
        req.removeListener('close', cleanup);
        req.removeListener('finish', cleanup);
        req.removeListener('error', cleanup);
        _emitter.removeListener('test:close', cleanup);
        _emitter.removeListener('schemas:changed', schemaChangedCb);
        stream.end();
    };
    req.on('close', cleanup);
    req.on('finish', cleanup);
    req.on('error', cleanup);
    _emitter.on('test:close', cleanup);
}
exports.default = setupServerSentEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBTZXJ2ZXJTZW50RXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmFwaGlsZS9odHRwL3NldHVwU2VydmVyU2VudEV2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBOzs7OztHQUtHO0FBQ0gsU0FBd0IscUJBQXFCLENBQzNDLEdBQXlCLEVBQ3pCLE9BQW9DO0lBRXBDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQ3ZDLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBRXRDLHFDQUFxQztJQUNyQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU5QixzQ0FBc0M7SUFDdEMsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7SUFDckIsb0NBQW9DO0lBQ3BDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUNuRCxHQUFHLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0lBQ3pELElBQUksR0FBRyxDQUFDLGdCQUFnQixJQUFJLENBQUMsRUFBRTtRQUM3QixPQUFPO0tBQ1I7U0FBTTtRQUNMLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQzNDO0lBRUQsb0NBQW9DO0lBQ3BDLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUVuQyx5Q0FBeUM7SUFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBRWhDLG1CQUFtQjtJQUNuQixNQUFNLGVBQWUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7SUFFOUUsSUFBSSxPQUFPO1FBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUU3RCxtQ0FBbUM7SUFDbkMsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFO1FBQ25CLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLFFBQVEsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDNUQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2YsQ0FBQyxDQUFDO0lBQ0YsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekIsUUFBUSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDckMsQ0FBQztBQWhERCx3Q0FnREMifQ==