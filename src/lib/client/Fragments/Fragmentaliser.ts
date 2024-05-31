import { AbstractIOBean, FragmentList, FragmentType, createFragment, createFragmentList, } from "../../beans/Beans";
import { serialise } from "../serialisation/Serialisation";




export const fragmentalise = (existingBean: AbstractIOBean, modifiedBean: AbstractIOBean): FragmentList => {

    const result: FragmentList = createFragmentList({
        fragments: []
    });

    traverseBean(existingBean, modifiedBean, [], result);

    return result;

}

const richTypes = { Date: true, RegExp: true, String: true, Number: true };

const isRichType = (obj: any): boolean => {
    return richTypes[Object.getPrototypeOf(obj)?.constructor?.name as never];
}

const traverseBean = (existingBean: AbstractIOBean, modifiedBean: AbstractIOBean, path: Array<string>, fragmentList: FragmentList) => {

    for (const key in existingBean) {

        const existingObj: any = existingBean[key as never];

        if (existingObj === undefined) {
            continue;
        }
        
        const modifiedObj: any = key in modifiedBean
            ? modifiedBean[key as never]
            : undefined;

        compare (existingObj, modifiedObj, [...path, key], fragmentList)
    }

    for (const key in modifiedBean) {

        const modifiedObj: any = modifiedBean[key as never];
        if (modifiedObj === undefined) {
            continue;
        }

        if (!(key in existingBean) || existingBean[key as never]=== undefined) {
            created(modifiedObj, [...path, key], fragmentList);
        }
    }

}



const traverseMap = (existingMap: Map<string, any>, modifiedMap: Map<string, any>, path: Array<string>, fragmentList: FragmentList) => {

    existingMap.forEach((existingObj, key) => {

        if (existingObj === undefined) {
            return;
        }
        
        const modifiedObj: any = modifiedMap.has(key)
            ? modifiedMap.get(key)
            : undefined;

        compare (existingObj, modifiedObj, [...path, key], fragmentList)
    });

    modifiedMap.forEach((modifiedObj, key) => {

        if (modifiedObj === undefined) {
            return;
        }

        if (!existingMap.has(key)) {
            created(modifiedObj, [...path, key], fragmentList);
        }
    });

}

const traverseArray = (existingArray: Array<any>, modifiedArray: Array<any>, path: Array<string>, fragmentList: FragmentList) => {

    for (let index = 0; index < existingArray.length; index++) {
        const existingObj = existingArray[index] !== undefined
            ? existingArray[index]
            : null;

        const modifiedObjIsRemoved = modifiedArray.length <= index
        const modifiedObjIsUndefined = !modifiedObjIsRemoved && modifiedArray[index] === undefined

        const modifiedObj: any = !modifiedObjIsRemoved
            ? (modifiedObjIsUndefined ? null : modifiedArray[index])
            : undefined;

        compare (existingObj, modifiedObj, [...path, "" + index], fragmentList)

        if (modifiedObjIsRemoved) break;
    }

    modifiedArray.forEach((modifiedObj, index) => {

        if (modifiedObj === undefined) {
            return;
        }

        if (!(existingArray.length > index)) {
            created(modifiedObj, [...path, "" + index], fragmentList);
        }
    });

}






const compare = (existingObj: any, modifiedObj: any, path: Array<string>, fragmentList: FragmentList) => {

    if (modifiedObj === undefined) {
        removed(path, fragmentList);
        return;
    }

    if (existingObj instanceof Map) {

        if (!(modifiedObj instanceof Map)) {
            modified(modifiedObj, path, fragmentList);
        } else {
            traverseMap(existingObj, modifiedObj, path, fragmentList);
        }
        
    } else if (existingObj instanceof Set) {

        if (!(modifiedObj instanceof Set) || !areEqualSets(existingObj, modifiedObj)) {
            modified(modifiedObj, path, fragmentList);
        }

    } else if (Array.isArray(existingObj)) {


        if (!Array.isArray(modifiedObj)) {
            modified(modifiedObj, path, fragmentList);
        } else {
            traverseArray(existingObj, modifiedObj, path, fragmentList);
        }

    } else if (existingObj && typeof existingObj === "object" && !isRichType(existingObj)) {

        if (!modifiedObj || (typeof modifiedObj) !== "object" || isRichType(modifiedObj)) {
            modified(modifiedObj, path, fragmentList);
        } else {
            traverseBean(existingObj, modifiedObj, path, fragmentList);
        }

    } else {
        if (!areEqualValues(existingObj, modifiedObj)) {
            modified(modifiedObj, path, fragmentList);
        }
    }



}

const areCompatibleObjects = (obj0: any, obj1: any) => {
    return typeof obj0 === "object" && typeof obj1 === "object"
}

const setIntersection = (obj0: Set<any>, obj1: Set<any>) => {
    return new Set([...obj0].filter(x => obj1.has(x)));
}


const areEqualSets = (obj0: Set<any>, obj1: Set<any>): boolean => {
    return obj0.size === obj1.size && setIntersection(obj0, obj1).size === obj0.size;
}



const areEqualValues = (obj0: any, obj1: any): boolean => {
    return !(obj0 !== obj1 &&
			// treat NaN values as equivalent
			!(Number.isNaN(obj0) && Number.isNaN(obj1)) &&
			!(
				areCompatibleObjects(obj0, obj1) &&
				(isNaN(obj0)
					? obj0 + "" === obj1 + ""
					: +obj0 === +obj1)
            )
        )
}



const removed = (path: Array<string>, fragmentList: FragmentList) => {

    fragmentList.fragments.push(createFragment({
        type: FragmentType.REMOVE,
        path: path,
    }))

}


const modified = (value: any, path: Array<string>, fragmentList: FragmentList) => {

    fragmentList.fragments.push(createFragment({
        type: FragmentType.MODIFY,
        path: path,
        jsonPayload: serialise(value)
    }))

}

const created = (value: any, path: Array<string>, fragmentList: FragmentList) => {

    fragmentList.fragments.push(createFragment({
        type: FragmentType.CREATE,
        path: path,
        jsonPayload: serialise(value)
    }))

}




export const fragmentToString = (fragmentList: FragmentList) => {

    fragmentList.fragments.forEach(fragment => {

        console.log("type:" , fragment.type, "path:", fragment.path, "json:", fragment.jsonPayload);
        
    });

}