"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendedFormatError = void 0;
/**
 * Extracts the requested fields from a pg error object, handling 'code' -> 'errcode' mapping.
 */
function pickPgError(err, inFields) {
    const result = {};
    let fields;
    if (Array.isArray(inFields)) {
        fields = inFields;
    }
    else if (typeof inFields === 'string') {
        fields = inFields.split(',');
    }
    else {
        throw new Error('Invalid argument to extendedErrors - expected array of strings');
    }
    if (err && typeof err === 'object') {
        fields.forEach((field) => {
            // pg places 'errcode' on the 'code' property
            if (typeof field !== 'string') {
                throw new Error('Invalid argument to extendedErrors - expected array of strings');
            }
            const errField = field === 'errcode' ? 'code' : field;
            result[field] = err[errField] != null ? String(err[errField]) : err[errField];
        });
    }
    return result;
}
/**
 * Given a GraphQLError, format it according to the rules described by the
 * Response Format, Errors section of the GraphQL Specification, plus it can
 * extract additional error codes from the postgres error, such as 'hint',
 * 'detail', 'errcode', 'where', etc. - see `extendedErrors` option.
 */
function extendedFormatError(error, fields) {
    if (!error) {
        throw new Error('Received null or undefined error.');
    }
    const originalError = error.originalError;
    const exceptionDetails = originalError && fields ? pickPgError(originalError, fields) : undefined;
    return {
        // TODO:v5: remove this
        ...exceptionDetails,
        ...(exceptionDetails
            ? {
                // Reference: https://facebook.github.io/graphql/draft/#sec-Errors
                extensions: {
                    ...originalError.extensions,
                    exception: exceptionDetails,
                },
            }
            : null),
        message: error.message,
        locations: error.locations,
        path: error.path,
    };
}
exports.extendedFormatError = extendedFormatError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kZWRGb3JtYXRFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wb3N0Z3JhcGhpbGUvZXh0ZW5kZWRGb3JtYXRFcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQTs7R0FFRztBQUNILFNBQVMsV0FBVyxDQUFDLEdBQVUsRUFBRSxRQUFnQztJQUMvRCxNQUFNLE1BQU0sR0FBVSxFQUFFLENBQUM7SUFDekIsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDM0IsTUFBTSxHQUFHLFFBQVEsQ0FBQztLQUNuQjtTQUFNLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQ3ZDLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzlCO1NBQU07UUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUM7S0FDbkY7SUFFRCxJQUFJLEdBQUcsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7UUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQWEsRUFBRSxFQUFFO1lBQy9CLDZDQUE2QztZQUM3QyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtnQkFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO2FBQ25GO1lBQ0QsTUFBTSxRQUFRLEdBQUcsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDdEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hGLENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixtQkFBbUIsQ0FDakMsS0FBbUIsRUFDbkIsTUFBcUI7SUFFckIsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztLQUN0RDtJQUNELE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFxQyxDQUFDO0lBQ2xFLE1BQU0sZ0JBQWdCLEdBQUcsYUFBYSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2xHLE9BQU87UUFDTCx1QkFBdUI7UUFDdkIsR0FBRyxnQkFBZ0I7UUFFbkIsR0FBRyxDQUFDLGdCQUFnQjtZQUNsQixDQUFDLENBQUM7Z0JBQ0Usa0VBQWtFO2dCQUNsRSxVQUFVLEVBQUU7b0JBQ1YsR0FBRyxhQUFhLENBQUMsVUFBVTtvQkFDM0IsU0FBUyxFQUFFLGdCQUFnQjtpQkFDNUI7YUFDRjtZQUNILENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDVCxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87UUFDdEIsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1FBQzFCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtLQUNqQixDQUFDO0FBQ0osQ0FBQztBQTFCRCxrREEwQkMifQ==