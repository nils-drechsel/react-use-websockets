"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeFragments = void 0;
const Beans_1 = require("../../beans/Beans");
const Deserialisation_1 = require("../serialisation/Deserialisation");
const mergeFragments = (bean, fragmentList) => {
    bean = structuredClone(bean);
    console.log("starting bean", bean);
    fragmentList.fragments.forEach(fragment => {
        let base = bean;
        if (fragment.type === Beans_1.FragmentType.CREATE_BEAN) {
            bean = (0, Deserialisation_1.deserialise)(fragment.jsonPayload);
            console.log("creating new bean", bean);
            return;
        }
        if (fragment.type === Beans_1.FragmentType.REMOVE_BEAN) {
            bean = undefined;
            console.log("removing bean");
            return;
        }
        fragment.path.forEach((p, index) => {
            if (index === fragment.path.length - 1) {
                if (fragment.type === Beans_1.FragmentType.CREATE_ITEM || fragment.type === Beans_1.FragmentType.MODIFY_ITEM) {
                    if (base instanceof Map) {
                        base.set(p, (0, Deserialisation_1.deserialise)(fragment.jsonPayload));
                    }
                    else if (Array.isArray(base)) {
                        const i = parseInt(p);
                        if (fragment.type === Beans_1.FragmentType.CREATE_ITEM) {
                            if (i !== base.length)
                                throw new Error("fragment array index " + i + " doesn't match base array");
                            base.push((0, Deserialisation_1.deserialise)(fragment.jsonPayload));
                        }
                        else {
                            const i = parseInt(p);
                            if (i >= base.length)
                                throw new Error("fragment array index " + i + " doesn't match base array");
                            base[i] = (0, Deserialisation_1.deserialise)(fragment.jsonPayload);
                        }
                    }
                    else {
                        base[p] = (0, Deserialisation_1.deserialise)(fragment.jsonPayload);
                    }
                }
                else {
                    if (base instanceof Map) {
                        base.delete(p);
                    }
                    else if (Array.isArray(base)) {
                        base.splice(parseInt(p));
                    }
                    else {
                        delete base[p];
                    }
                }
            }
            else {
                if (base instanceof Map) {
                    base = base.get(p);
                }
                else if (Array.isArray(base)) {
                    base = base[parseInt(p)];
                }
                else {
                    base = base[p];
                }
            }
        });
    });
    console.log("resulting bean", bean);
    return bean;
};
exports.mergeFragments = mergeFragments;
//# sourceMappingURL=FragmentMerger.js.map