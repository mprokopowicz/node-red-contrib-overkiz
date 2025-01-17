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
    var OverkizState = /** @class */ (function (_super) {
        __extends(OverkizState, _super);
        function OverkizState(config) {
            var _this = _super.call(this, RED) || this;
            _this.createNode(config);
            _this.config = config;
            _this.device = null;
            var node = _this;
            _this.on('input', function (msg, send, done) {
                return __awaiter(this, void 0, void 0, function () {
                    var error, states, state;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, node.initialize()];
                            case 1:
                                _a.sent();
                                if (!node.device) {
                                    if (done) {
                                        done("Failed to initialize device.");
                                    }
                                    return [2 /*return*/];
                                }
                                send = send || function () { node.send.apply(node, arguments); };
                                error = undefined;
                                if (!node.config.allStates) return [3 /*break*/, 3];
                                return [4 /*yield*/, node.device.refreshStates()];
                            case 2:
                                states = _a.sent();
                                if (states) {
                                    msg.payload = states;
                                    send(msg);
                                }
                                else {
                                    error = "Failed to fetch all states.";
                                }
                                return [3 /*break*/, 5];
                            case 3: return [4 /*yield*/, node.device.refreshState(node.config.state)];
                            case 4:
                                state = _a.sent();
                                if (state) {
                                    msg.payload = state;
                                    send(msg);
                                }
                                else {
                                    error = "Failed to fetch state: \"" + node.config.state + "\".";
                                }
                                _a.label = 5;
                            case 5:
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
        OverkizState.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var gateway, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.device) {
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
                            return [2 /*return*/];
                    }
                });
            });
        };
        OverkizState.prototype.getGateway = function () {
            return this.red.nodes.getNode(this.config.gateway);
        };
        return OverkizState;
    }(node_red_contrib_typescript_node_1.Node));
    OverkizState.registerType(RED, "overkiz-state");
};
