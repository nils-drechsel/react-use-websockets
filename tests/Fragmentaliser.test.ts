import { expect } from "chai";
import "mocha";
import { fragmentalise } from "../src/lib/client/Fragments/Fragmentaliser";

describe("Fragmentalisation", () => {
    it("beans should be equal", () => {

        const bean0 = {
            _t: "bean0",
            string0: "string0",
            number0: 5,
            number1: 1.1,
            number2: NaN,
            subBean: {
                string1: "string1"
            },
            map0: (() => {const m = new Map(); m.set("key0", "value0"); m.set("key1", "value1"); return m;})(),
            set0: (() => {const m = new Set(); m.add("key0"); m.add("key1"); return m;})(),
            array0: ["a","b","c"],
            null0: null,
            undefined0: undefined
        }

        const fragments0 = fragmentalise(bean0, bean0);

        expect(fragments0.fragments.length === 0).to.be.true;
    });

    it("beans should not be equal", () => {

        const bean0 = {
            _t: "bean0",
            string0: "string0",
            number0: 5,
            number1: 1.1,
            number2: NaN,
            subBean: {
                string1: "string1"
            },
            map0: (() => {const m = new Map(); m.set("key0", "value0"); m.set("key1", "value1"); return m;})(),
            set0: (() => {const m = new Set(); m.add("key0"); m.add("key1"); return m;})(),
            array0: ["a","b","c"],
            null0: null,
            undefined0: undefined
        }

        const bean1 = {
            _t: "bean0",
            string0: "string1",
            number0: 7,
            number1: 1.2,
            number2: null,
            subBean: {
                string1: "string2"
            },
            map0: (() => {const m = new Map(); m.set("key0", "value2"); m.set("key1", "value3"); return m;})(),
            set0: (() => {const m = new Set(); m.add("key2"); m.add("key3"); return m;})(),
            array0: ["a","b","d"],
            null0: undefined,
            undefined0: null
        }

        const fragments0 = fragmentalise(bean0, bean1);

        expect(fragments0.fragments.length === 11).to.be.true;
    });


    it("maps should not be equal", () => {

        const bean0 = {
            _t: "bean0",
            subBean: {
                map0: (() => {const m = new Map(); m.set("key0", "value0"); m.set("key1", "value1"); return m;})(),
                map1: (() => {const m = new Map(); m.set("key0", "value0"); m.set("key1", "value1"); return m;})(),
            },
        }

        const bean1 = {
            _t: "bean0",
            subBean: {
                map0: (() => {const m = new Map(); m.set("key1", "value0"); m.set("key2", "value1"); return m;})(),
                map2: (() => {const m = new Map(); m.set("key0", "value0"); m.set("key1", "value1"); return m;})(),
            },
        }

        const fragments0 = fragmentalise(bean0, bean1);

        expect(fragments0.fragments.length === 5).to.be.true;
    });








});