import "mocha";
import { deserialise } from "../src/lib/client/serialisation/Deserialisation";
import { serialise } from "../src/lib/client/serialisation/Serialisation";

describe("Deserialisation", () => {
    it("from server", () => {


        const json = "{\"standardEnumVar\":\"ONE\",\"stringVar\":\"10string\",\"longVar\":7,\"doubleVar\":8.0,\"floatVar\":9.0,\"arrayIntegerVar\":[\"_array\",11,12],\"boolVar\":false,\"createdTimestamp\":1715106150,\"intVar\":6,\"arrayBeanVar\":[\"_array\",{\"uid\":\"uid2\",\"stringVar\":\"string21\",\"_t\":\"TestBean2\",\"createdTimestamp\":1715106150,\"modifiedTimestamp\":1715106150,\"touchedTimestamp\":1715106150},{\"uid\":\"uid3\",\"stringVar\":\"string22\",\"_t\":\"TestBean2\",\"createdTimestamp\":1715106150,\"modifiedTimestamp\":1715106150,\"touchedTimestamp\":1715106150}],\"arrayLongVar\":[\"_array\",13,14],\"arrayFloatVar\":[\"_array\",17.0,18.0],\"stringEnumVar\":\"tHree\",\"touchedTimestamp\":1715106150,\"uid\":\"uid0\",\"beanVar\":{\"standardEnumVar\":\"ONE\",\"stringVar\":\"5string\",\"longVar\":2,\"doubleVar\":3.0,\"floatVar\":4.0,\"boolVar\":true,\"createdTimestamp\":1715106150,\"intVar\":1,\"stringEnumVar\":\"tHree\",\"touchedTimestamp\":1715106150,\"uid\":\"uid1\",\"_t\":\"TestBean1\",\"modifiedTimestamp\":1715106150,\"integerEnumVar\":2},\"arrayBooleanVar\":[\"_array\",true,false],\"_t\":\"TestBean0\",\"arrayStringVar\":[\"_array\",\"string19\",\"string20\"],\"modifiedTimestamp\":1715106150,\"arrayDoubleVar\":[\"_array\",15.0,16.0],\"integerEnumVar\":2}\n"

        const bean = deserialise(json);

        const json1 = serialise(bean);

        console.log("JSON", json1);


    });

});
