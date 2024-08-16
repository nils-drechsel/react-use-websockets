"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fragmentToString = exports.fragmentalise = void 0;
const Beans_1 = require("../../beans/Beans");
const Serialisation_1 = require("../serialisation/Serialisation");
const fragmentalise = (existingBean, modifiedBean) => {
    const result = (0, Beans_1.createFragmentList)({
        fragments: [],
        fromVersion: existingBean.version,
        toVersion: modifiedBean.version,
    });
    traverseBean(existingBean, modifiedBean, [], result);
    return result;
};
exports.fragmentalise = fragmentalise;
const richTypes = { Date: true, RegExp: true, String: true, Number: true };
const isRichType = (obj) => {
    return richTypes[Object.getPrototypeOf(obj)?.constructor?.name];
};
const traverseBean = (existingBean, modifiedBean, path, fragmentList) => {
    for (const key in existingBean) {
        const existingObj = existingBean[key];
        if (existingObj === undefined) {
            continue;
        }
        const modifiedObj = key in modifiedBean
            ? modifiedBean[key]
            : undefined;
        compare(existingObj, modifiedObj, [...path, key], fragmentList);
    }
    for (const key in modifiedBean) {
        const modifiedObj = modifiedBean[key];
        if (modifiedObj === undefined) {
            continue;
        }
        if (!(key in existingBean) || existingBean[key] === undefined) {
            created(modifiedObj, [...path, key], fragmentList);
        }
    }
};
const traverseMap = (existingMap, modifiedMap, path, fragmentList) => {
    existingMap.forEach((existingObj, key) => {
        if (existingObj === undefined) {
            return;
        }
        const modifiedObj = modifiedMap.has(key)
            ? modifiedMap.get(key)
            : undefined;
        compare(existingObj, modifiedObj, [...path, key], fragmentList);
    });
    modifiedMap.forEach((modifiedObj, key) => {
        if (modifiedObj === undefined) {
            return;
        }
        if (!existingMap.has(key)) {
            created(modifiedObj, [...path, key], fragmentList);
        }
    });
};
const traverseArray = (existingArray, modifiedArray, path, fragmentList) => {
    for (let index = 0; index < existingArray.length; index++) {
        const existingObj = existingArray[index] !== undefined
            ? existingArray[index]
            : null;
        const modifiedObjIsRemoved = modifiedArray.length <= index;
        const modifiedObjIsUndefined = !modifiedObjIsRemoved && modifiedArray[index] === undefined;
        const modifiedObj = !modifiedObjIsRemoved
            ? (modifiedObjIsUndefined ? null : modifiedArray[index])
            : undefined;
        compare(existingObj, modifiedObj, [...path, "" + index], fragmentList);
        if (modifiedObjIsRemoved)
            break;
    }
    modifiedArray.forEach((modifiedObj, index) => {
        if (modifiedObj === undefined) {
            return;
        }
        if (!(existingArray.length > index)) {
            created(modifiedObj, [...path, "" + index], fragmentList);
        }
    });
};
const compare = (existingObj, modifiedObj, path, fragmentList) => {
    if (modifiedObj === undefined) {
        removed(path, fragmentList);
        return;
    }
    if (existingObj instanceof Map) {
        if (!(modifiedObj instanceof Map)) {
            modified(modifiedObj, path, fragmentList);
        }
        else {
            traverseMap(existingObj, modifiedObj, path, fragmentList);
        }
    }
    else if (existingObj instanceof Set) {
        if (!(modifiedObj instanceof Set) || !areEqualSets(existingObj, modifiedObj)) {
            modified(modifiedObj, path, fragmentList);
        }
    }
    else if (Array.isArray(existingObj)) {
        if (!Array.isArray(modifiedObj)) {
            modified(modifiedObj, path, fragmentList);
        }
        else {
            traverseArray(existingObj, modifiedObj, path, fragmentList);
        }
    }
    else if (existingObj && typeof existingObj === "object" && !isRichType(existingObj)) {
        if (!modifiedObj || (typeof modifiedObj) !== "object" || isRichType(modifiedObj)) {
            modified(modifiedObj, path, fragmentList);
        }
        else {
            traverseBean(existingObj, modifiedObj, path, fragmentList);
        }
    }
    else {
        if (!areEqualValues(existingObj, modifiedObj)) {
            modified(modifiedObj, path, fragmentList);
        }
    }
};
const areCompatibleObjects = (obj0, obj1) => {
    return typeof obj0 === "object" && typeof obj1 === "object";
};
const setIntersection = (obj0, obj1) => {
    return new Set([...obj0].filter(x => obj1.has(x)));
};
const areEqualSets = (obj0, obj1) => {
    return obj0.size === obj1.size && setIntersection(obj0, obj1).size === obj0.size;
};
const areEqualValues = (obj0, obj1) => {
    return !(obj0 !== obj1 &&
        // treat NaN values as equivalent
        !(Number.isNaN(obj0) && Number.isNaN(obj1)) &&
        !(areCompatibleObjects(obj0, obj1) &&
            (isNaN(obj0)
                ? obj0 + "" === obj1 + ""
                : +obj0 === +obj1)));
};
const removed = (path, fragmentList) => {
    fragmentList.fragments.push((0, Beans_1.createFragment)({
        type: Beans_1.FragmentType.REMOVE_ITEM,
        path: path,
    }));
};
const modified = (value, path, fragmentList) => {
    fragmentList.fragments.push((0, Beans_1.createFragment)({
        type: Beans_1.FragmentType.MODIFY_ITEM,
        path: path,
        jsonPayload: (0, Serialisation_1.serialise)(value)
    }));
};
const created = (value, path, fragmentList) => {
    fragmentList.fragments.push((0, Beans_1.createFragment)({
        type: Beans_1.FragmentType.CREATE_ITEM,
        path: path,
        jsonPayload: (0, Serialisation_1.serialise)(value)
    }));
};
const fragmentToString = (fragmentList) => {
    fragmentList.fragments.forEach(fragment => {
        console.log("type:", fragment.type, "path:", fragment.path, "json:", fragment.jsonPayload);
    });
};
exports.fragmentToString = fragmentToString;
//# sourceMappingURL=Fragmentaliser.js.map