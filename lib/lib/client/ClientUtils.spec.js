"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const ClientUtils_1 = require("./ClientUtils");
describe("Password Entropy", () => {
    it("entropy", () => {
        (0, chai_1.expect)((0, ClientUtils_1.passwordConformsToEntropy)("test", 20)).to.be.false;
        (0, chai_1.expect)((0, ClientUtils_1.passwordConformsToEntropy)("testtesttest", 60)).to.be.false;
        (0, chai_1.expect)((0, ClientUtils_1.passwordConformsToEntropy)("testA1", 50)).to.be.false;
        (0, chai_1.expect)((0, ClientUtils_1.passwordConformsToEntropy)("testtestA1$", 80)).to.be.false;
        (0, chai_1.expect)((0, ClientUtils_1.passwordConformsToEntropy)("testtesttesttesttestA1$", 150)).to.be.true;
    });
});
//# sourceMappingURL=ClientUtils.spec.js.map