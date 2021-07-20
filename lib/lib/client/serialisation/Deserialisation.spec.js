"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const Deserialisation_1 = require("./Deserialisation");
const Serialisation_1 = require("./Serialisation");
describe("Deserialisation", () => {
    it("map", () => {
        let bean = {
            subBean: {
                map0: { test0: "text0", test1: "text1" },
                something0: "string0",
                map1: { subtest0: { test2: "text2", test3: "text3" }, subtest1: { test4: "text4", test5: "text5" } },
            },
            map: {
                submap0: {
                    subSubBean: { subSubMap0: { test6: "text6", test7: "text7" } },
                },
                submap1: {
                    subSubBean: { subSubMap0: { test8: "text8", test9: "text9" } },
                },
            },
        };
        const signature = [
            { path: ["subBean", "map0"], type: Serialisation_1.SerialisationEntity.MAP },
            { path: ["subBean", "map1"], type: Serialisation_1.SerialisationEntity.MAP },
            { path: ["subBean", "map1", "<map>"], type: Serialisation_1.SerialisationEntity.MAP },
            { path: ["map"], type: Serialisation_1.SerialisationEntity.MAP },
            { path: ["map", "<map>", "subSubBean", "subSubMap0"], type: Serialisation_1.SerialisationEntity.MAP },
        ];
        const s = new Deserialisation_1.BeanDeserialiser(signature);
        bean = s.deserialise(bean);
        chai_1.expect(bean.subBean.map0 instanceof Map).to.be.true;
        chai_1.expect(bean.subBean.map0.has("test0")).to.be.true;
        chai_1.expect(bean.subBean.map0.has("test1")).to.be.true;
        chai_1.expect(bean.subBean.map1 instanceof Map).to.be.true;
        chai_1.expect(bean.subBean.map1.has("subtest0")).to.be.true;
        chai_1.expect(bean.subBean.map1.get("subtest0").has("test2")).to.be.true;
        chai_1.expect(bean.subBean.map1.get("subtest0").has("test3")).to.be.true;
        chai_1.expect(bean.subBean.map1.has("subtest1")).to.be.true;
        chai_1.expect(bean.subBean.map1.get("subtest1").has("test4")).to.be.true;
        chai_1.expect(bean.subBean.map1.get("subtest1").has("test5")).to.be.true;
        chai_1.expect(bean.map instanceof Map).to.be.true;
        chai_1.expect(bean.map.has("submap0")).to.be.true;
        chai_1.expect(bean.map.get("submap0").subSubBean.subSubMap0 instanceof Map).to.be.true;
        chai_1.expect(bean.map.get("submap0").subSubBean.subSubMap0.has("test6")).to.be.true;
        chai_1.expect(bean.map.get("submap0").subSubBean.subSubMap0.has("test7")).to.be.true;
        chai_1.expect(bean.map.has("submap1")).to.be.true;
        chai_1.expect(bean.map.get("submap1").subSubBean.subSubMap0 instanceof Map).to.be.true;
        chai_1.expect(bean.map.get("submap1").subSubBean.subSubMap0.has("test8")).to.be.true;
        chai_1.expect(bean.map.get("submap1").subSubBean.subSubMap0.has("test9")).to.be.true;
    });
    it("set", () => {
        let bean = {
            subBean: {
                set0: ["test0", "test1"],
                something0: "string0",
                set1: [
                    ["test2", "test3"],
                    ["test4", "test5"],
                ],
            },
            set: [
                {
                    subSubBean: { subSubSet0: ["test6", "test7"] },
                },
                {
                    subSubBean: { subSubSet0: ["test8", "test9"] },
                },
            ],
        };
        const signature = [
            { path: ["subBean", "set0"], type: Serialisation_1.SerialisationEntity.SET },
            { path: ["subBean", "set1"], type: Serialisation_1.SerialisationEntity.SET },
            { path: ["subBean", "set1", "<set>"], type: Serialisation_1.SerialisationEntity.SET },
            { path: ["set"], type: Serialisation_1.SerialisationEntity.SET },
            { path: ["set", "<set>", "subSubBean", "subSubSet0"], type: Serialisation_1.SerialisationEntity.SET },
        ];
        const s = new Deserialisation_1.BeanDeserialiser(signature);
        bean = s.deserialise(bean);
        chai_1.expect(bean.subBean.set0 instanceof Set).to.be.true;
        chai_1.expect(bean.subBean.set0.has("test0")).to.be.true;
        chai_1.expect(bean.subBean.set0.has("test1")).to.be.true;
        chai_1.expect(bean.subBean.set1 instanceof Set).to.be.true;
        chai_1.expect(Array.from(bean.subBean.set1)[0].has("test2")).to.be.true;
        chai_1.expect(Array.from(bean.subBean.set1)[0].has("test3")).to.be.true;
        chai_1.expect(Array.from(bean.subBean.set1)[1].has("test4")).to.be.true;
        chai_1.expect(Array.from(bean.subBean.set1)[1].has("test5")).to.be.true;
        chai_1.expect(bean.set instanceof Set).to.be.true;
        chai_1.expect(Array.from(bean.set)[0].subSubBean.subSubSet0 instanceof Set).to.be.true;
        chai_1.expect(Array.from(bean.set)[0].subSubBean.subSubSet0.has("test6")).to.be.true;
        chai_1.expect(Array.from(bean.set)[0].subSubBean.subSubSet0.has("test7")).to.be.true;
        chai_1.expect(Array.from(bean.set)[1].subSubBean.subSubSet0 instanceof Set).to.be.true;
        chai_1.expect(Array.from(bean.set)[1].subSubBean.subSubSet0.has("test8")).to.be.true;
        chai_1.expect(Array.from(bean.set)[1].subSubBean.subSubSet0.has("test9")).to.be.true;
    });
});
//# sourceMappingURL=Deserialisation.spec.js.map