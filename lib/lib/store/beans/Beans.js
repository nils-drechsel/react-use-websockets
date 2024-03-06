"use strict";
// This file is auto-generated. Do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerIdents = exports.ServerToClientStoreMessage = exports.CoreMessage = exports.ClientToServerStoreMessage = exports.ServerStoreMessage = exports.IOCoreEndpoints = exports.MessageType = exports.StoreAction = exports.Comparator = exports.PasswordStrengthCriterium = void 0;
var PasswordStrengthCriterium;
(function (PasswordStrengthCriterium) {
    PasswordStrengthCriterium["LOWERCASE"] = "LOWERCASE";
    PasswordStrengthCriterium["UPPERCASE"] = "UPPERCASE";
    PasswordStrengthCriterium["NUMBERS"] = "NUMBERS";
    PasswordStrengthCriterium["SPECIAL_CHARACTERS"] = "SPECIAL_CHARACTERS";
})(PasswordStrengthCriterium || (exports.PasswordStrengthCriterium = PasswordStrengthCriterium = {}));
var Comparator;
(function (Comparator) {
    Comparator["EQUAL"] = "EQUAL";
    Comparator["NOT_EQUAL"] = "NOT_EQUAL";
    Comparator["GREATER"] = "GREATER";
    Comparator["GREATER_OR_EQUAL"] = "GREATER_OR_EQUAL";
    Comparator["SMALLER"] = "SMALLER";
    Comparator["SMALLER_OR_EQUAL"] = "SMALLER_OR_EQUAL";
})(Comparator || (exports.Comparator = Comparator = {}));
var StoreAction;
(function (StoreAction) {
    StoreAction["INSERT"] = "INSERT";
    StoreAction["UPDATE"] = "UPDATE";
    StoreAction["REMOVE"] = "REMOVE";
})(StoreAction || (exports.StoreAction = StoreAction = {}));
var MessageType;
(function (MessageType) {
    MessageType["ERROR"] = "ERROR";
    MessageType["WARNING"] = "WARNING";
    MessageType["INFO"] = "INFO";
    MessageType["SUCCESS"] = "SUCCESS";
})(MessageType || (exports.MessageType = MessageType = {}));
var IOCoreEndpoints;
(function (IOCoreEndpoints) {
    IOCoreEndpoints["CORE"] = "CORE";
    IOCoreEndpoints["STORE"] = "STORE";
})(IOCoreEndpoints || (exports.IOCoreEndpoints = IOCoreEndpoints = {}));
var ServerStoreMessage;
(function (ServerStoreMessage) {
    ServerStoreMessage["UPDATE"] = "UPDATE";
})(ServerStoreMessage || (exports.ServerStoreMessage = ServerStoreMessage = {}));
var ClientToServerStoreMessage;
(function (ClientToServerStoreMessage) {
    ClientToServerStoreMessage["CONNECT"] = "CONNECT";
    ClientToServerStoreMessage["DISCONNECT"] = "DISCONNECT";
    ClientToServerStoreMessage["INSERT"] = "INSERT";
    ClientToServerStoreMessage["REMOVE"] = "REMOVE";
    ClientToServerStoreMessage["UPDATE"] = "UPDATE";
})(ClientToServerStoreMessage || (exports.ClientToServerStoreMessage = ClientToServerStoreMessage = {}));
var CoreMessage;
(function (CoreMessage) {
    CoreMessage["PING"] = "PING";
    CoreMessage["PONG"] = "PONG";
    CoreMessage["AUTHENTICATE"] = "AUTHENTICATE";
    CoreMessage["VALIDATION"] = "VALIDATION";
    CoreMessage["MESSAGE"] = "MESSAGE";
    CoreMessage["CLIENT_ERROR"] = "CLIENT_ERROR";
})(CoreMessage || (exports.CoreMessage = CoreMessage = {}));
var ServerToClientStoreMessage;
(function (ServerToClientStoreMessage) {
    ServerToClientStoreMessage["CONNECTED"] = "CONNECTED";
    ServerToClientStoreMessage["CONNECTION_ERROR"] = "CONNECTION_ERROR";
    ServerToClientStoreMessage["UPDATE"] = "UPDATE";
    ServerToClientStoreMessage["DISCONNECT_FORCEFULLY"] = "DISCONNECT_FORCEFULLY";
    ServerToClientStoreMessage["VALIDATION"] = "VALIDATION";
})(ServerToClientStoreMessage || (exports.ServerToClientStoreMessage = ServerToClientStoreMessage = {}));
var ServerIdents;
(function (ServerIdents) {
    ServerIdents["MAIN"] = "MAIN";
})(ServerIdents || (exports.ServerIdents = ServerIdents = {}));
//# sourceMappingURL=Beans.js.map