"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const Serialisation_1 = require("../src/lib/client/serialisation/Serialisation");
describe("Serialisation", () => {
    it("map", () => {
        let bean = {
            subBean: {
                map0: new Map(),
                something0: "string0",
                map1: new Map(),
            },
            map: new Map(),
        };
        bean.subBean.map0.set("test0", "text0");
        bean.subBean.map0.set("test1", "text1");
        const subMap0 = new Map();
        subMap0.set("test2", "text2");
        subMap0.set("test3", "text3");
        const subMap1 = new Map();
        subMap1.set("test4", "text4");
        subMap1.set("test5", "text5");
        bean.subBean.map1.set("subtest0", subMap0);
        bean.subBean.map1.set("subtest1", subMap1);
        const bean1 = {
            subSubBean: {
                subSubMap0: new Map(),
            },
        };
        bean1.subSubBean.subSubMap0.set("test6", "text6");
        bean1.subSubBean.subSubMap0.set("test7", "text7");
        bean.map.set("submap0", bean1);
        const bean2 = {
            subSubBean: {
                subSubMap0: new Map(),
            },
        };
        bean2.subSubBean.subSubMap0.set("test8", "text8");
        bean2.subSubBean.subSubMap0.set("test9", "text9");
        bean.map.set("submap1", bean2);
        const json = (0, Serialisation_1.serialise)(bean);
        (0, chai_1.expect)(typeof json === "string").to.be.true;
    });
    it("set", () => {
        let bean = {
            subBean: {
                set0: new Set(),
                something0: "string0",
                set1: new Set(),
            },
            set: new Set(),
        };
        bean.subBean.set0.add("test0");
        bean.subBean.set0.add("test1");
        const subSet0 = new Set();
        subSet0.add("test2");
        subSet0.add("test3");
        const subSet1 = new Set();
        subSet1.add("test4");
        subSet1.add("test5");
        bean.subBean.set1.add(subSet0);
        bean.subBean.set1.add(subSet1);
        const bean1 = {
            subSubBean: {
                subSubSet0: new Set(),
            },
        };
        bean1.subSubBean.subSubSet0.add("test6");
        bean1.subSubBean.subSubSet0.add("test7");
        bean.set.add(bean1);
        const bean2 = {
            subSubBean: {
                subSubSet0: new Set(),
            },
        };
        bean2.subSubBean.subSubSet0.add("test8");
        bean2.subSubBean.subSubSet0.add("test9");
        bean.set.add(bean2);
        const json = (0, Serialisation_1.serialise)(bean);
        (0, chai_1.expect)(typeof json === "string").to.be.true;
    });
});
//# sourceMappingURL=Serialisation.test.js.map