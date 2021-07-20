import { expect } from "chai";
import "mocha";
import { BeanSerialiser, BeanSerialisationSignature, SerialisationEntity } from "./Serialisation";

describe("Serialisation", () => {
    it("map", () => {
        let bean = {
            subBean: {
                map0: new Map(),
                something0: "string0",
                map1: new Map(),
            },
            map: new Map(),
        } as any;

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

        const signature: BeanSerialisationSignature = [
            { path: ["subBean", "map0"], type: SerialisationEntity.MAP },
            { path: ["subBean", "map1"], type: SerialisationEntity.MAP },
            { path: ["subBean", "map1", "<map>"], type: SerialisationEntity.MAP },
            { path: ["map"], type: SerialisationEntity.MAP },
            { path: ["map", "<map>", "subSubBean", "subSubMap0"], type: SerialisationEntity.MAP },
        ];

        const s = new BeanSerialiser(signature);

        bean = s.serialise(bean);

        expect(bean.subBean.map0 instanceof Map).to.be.false;
        expect("test0" in bean.subBean.map0).to.be.true;
        expect("test1" in bean.subBean.map0).to.be.true;

        expect(bean.subBean.map1 instanceof Map).to.be.false;
        expect("subtest0" in bean.subBean.map1).to.be.true;
        expect("test2" in bean.subBean.map1["subtest0"]).to.be.true;
        expect("test3" in bean.subBean.map1["subtest0"]).to.be.true;

        expect("subtest1" in bean.subBean.map1).to.be.true;
        expect("test4" in bean.subBean.map1["subtest1"]).to.be.true;
        expect("test5" in bean.subBean.map1["subtest1"]).to.be.true;

        expect(bean.map instanceof Map).to.be.false;
        expect("submap0" in bean.map).to.be.true;
        expect(bean.map["submap0"].subSubBean.subSubMap0 instanceof Map).to.be.false;
        expect("test6" in bean.map["submap0"].subSubBean.subSubMap0).to.be.true;
        expect("test7" in bean.map["submap0"].subSubBean.subSubMap0).to.be.true;

        expect("submap1" in bean.map).to.be.true;
        expect(bean.map["submap1"].subSubBean.subSubMap0 instanceof Map).to.be.false;
        expect("test8" in bean.map["submap1"].subSubBean.subSubMap0).to.be.true;
        expect("test9" in bean.map["submap1"].subSubBean.subSubMap0).to.be.true;
    });

    it("set", () => {
        let bean = {
            subBean: {
                set0: new Set(),
                something0: "string0",
                set1: new Set(),
            },
            set: new Set(),
        } as any;

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

        const signature: BeanSerialisationSignature = [
            { path: ["subBean", "set0"], type: SerialisationEntity.SET },
            { path: ["subBean", "set1"], type: SerialisationEntity.SET },
            { path: ["subBean", "set1", "<set>"], type: SerialisationEntity.SET },
            { path: ["set"], type: SerialisationEntity.SET },
            { path: ["set", "<set>", "subSubBean", "subSubSet0"], type: SerialisationEntity.SET },
        ];

        const s = new BeanSerialiser(signature);

        bean = s.serialise(bean);

        expect(bean.subBean.set0 instanceof Set).to.be.false;
        expect(bean.subBean.set0.includes("test0")).to.be.true;
        expect(bean.subBean.set0.includes("test1")).to.be.true;

        expect(bean.subBean.set1 instanceof Set).to.be.false;
        expect(bean.subBean.set1[0].includes("test2")).to.be.true;
        expect(bean.subBean.set1[0].includes("test3")).to.be.true;

        expect(bean.subBean.set1[1].includes("test4")).to.be.true;
        expect(bean.subBean.set1[1].includes("test5")).to.be.true;

        expect(bean.set instanceof Set).to.be.false;
        expect(bean.set[0].subSubBean.subSubSet0 instanceof Set).to.be.false;
        expect(bean.set[0].subSubBean.subSubSet0.includes("test6")).to.be.true;
        expect(bean.set[0].subSubBean.subSubSet0.includes("test7")).to.be.true;

        expect(bean.set[1].subSubBean.subSubSet0 instanceof Set).to.be.false;
        expect(bean.set[1].subSubBean.subSubSet0.includes("test8")).to.be.true;
        expect(bean.set[1].subSubBean.subSubSet0.includes("test9")).to.be.true;
    });
});
