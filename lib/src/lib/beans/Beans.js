"use strict";
// This file is auto-generated. Do not modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.FragmentActionType = exports.createFragmentUpdateBean = exports.createFragmentAction = exports.createIOClientToServerStoreBean = exports.createIOServerToClientStoreBean = exports.FragmentType = exports.ServerIdents = exports.ServerToClientStoreMessage = exports.createArrayBean = exports.createConcretisedArrayBean = exports.CoreMessage = exports.ServerStoreMessage = exports.IOCoreEndpoints = exports.createGTest = exports.createIOServerToClientCoreBean = exports.createFolderPseudoBean = exports.createClientToServerAuthenticationBean = exports.createIOPingPongBean = exports.createStoreConnectedBean = exports.createMessageBean = exports.createServerToClientAuthenticationBean = exports.MessageType = exports.StoreAction = exports.createFragmentList = exports.ClientToServerStoreMessage = exports.createStoreConnectionErrorBean = exports.createNoParametersBean = exports.Comparator = exports.createFragment = exports.createIOClientToServerCoreBean = exports.createTemplateMasterBean = exports.createTimestampBean = exports.createNullBean = exports.createKeyParametersBean = exports.createCoreConfig = exports.createClientErrorBean = exports.PasswordStrengthCriterium = void 0;
var PasswordStrengthCriterium;
(function (PasswordStrengthCriterium) {
    PasswordStrengthCriterium["LOWERCASE"] = "LOWERCASE";
    PasswordStrengthCriterium["UPPERCASE"] = "UPPERCASE";
    PasswordStrengthCriterium["NUMBERS"] = "NUMBERS";
    PasswordStrengthCriterium["SPECIAL_CHARACTERS"] = "SPECIAL_CHARACTERS";
})(PasswordStrengthCriterium || (exports.PasswordStrengthCriterium = PasswordStrengthCriterium = {}));
const createClientErrorBean = (content) => (Object.assign({ _t: "ClientErrorBean" }, content));
exports.createClientErrorBean = createClientErrorBean;
const createCoreConfig = (content) => (Object.assign({ _t: "CoreConfig" }, content));
exports.createCoreConfig = createCoreConfig;
const createKeyParametersBean = (content) => (Object.assign({ _t: "KeyParametersBean" }, content));
exports.createKeyParametersBean = createKeyParametersBean;
const createNullBean = (content) => (Object.assign({ _t: "NullBean" }, content));
exports.createNullBean = createNullBean;
const createTimestampBean = (content) => (Object.assign({ _t: "TimestampBean" }, content));
exports.createTimestampBean = createTimestampBean;
const createTemplateMasterBean = (content) => (Object.assign({ _t: "TemplateMasterBean" }, content));
exports.createTemplateMasterBean = createTemplateMasterBean;
const createIOClientToServerCoreBean = (content) => (Object.assign({ _t: "IOClientToServerCoreBean" }, content));
exports.createIOClientToServerCoreBean = createIOClientToServerCoreBean;
const createFragment = (content) => (Object.assign({ _t: "Fragment" }, content));
exports.createFragment = createFragment;
var Comparator;
(function (Comparator) {
    Comparator["EQUAL"] = "EQUAL";
    Comparator["NOT_EQUAL"] = "NOT_EQUAL";
    Comparator["GREATER"] = "GREATER";
    Comparator["GREATER_OR_EQUAL"] = "GREATER_OR_EQUAL";
    Comparator["SMALLER"] = "SMALLER";
    Comparator["SMALLER_OR_EQUAL"] = "SMALLER_OR_EQUAL";
})(Comparator || (exports.Comparator = Comparator = {}));
const createNoParametersBean = (content) => (Object.assign({ _t: "NoParametersBean" }, content));
exports.createNoParametersBean = createNoParametersBean;
const createStoreConnectionErrorBean = (content) => (Object.assign({ _t: "StoreConnectionErrorBean" }, content));
exports.createStoreConnectionErrorBean = createStoreConnectionErrorBean;
var ClientToServerStoreMessage;
(function (ClientToServerStoreMessage) {
    ClientToServerStoreMessage["CONNECT"] = "CONNECT";
    ClientToServerStoreMessage["DISCONNECT"] = "DISCONNECT";
    ClientToServerStoreMessage["INSERT"] = "INSERT";
    ClientToServerStoreMessage["REMOVE"] = "REMOVE";
    ClientToServerStoreMessage["UPDATE"] = "UPDATE";
})(ClientToServerStoreMessage || (exports.ClientToServerStoreMessage = ClientToServerStoreMessage = {}));
const createFragmentList = (content) => (Object.assign({ _t: "FragmentList" }, content));
exports.createFragmentList = createFragmentList;
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
const createServerToClientAuthenticationBean = (content) => (Object.assign({ _t: "ServerToClientAuthenticationBean" }, content));
exports.createServerToClientAuthenticationBean = createServerToClientAuthenticationBean;
const createMessageBean = (content) => (Object.assign({ _t: "MessageBean" }, content));
exports.createMessageBean = createMessageBean;
const createStoreConnectedBean = (content) => (Object.assign({ _t: "StoreConnectedBean" }, content));
exports.createStoreConnectedBean = createStoreConnectedBean;
const createIOPingPongBean = (content) => (Object.assign({ _t: "IOPingPongBean" }, content));
exports.createIOPingPongBean = createIOPingPongBean;
const createClientToServerAuthenticationBean = (content) => (Object.assign({ _t: "ClientToServerAuthenticationBean" }, content));
exports.createClientToServerAuthenticationBean = createClientToServerAuthenticationBean;
const createFolderPseudoBean = (content) => (Object.assign({ _t: "FolderPseudoBean" }, content));
exports.createFolderPseudoBean = createFolderPseudoBean;
const createIOServerToClientCoreBean = (content) => (Object.assign({ _t: "IOServerToClientCoreBean" }, content));
exports.createIOServerToClientCoreBean = createIOServerToClientCoreBean;
const createGTest = (content) => (Object.assign({ _t: "GTest" }, content));
exports.createGTest = createGTest;
var IOCoreEndpoints;
(function (IOCoreEndpoints) {
    IOCoreEndpoints["CORE"] = "CORE";
    IOCoreEndpoints["STORE"] = "STORE";
})(IOCoreEndpoints || (exports.IOCoreEndpoints = IOCoreEndpoints = {}));
var ServerStoreMessage;
(function (ServerStoreMessage) {
    ServerStoreMessage["UPDATE"] = "UPDATE";
})(ServerStoreMessage || (exports.ServerStoreMessage = ServerStoreMessage = {}));
var CoreMessage;
(function (CoreMessage) {
    CoreMessage["PING"] = "PING";
    CoreMessage["PONG"] = "PONG";
    CoreMessage["AUTHENTICATE"] = "AUTHENTICATE";
    CoreMessage["VALIDATION"] = "VALIDATION";
    CoreMessage["MESSAGE"] = "MESSAGE";
    CoreMessage["CLIENT_ERROR"] = "CLIENT_ERROR";
})(CoreMessage || (exports.CoreMessage = CoreMessage = {}));
const createConcretisedArrayBean = (content) => (Object.assign({ _t: "ConcretisedArrayBean" }, content));
exports.createConcretisedArrayBean = createConcretisedArrayBean;
const createArrayBean = (content) => (Object.assign({ _t: "ArrayBean" }, content));
exports.createArrayBean = createArrayBean;
var ServerToClientStoreMessage;
(function (ServerToClientStoreMessage) {
    ServerToClientStoreMessage["CONNECTED"] = "CONNECTED";
    ServerToClientStoreMessage["CONNECTION_ERROR"] = "CONNECTION_ERROR";
    ServerToClientStoreMessage["POPULATE"] = "POPULATE";
    ServerToClientStoreMessage["UPDATE"] = "UPDATE";
    ServerToClientStoreMessage["DISCONNECT_FORCEFULLY"] = "DISCONNECT_FORCEFULLY";
    ServerToClientStoreMessage["VALIDATION"] = "VALIDATION";
})(ServerToClientStoreMessage || (exports.ServerToClientStoreMessage = ServerToClientStoreMessage = {}));
var ServerIdents;
(function (ServerIdents) {
    ServerIdents["MAIN"] = "MAIN";
})(ServerIdents || (exports.ServerIdents = ServerIdents = {}));
var FragmentType;
(function (FragmentType) {
    FragmentType["CREATE_ITEM"] = "c";
    FragmentType["MODIFY_ITEM"] = "m";
    FragmentType["REMOVE_ITEM"] = "r";
    FragmentType["CREATE_BEAN"] = "b";
    FragmentType["REMOVE_BEAN"] = "d";
})(FragmentType || (exports.FragmentType = FragmentType = {}));
const createIOServerToClientStoreBean = (content) => (Object.assign({ _t: "IOServerToClientStoreBean" }, content));
exports.createIOServerToClientStoreBean = createIOServerToClientStoreBean;
const createIOClientToServerStoreBean = (content) => (Object.assign({ _t: "IOClientToServerStoreBean" }, content));
exports.createIOClientToServerStoreBean = createIOClientToServerStoreBean;
const createFragmentAction = (content) => (Object.assign({ _t: "FragmentAction" }, content));
exports.createFragmentAction = createFragmentAction;
const createFragmentUpdateBean = (content) => (Object.assign({ _t: "FragmentUpdateBean" }, content));
exports.createFragmentUpdateBean = createFragmentUpdateBean;
var FragmentActionType;
(function (FragmentActionType) {
    FragmentActionType["ADD"] = "ADD";
    FragmentActionType["UPDATE"] = "UPDATE";
    FragmentActionType["REMOVE"] = "REMOVE";
})(FragmentActionType || (exports.FragmentActionType = FragmentActionType = {}));
//# sourceMappingURL=Beans.js.map