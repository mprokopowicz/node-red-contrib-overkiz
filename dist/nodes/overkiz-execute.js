"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var node_red_contrib_typescript_node_1 = require("node-red-contrib-typescript-node");
;
module.exports = function (RED) {
    var OverkizExecute = /** @class */ (function (_super) {
        __extends(OverkizExecute, _super);
        function OverkizExecute(config) {
            var _this = _super.call(this, RED) || this;
            _this.createNode(config);
            _this.config = config;
            _this.device = null;
            _this.numExecutingCmds = 0;
            _this.status({ fill: "grey", shape: "ring", text: "Uninitialized" });
            var node = _this;
            _this.on('input', function (msg, send, done) {
                return __awaiter(this, void 0, void 0, function () {
                    var error, cmdParams, command, result, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, node.initialize()];
                            case 1:
                                _b.sent();
                                if (!node.device || !node.commandDef) {
                                    if (done) {
                                        done("Failed to initialize device and/or command.");
                                        node.status({ fill: "red", shape: "dot", text: "Error" });
                                    }
                                    return [2 /*return*/];
                                }
                                send = send || function () { node.send.apply(node, arguments); };
                                error = undefined;
                                cmdParams = [];
                                if (msg.payload != null) {
                                    if (Array.isArray(msg.payload)) {
                                        cmdParams = msg.payload;
                                    }
                                    else {
                                        cmdParams = [msg.payload];
                                    }
                                }
                                if (!(cmdParams.length < node.commandDef.nbParams)) return [3 /*break*/, 2];
                                error = "Received too less parameters for command \"" + node.commandDef.name + "\". Expected: " + node.commandDef.nbParams + ", received: " + cmdParams.length + ".";
                                return [3 /*break*/, 6];
                            case 2:
                                _b.trys.push([2, 4, 5, 6]);
                                node.numExecutingCmds++;
                                node.status({ fill: "green", shape: "dot", text: "Executing" });
                                command = { name: node.commandDef.name };
                                if (node.commandDef.nbParams > 0) {
                                    command.parameters = cmdParams.slice(0, node.commandDef.nbParams);
                                }
                                return [4 /*yield*/, node.device.exec(command)];
                            case 3:
                                result = _b.sent();
                                msg = { payload: result };
                                if (node.numExecutingCmds === 1) {
                                    send(msg);
                                }
                                return [3 /*break*/, 6];
                            case 4:
                                _a = _b.sent();
                                error = "Execution of command \"" + node.commandDef.name + "\" failed.";
                                return [3 /*break*/, 6];
                            case 5:
                                node.numExecutingCmds--;
                                return [7 /*endfinally*/];
                            case 6:
                                if (node.numExecutingCmds === 0) {
                                    if (error) {
                                        node.status({ fill: "red", shape: "dot", text: "Error" });
                                    }
                                    else {
                                        node.status({ fill: "yellow", shape: "ring", text: "Idle" });
                                    }
                                }
                                if (done) {
                                    done(error);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            });
            return _this;
        }
        OverkizExecute.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var gateway, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.device && this.commandDef) {
                                return [2 /*return*/];
                            }
                            gateway = this.getGateway();
                            if (!gateway) {
                                this.device = null;
                                return [2 /*return*/];
                            }
                            _a = this;
                            return [4 /*yield*/, gateway.getObjectByUrl(this.config.device)];
                        case 1:
                            _a.device = _b.sent();
                            if (this.device == null) {
                                return [2 /*return*/];
                            }
                            this.commandDef = this.device.definition.getCommandDefinition(this.config.command);
                            return [2 /*return*/];
                    }
                });
            });
        };
        OverkizExecute.prototype.getGateway = function () {
            return this.red.nodes.getNode(this.config.gateway);
        };
        return OverkizExecute;
    }(node_red_contrib_typescript_node_1.Node));
    OverkizExecute.registerType(RED, "overkiz-execute");
};
