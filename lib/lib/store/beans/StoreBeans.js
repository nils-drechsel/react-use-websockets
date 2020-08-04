"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StoreMessage;
(function (StoreMessage) {
    StoreMessage["CONNECT"] = "CONNECT";
    StoreMessage["DISCONNECT"] = "DISCONNECT";
    StoreMessage["STORE_UPDATE"] = "STORE_UPDATE";
})(StoreMessage = exports.StoreMessage || (exports.StoreMessage = {}));
var Comparator;
(function (Comparator) {
    Comparator["EQUAL"] = "EQUAL";
    Comparator["NOT_EQUAL"] = "NOT_EQUAL";
    Comparator["GREATER"] = "GREATER";
    Comparator["GREATER_OR_EQUAL"] = "GREATER_OR_EQUAL";
    Comparator["SMALLER"] = "SMALLER";
    Comparator["SMALLER_OR_EQUAL"] = "SMALLER_OR_EQUAL";
})(Comparator = exports.Comparator || (exports.Comparator = {}));
