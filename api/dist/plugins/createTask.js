"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphile_utils_1 = require("graphile-utils");
var axios_1 = __importDefault(require("axios"));
var savepointWrapper_1 = __importDefault(require("./savepointWrapper"));
function createPad() {
    return __awaiter(this, void 0, void 0, function () {
        var createUrl, res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createUrl = process.env.CREATE_PAD_URL || '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(createUrl, {
                            maxRedirects: 0,
                            validateStatus: function (status) { return status === 302; },
                        })];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, res.headers.location];
                case 3:
                    e_1 = _a.sent();
                    throw Error("Call to " + createUrl + " during task creation failed.");
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = graphile_utils_1.makeExtendSchemaPlugin(function (build) {
    var sql = build.pgSql;
    return {
        typeDefs: graphile_utils_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["     \n      input CreateTaskInput {\n        ctfId: Int!\n        title: String!\n        category: String!\n        description: String\n        flag: String\n      }\n      \n      type CreateTaskPayload {\n        task: Task @pgField\n        query: Query\n      }\n\n      extend type Mutation {\n        createTask(input: CreateTaskInput) : CreateTaskPayload\n      }\n      "], ["     \n      input CreateTaskInput {\n        ctfId: Int!\n        title: String!\n        category: String!\n        description: String\n        flag: String\n      }\n      \n      type CreateTaskPayload {\n        task: Task @pgField\n        query: Query\n      }\n\n      extend type Mutation {\n        createTask(input: CreateTaskInput) : CreateTaskPayload\n      }\n      "]))),
        resolvers: {
            Mutation: {
                createTask: function (_query, _a, _b, resolveInfo) {
                    var _c = _a.input, title = _c.title, description = _c.description, category = _c.category, flag = _c.flag, ctfId = _c.ctfId;
                    var pgClient = _b.pgClient;
                    return __awaiter(void 0, void 0, void 0, function () {
                        var padPath, padUrl;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, createPad()];
                                case 1:
                                    padPath = _d.sent();
                                    padUrl = "" + (process.env.SHOW_PAD_URL || '/') + padPath;
                                    return [4 /*yield*/, savepointWrapper_1.default(pgClient, function () { return __awaiter(void 0, void 0, void 0, function () {
                                            var newTask, row;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, pgClient.query("SELECT * FROM ctfnote_private.create_task($1, $2, $3, $4, $5, $6)", [
                                                            title, description, category, flag, padUrl, ctfId
                                                        ])];
                                                    case 1:
                                                        newTask = (_a.sent()).rows[0];
                                                        return [4 /*yield*/, resolveInfo.graphile.selectGraphQLResultFromTable(sql.fragment(templateObject_2 || (templateObject_2 = __makeTemplateObject(["ctfnote.task"], ["ctfnote.task"]))), function (tableAlias, queryBuilder) {
                                                                queryBuilder.where(sql.fragment(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", ".id = ", ""], ["", ".id = ", ""])), tableAlias, sql.value(newTask.id)));
                                                            })];
                                                    case 2:
                                                        row = (_a.sent())[0];
                                                        return [2 /*return*/, {
                                                                data: row,
                                                                query: build.$$isQuery,
                                                            }];
                                                }
                                            });
                                        }); })];
                                case 2: return [2 /*return*/, _d.sent()];
                            }
                        });
                    });
                },
            },
        },
    };
});
var templateObject_1, templateObject_2, templateObject_3;
