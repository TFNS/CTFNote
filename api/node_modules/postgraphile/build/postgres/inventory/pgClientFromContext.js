"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$$pgClient = void 0;
const pg_1 = require("pg");
exports.$$pgClient = 'pgClient';
/**
 * Retrieves a Postgres client from a context, throwing an error if such a
 * client does not exist.
 */
function getPgClientFromContext(context) {
    if (context == null || typeof context !== 'object')
        throw new Error('Context must be an object.');
    const client = context[exports.$$pgClient];
    if (client == null)
        throw new Error('Postgres client does not exist on the context.');
    if (!(client instanceof pg_1.ClientBase))
        throw new Error('Postgres client on context is of the incorrect type.');
    return client;
}
exports.default = getPgClientFromContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdDbGllbnRGcm9tQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvcGdDbGllbnRGcm9tQ29udGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwyQkFBNEM7QUFFL0IsUUFBQSxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBRXJDOzs7R0FHRztBQUNILFNBQXdCLHNCQUFzQixDQUFDLE9BQWM7SUFDM0QsSUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVE7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFFbEcsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGtCQUFVLENBQUMsQ0FBQztJQUVuQyxJQUFJLE1BQU0sSUFBSSxJQUFJO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO0lBRXRGLElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxlQUFVLENBQUM7UUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0lBRTFFLE9BQU8sTUFBb0IsQ0FBQztBQUM5QixDQUFDO0FBWEQseUNBV0MifQ==