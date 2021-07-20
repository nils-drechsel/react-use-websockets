"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeanSerialiser = exports.Serialiser = exports.SerialisationTarget = exports.SerialisationEntity = void 0;
var SerialisationEntity;
(function (SerialisationEntity) {
    SerialisationEntity[SerialisationEntity["SET"] = 0] = "SET";
    SerialisationEntity[SerialisationEntity["MAP"] = 1] = "MAP";
})(SerialisationEntity = exports.SerialisationEntity || (exports.SerialisationEntity = {}));
var SerialisationTarget;
(function (SerialisationTarget) {
    SerialisationTarget["SET"] = "<set>";
    SerialisationTarget["MAP"] = "<map>";
})(SerialisationTarget = exports.SerialisationTarget || (exports.SerialisationTarget = {}));
class Serialiser {
    constructor(signatures) {
        this.serialisers = new Map();
        if (signatures) {
            signatures.forEach((signature, beanName) => {
                this.serialisers.set(beanName, new BeanSerialiser(signature));
            });
        }
    }
    serialise(bean) {
        if (bean && bean._t && this.serialisers.has(bean._t)) {
            return this.serialisers.get(bean._t).serialise(bean);
        }
        else {
            return bean;
        }
    }
}
exports.Serialiser = Serialiser;
class BeanSerialiser {
    constructor(signature) {
        this.signature = signature;
    }
    serialise(bean) {
        const clone = Object.assign({}, bean);
        this.signature.forEach((entity) => {
            serialiseBeanProperty(clone, entity.path, entity.type);
        });
        return clone;
    }
}
exports.BeanSerialiser = BeanSerialiser;
exports.default = Serialiser;
const serialiseSet = (set) => {
    const array = [];
    if (set === null || set === undefined)
        return set;
    set.forEach((value) => array.push(value));
    return array;
};
const serialiseMap = (map) => {
    const obj = {};
    if (map === null || map === undefined)
        return map;
    map.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
};
const serialiseObjectProperty = (obj, path, type) => {
    if (path.length == 1) {
        switch (type) {
            case SerialisationEntity.MAP:
                for (const [key, value] of Object.entries(obj)) {
                    obj[key] = serialiseMap(value);
                }
                break;
            case SerialisationEntity.SET:
                for (const [key, value] of Object.entries(obj)) {
                    obj[key] = serialiseSet(value);
                }
                break;
            default:
                throw new Error("unknown serialisation entity " + type);
        }
    }
    else {
        const newPath = path.slice(1);
        if (newPath[0] === SerialisationTarget.MAP) {
            for (const [, value] of Object.entries(obj)) {
                serialiseObjectProperty(value, newPath, type);
            }
        }
        else if (newPath[0] === SerialisationTarget.SET) {
            for (const [, value] of Object.entries(obj)) {
                serialiseArrayProperty(value, newPath, type);
            }
        }
        else {
            for (const [, value] of Object.entries(obj)) {
                serialiseBeanProperty(value, newPath, type);
            }
        }
    }
};
const serialiseArrayProperty = (array, path, type) => {
    if (path.length == 1) {
        const newArray = [];
        switch (type) {
            case SerialisationEntity.MAP:
                array.forEach((value) => {
                    newArray.push(serialiseMap(value));
                });
                break;
            case SerialisationEntity.SET:
                array.forEach((value) => {
                    newArray.push(serialiseSet(value));
                });
                break;
            default:
                throw new Error("unknown serialisation entity " + type);
        }
        array.length = 0;
        newArray.forEach((value) => {
            array.push(value);
        });
    }
    else {
        const newPath = path.slice(1);
        if (newPath[0] === SerialisationTarget.MAP) {
            array.forEach((value) => {
                serialiseObjectProperty(value, newPath, type);
            });
        }
        else if (newPath[0] === SerialisationTarget.SET) {
            array.forEach((value) => {
                serialiseArrayProperty(value, newPath, type);
            });
        }
        else {
            array.forEach((value) => {
                serialiseBeanProperty(value, newPath, type);
            });
        }
    }
};
const serialiseBeanProperty = (bean, path, type) => {
    const child = path[0];
    if (!bean[child]) {
        return;
    }
    if (path.length == 1) {
        switch (type) {
            case SerialisationEntity.MAP:
                bean[child] = serialiseMap(bean[child]);
                break;
            case SerialisationEntity.SET:
                bean[child] = serialiseSet(bean[child]);
        }
    }
    else {
        const newPath = path.slice(1);
        if (newPath[0] === SerialisationTarget.MAP) {
            serialiseObjectProperty(bean[child], newPath, type);
        }
        else if (newPath[0] === SerialisationTarget.SET) {
            serialiseArrayProperty(bean[child], newPath, type);
        }
        else {
            serialiseBeanProperty(bean[child], newPath, type);
        }
    }
};
//# sourceMappingURL=Serialisation.js.map