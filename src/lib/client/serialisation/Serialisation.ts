export enum SerialisationEntity {
    SET,
    MAP,
}

export enum SerialisationTarget {
    SET = "<set>",
    MAP = "<map>",
}

export interface SingleSerialisationSignature {
    path: Array<string>;
    type: SerialisationEntity;
}

export type BeanSerialisationSignature = Array<SingleSerialisationSignature>;

export class Serialiser {
    serialisers: Map<string, BeanSerialiser>;

    constructor(signatures?: Map<string, BeanSerialisationSignature>) {
        this.serialisers = new Map();
        if (signatures) {
            signatures.forEach((signature, beanName) => {
                this.serialisers.set(beanName, new BeanSerialiser(signature));
            });
        }
    }

    serialise(bean: any): any {
        if (bean && bean._t && this.serialisers.has(bean._t)) {
            return this.serialisers.get(bean._t)!.serialise(bean);
        } else {
            return bean;
        }
    }
}

export class BeanSerialiser {
    private signature: BeanSerialisationSignature;

    constructor(signature: BeanSerialisationSignature) {
        this.signature = signature;
    }

    serialise(bean: any): any {
        const clone = Object.assign({}, bean);

        this.signature.forEach((entity) => {
            serialiseBeanProperty(clone, entity.path, entity.type);
        });

        return clone;
    }
}

export default Serialiser;

const serialiseSet = <T>(set: Set<T> | null | undefined): Array<T> | null | undefined => {
    const array: Array<T> = [];
    if (set === null || set === undefined) return set;
    set.forEach((value) => array.push(value));
    return array;
};

const serialiseMap = <T>(map: Map<string, T> | null | undefined): { [key: string]: T } | null | undefined => {
    const obj: { [key: string]: T } = {};
    if (map === null || map === undefined) return map;
    map.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
};

const serialiseObjectProperty = (obj: { [key: string]: any }, path: Array<string>, type: SerialisationEntity) => {
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
    } else {
        const newPath = path.slice(1);
        if (newPath[0] === SerialisationTarget.MAP) {
            for (const [, value] of Object.entries(obj)) {
                serialiseObjectProperty(value as { [key: string]: any }, newPath, type);
            }
        } else if (newPath[0] === SerialisationTarget.SET) {
            for (const [, value] of Object.entries(obj)) {
                serialiseArrayProperty(value as Array<any>, newPath, type);
            }
        } else {
            for (const [, value] of Object.entries(obj)) {
                serialiseBeanProperty(value, newPath, type);
            }
        }
    }
};

const serialiseArrayProperty = (array: Array<any>, path: Array<string>, type: SerialisationEntity) => {
    if (path.length == 1) {
        const newArray: Array<any> = [];
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
    } else {
        const newPath = path.slice(1);
        if (newPath[0] === SerialisationTarget.MAP) {
            array.forEach((value) => {
                serialiseObjectProperty(value as { [key: string]: any }, newPath, type);
            });
        } else if (newPath[0] === SerialisationTarget.SET) {
            array.forEach((value) => {
                serialiseArrayProperty(value as Array<any>, newPath, type);
            });
        } else {
            array.forEach((value) => {
                serialiseBeanProperty(value, newPath, type);
            });
        }
    }
};

const serialiseBeanProperty = (bean: any, path: Array<string>, type: SerialisationEntity) => {
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
    } else {
        const newPath = path.slice(1);
        if (newPath[0] === SerialisationTarget.MAP) {
            serialiseObjectProperty(bean[child] as { [key: string]: any }, newPath, type);
        } else if (newPath[0] === SerialisationTarget.SET) {
            serialiseArrayProperty(bean[child] as Array<any>, newPath, type);
        } else {
            serialiseBeanProperty(bean[child], newPath, type);
        }
    }
};
