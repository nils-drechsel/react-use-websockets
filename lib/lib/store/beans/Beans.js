"use strict";
// This file is auto-generated. Do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreMessage = exports.MessageType = exports.Comparator = exports.PasswordStrengthCriterium = void 0;
var PasswordStrengthCriterium;
(function (PasswordStrengthCriterium) {
    PasswordStrengthCriterium["LOWERCASE"] = "LOWERCASE";
    PasswordStrengthCriterium["UPPERCASE"] = "UPPERCASE";
    PasswordStrengthCriterium["NUMBERS"] = "NUMBERS";
    PasswordStrengthCriterium["SPECIAL_CHARACTERS"] = "SPECIAL_CHARACTERS";
})(PasswordStrengthCriterium = exports.PasswordStrengthCriterium || (exports.PasswordStrengthCriterium = {}));
var Comparator;
(function (Comparator) {
    Comparator["EQUAL"] = "EQUAL";
    Comparator["NOT_EQUAL"] = "NOT_EQUAL";
    Comparator["GREATER"] = "GREATER";
    Comparator["GREATER_OR_EQUAL"] = "GREATER_OR_EQUAL";
    Comparator["SMALLER"] = "SMALLER";
    Comparator["SMALLER_OR_EQUAL"] = "SMALLER_OR_EQUAL";
})(Comparator = exports.Comparator || (exports.Comparator = {}));
var MessageType;
(function (MessageType) {
    MessageType["ERROR"] = "ERROR";
    MessageType["WARNING"] = "WARNING";
    MessageType["INFO"] = "INFO";
    MessageType["SUCCESS"] = "SUCCESS";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var CoreMessage;
(function (CoreMessage) {
    CoreMessage["PING"] = "PING";
    CoreMessage["PONG"] = "PONG";
    CoreMessage["AUTHENTICATE"] = "AUTHENTICATE";
    CoreMessage["STORE_CONNECT"] = "STORE_CONNECT";
    CoreMessage["STORE_RECONNECT"] = "STORE_RECONNECT";
    CoreMessage["STORE_DISCONNECT"] = "STORE_DISCONNECT";
    CoreMessage["STORE_UPDATE"] = "STORE_UPDATE";
    CoreMessage["VALIDATION"] = "VALIDATION";
    CoreMessage["STORE_EDIT"] = "STORE_EDIT";
    CoreMessage["STORE_CREATE"] = "STORE_CREATE";
    CoreMessage["MESSAGE"] = "MESSAGE";
    CoreMessage["CLIENT_ERROR"] = "CLIENT_ERROR";
})(CoreMessage = exports.CoreMessage || (exports.CoreMessage = {}));
//# sourceMappingURL=Beans.js.map