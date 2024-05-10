


export const serialise = (obj: any): string => {

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
        }
        
        return value;
    });


}
 