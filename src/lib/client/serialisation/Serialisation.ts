


export const serialise2 = (obj: any): string => {

    return JSON.stringify(obj, (_key, value) => {
        if (value instanceof Map) {

            

            return {
                "_t": "Map",
                "values": Array.from(value.entries())
            }

        } else if (value instanceof Set) {

            return {
                "_t": "Set",
                "values": Array.from(value)
            }
        } else if (Array.isArray(value)) {

            return {
                "_t": "List",
                "values": Array.from(value)
            }

        }
        
        return value;
    });


}

export const serialise = (obj: any): string => {

    return JSON.stringify(obj, (_key, value) => {
        if (value instanceof Map) {

            const obj: { [key: string]: any } = {};
            value.forEach((value, key) => {
                obj[key] = value;
            });
            return obj;

        } else if (value instanceof Set) {
            return Array.from(value)
        } else if (Array.isArray(value)) {
            return Array.from(value)
        }
        
        return value;
    });


}
