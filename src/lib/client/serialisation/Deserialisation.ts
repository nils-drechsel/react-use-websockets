import { SerialisationEntity, BeanSerialisationSignature, SerialisationTarget } from "./Serialisation";

export class Deserialiser {
    deserialisers: Map<string, BeanDeserialiser>;

    constructor(signatures?: Map<string, BeanSerialisationSignature>) {
        this.deserialisers = new Map();
        if (signatures) {
            signatures.forEach((signature, beanName) => {
                this.deserialisers.set(beanName, new BeanDeserialiser(signature));
            });
        }
    }

    deserialise(bean: any): any {
        if (bean && bean._t && this.deserialisers.has(bean._t)) {
            return this.deserialisers.get(bean._t)!.deserialise(bean);
        } else {
            return bean;
        }
    }
}

export class BeanDeserialiser {
    private signature: BeanSerialisationSignature;

    constructor(signature: BeanSerialisationSignature) {
        this.signature = signature;
    }

    deserialise(bean: any): any {
        const clone = Object.assign({}, bean);

        this.signature.forEach((entity) => {
            deserialiseBeanProperty(clone, entity.path, entity.type);
        });

        return clone;
    }
}

export default Deserialiser;

const deserialiseSet = <T>(array: Array<T> | null | undefined): Set<T> | null | undefined => {
    const set: Set<T> = new Set();
    if (array === null || array === undefined) return array;
    array.forEach((value) => set.add(value));
    return set;
};

const deserialiseMap = <T>(obj: { [key: string]: T } | null | undefined): Map<string, T> | null | undefined => {
    const map: Map<string, T> = new Map();
    if (obj === null || obj === undefined) return obj;
    for (const [key, value] of Object.entries(obj)) {
        map.set(key, value);
    }
    return map;
};

const deserialiseMapProperty = (map: Map<string, any>, path: Array<string>, type: SerialisationEntity) => {
    if (path.length == 1) {
        switch (type) {
            case SerialisationEntity.MAP:
                map.forEach((value, key, map) => {
                    map.set(key, deserialiseMap(value));
                });
                break;
            case SerialisationEntity.SET:
                map.forEach((value, key, map) => {
                    map.set(key, deserialiseSet(value));
                });
                break;
            default:
                throw new Error("unknown serialisation entity " + type);
        }
    } else {
        const newPath = path.slice(1);
        if (newPath[0] === SerialisationTarget.MAP) {
            map.forEach((value) => {
                deserialiseMapProperty(value as Map<string, any>, newPath, type);
            });
        } else if (newPath[0] === SerialisationTarget.SET) {
            map.forEach((value) => {
                deserialiseSetProperty(value as Set<any>, newPath, type);
            });
        } else {
            map.forEach((value) => {
                deserialiseBeanProperty(value, newPath, type);
            });
        }
    }
};

const deserialiseSetProperty = (set: Set<any>, path: Array<string>, type: SerialisationEntity) => {
    if (path.length == 1) {
        const newSet: Set<any> = new Set();
        switch (type) {
            case SerialisationEntity.MAP:
                set.forEach((value) => {
                    newSet.add(deserialiseMap(value));
                });
                break;
            case SerialisationEntity.SET:
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
    } else {
        const newPath = path.slice(1);
        if (newPath[0] === SerialisationTarget.MAP) {
            set.forEach((value) => {
                deserialiseMapProperty(value as Map<string, any>, newPath, type);
            });
        } else if (newPath[0] === SerialisationTarget.SET) {
            set.forEach((value) => {
                deserialiseSetProperty(value as Set<any>, newPath, type);
            });
        } else {
            set.forEach((value) => {
                deserialiseBeanProperty(value, newPath, type);
            });
        }
    }
};

const deserialiseBeanProperty = (bean: any, path: Array<string>, type: SerialisationEntity) => {
    const child = path[0];
    if (!bean[child]) return;

    if (path.length == 1) {
        switch (type) {
            case SerialisationEntity.MAP:
                bean[child] = deserialiseMap(bean[child]);
                break;
            case SerialisationEntity.SET:
                bean[child] = deserialiseSet(bean[child]);
        }
    } else {
        const newPath = path.slice(1);
        if (newPath[0] === SerialisationTarget.MAP) {
            deserialiseMapProperty(bean[child] as Map<string, any>, newPath, type);
        } else if (newPath[0] === SerialisationTarget.SET) {
            deserialiseSetProperty(bean[child] as Set<any>, newPath, type);
        } else {
            deserialiseBeanProperty(bean[child], newPath, type);
        }
    }
};
