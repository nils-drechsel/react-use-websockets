


export const deserialise = (json: string):any => {


    return JSON.parse(json, (_key, value) => {


        if (Array.isArray(value)) {

            if (value.length === 0) {
                throw new Error("array without head element: " + value);
            }

            if (value[0] === "_map") {
                return new Map(value.slice(1));

            } else if (value[0] === "_set") {
                return new Set(value.slice(1));

            } else if (value[0] === "_array") {
                return value.slice(1);
            } else {
                return value;
            }

        } else return value;
    });


}




