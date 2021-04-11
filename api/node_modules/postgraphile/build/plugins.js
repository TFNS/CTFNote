"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsFilePlugin = exports.makePgSmartTagsFromFilePlugin = void 0;
const fs_1 = require("fs");
const graphile_utils_1 = require("graphile-utils");
const JSON5 = require("json5");
const makePgSmartTagsFromFilePlugin = (tagsFile = process.cwd() + '/postgraphile.tags.json5') => {
    /*
     * We're wrapping the `smartTagsPlugin` defined below with a plugin wrapper
     * so that any errors from reading the smart tags file are thrown when the
     * plugin is *loaded* rather than from when it is defined.
     */
    const plugin = (builder, options) => {
        function handleTagsError(err) {
            console.error(`Failed to process smart tags file '${tagsFile}': ${err.message}`);
        }
        const initialTagsJSON = JSON5.parse(fs_1.readFileSync(tagsFile, 'utf8'));
        let tagsListener = null;
        const smartTagsPlugin = graphile_utils_1.makeJSONPgSmartTagsPlugin(initialTagsJSON, updateJSON => {
            if (tagsListener) {
                fs_1.unwatchFile(tagsFile, tagsListener);
                tagsListener = null;
            }
            if (updateJSON) {
                tagsListener = (_current, _previous) => {
                    fs_1.readFile(tagsFile, 'utf8', (err, data) => {
                        if (err) {
                            if (err['code'] === 'ENOENT') {
                                updateJSON(null);
                            }
                            else {
                                handleTagsError(err);
                            }
                            return;
                        }
                        try {
                            updateJSON(JSON5.parse(data));
                        }
                        catch (e) {
                            handleTagsError(e);
                        }
                    });
                };
                fs_1.watchFile(tagsFile, { interval: 507 }, tagsListener);
            }
        });
        return smartTagsPlugin(builder, options);
    };
    return plugin;
};
exports.makePgSmartTagsFromFilePlugin = makePgSmartTagsFromFilePlugin;
exports.TagsFilePlugin = exports.makePgSmartTagsFromFilePlugin();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2lucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wbHVnaW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJCQUEyRTtBQUMzRSxtREFBNEU7QUFDNUUsK0JBQStCO0FBR3hCLE1BQU0sNkJBQTZCLEdBQUcsQ0FDM0MsUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRywwQkFBMEIsRUFDN0MsRUFBRTtJQUNWOzs7O09BSUc7SUFDSCxNQUFNLE1BQU0sR0FBVyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRTtRQUMxQyxTQUFTLGVBQWUsQ0FBQyxHQUFVO1lBQ2pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLFFBQVEsTUFBTSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNuRixDQUFDO1FBRUQsTUFBTSxlQUFlLEdBQW9CLEtBQUssQ0FBQyxLQUFLLENBQUMsaUJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUVyRixJQUFJLFlBQVksR0FBdUQsSUFBSSxDQUFDO1FBQzVFLE1BQU0sZUFBZSxHQUFHLDBDQUF5QixDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsRUFBRTtZQUM5RSxJQUFJLFlBQVksRUFBRTtnQkFDaEIsZ0JBQVcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ3BDLFlBQVksR0FBRyxJQUFJLENBQUM7YUFDckI7WUFDRCxJQUFJLFVBQVUsRUFBRTtnQkFDZCxZQUFZLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFRLEVBQUU7b0JBQzNDLGFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO3dCQUN2QyxJQUFJLEdBQUcsRUFBRTs0QkFDUCxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0NBQzVCLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs2QkFDbEI7aUNBQU07Z0NBQ0wsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzZCQUN0Qjs0QkFDRCxPQUFPO3lCQUNSO3dCQUNELElBQUk7NEJBQ0YsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt5QkFDL0I7d0JBQUMsT0FBTyxDQUFDLEVBQUU7NEJBQ1YsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNwQjtvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUM7Z0JBRUYsY0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQzthQUN0RDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxlQUFlLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQztJQUNGLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQTlDVyxRQUFBLDZCQUE2QixpQ0E4Q3hDO0FBRVcsUUFBQSxjQUFjLEdBQUcscUNBQTZCLEVBQUUsQ0FBQyJ9