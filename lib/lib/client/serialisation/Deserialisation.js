"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeanDeserialiser = exports.Deserialiser = void 0;
const Serialisation_1 = require("./Serialisation");
class Deserialiser {
    constructor(signatures) {
        this.deserialisers = new Map();
        if (signatures) {
            signatures.forEach((signature, beanName) => {
                this.deserialisers.set(beanName, new BeanDeserialiser(signature));
            });
        }
    }
    deserialise(bean) {
        if (bean && bean._t && this.deserialisers.has(bean._t)) {
            return this.deserialisers.get(bean._t).deserialise(bean);
        }
        else {
            return bean;
        }
    }
}
exports.Deserialiser = Deserialiser;
class BeanDeserialiser {
    constructor(signature) {
        this.signature = signature;
    }
    deserialise(bean) {
        const clone = Object.assign({}, bean);
        this.signature.forEach((entity) => {
            deserialiseBeanProperty(clone, entity.path, entity.type);
        });
        return clone;
    }
}
exports.BeanDeserialiser = BeanDeserialiser;
exports.default = Deserialiser;
const deserialiseSet = (array) => {
    const set = new Set();
    if (array === null || array === undefined)
        return array;
    array.forEach((value) => set.add(value));
    return set;
};
const deserialiseMap = (obj) => {
    const map = new Map();
    if (obj === null || obj === undefined)
        return obj;
    for (const [key, value] of Object.entries(obj)) {
        map.set(key, value);
    }
    return map;
};
const deserialiseMapProperty = (map, path, type) => {
    if (path.length == 1) {
        switch (type) {
            case Serialisation_1.SerialisationEntity.MAP:
                map.forEach((value, key, map) => {
                    map.set(key, deserialiseMap(value));
                });
                break;
            case Serialisation_1.SerialisationEntity.SET:
                map.forEach((value, key, map) => {
                    map.set(key, deserialiseSet(value));
                });
                break;
            default:
                throw new Error("unknown serialisation entity " + type);
        }
    }
    else {
        const newPath = path.slice(1);
        if (newPath[0] === Serialisation_1.SerialisationTarget.MAP) {
            map.forEach((value) => {
                deserialiseMapProperty(value, newPath, type);
            });
        }
        else if (newPath[0] === Serialisation_1.SerialisationTarget.SET) {
            map.forEach((value) => {
                deserialiseSetProperty(value, newPath, type);
            });
        }
        else {
            map.forEach((value) => {
                deserialiseBeanProperty(value, newPath, type);
            });
        }
    }
};
const deserialiseSetProperty = (set, path, type) => {
    if (path.length == 1) {
        const newSet = new Set();
        switch (type) {
            case Serialisation_1.SerialisationEntity.MAP:
                set.forEach((value) => {
                    newSet.add(deserialiseMap(value));
                });
                break;
            case Serialisation_1.SerialisationEntity.SET:
                set.forEach((value) => {
                    newSet.add(deserialiseSet(value));
                });
                break;
            default:
                throw new Error("unknown serialisation entity " + type);
        }
        set.clear();
        newSet.forEach((value) => {
            set.add(value);
        });
    }
    else {
        const newPath = path.slice(1);
        if (newPath[0] === Serialisation_1.SerialisationTarget.MAP) {
            set.forEach((value) => {
                deserialiseMapProperty(value, newPath, type);
            });
        }
        else if (newPath[0] === Serialisation_1.SerialisationTarget.SET) {
            set.forEach((value) => {
                deserialiseSetProperty(value, newPath, type);
            });
        }
        else {
            set.forEach((value) => {
                deserialiseBeanProperty(value, newPath, type);
            });
        }
    }
};
const deserialiseBeanProperty = (bean, path, type) => {
    const child = path[0];
    if (!bean[child])
        return;
    if (path.length == 1) {
        switch (type) {
            case Serialisation_1.SerialisationEntity.MAP:
                bean[child] = deserialiseMap(bean[child]);
                break;
            case Serialisation_1.SerialisationEntity.SET:
                bean[child] = deserialiseSet(bean[child]);
        }
    }
    else {
        const newPath = path.slice(1);
        if (newPath[0] === Serialisation_1.SerialisationTarget.MAP) {
            deserialiseMapProperty(bean[child], newPath, type);
        }
        else if (newPath[0] === Serialisation_1.SerialisationTarget.SET) {
            deserialiseSetProperty(bean[child], newPath, type);
        }
        else {
            deserialiseBeanProperty(bean[child], newPath, type);
        }
    }
};
//# sourceMappingURL=Deserialisation.js.map