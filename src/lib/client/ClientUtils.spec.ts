import { expect } from "chai";
import "mocha";
import { passwordConformsToEntropy} from "./ClientUtils";

describe("Password Entropy", () => {
    it("entropy", () => {

        expect(passwordConformsToEntropy("test", 20)).to.be.false;
        expect(passwordConformsToEntropy("testtesttest", 60)).to.be.false;
        expect(passwordConformsToEntropy("testA1", 50)).to.be.false;
        expect(passwordConformsToEntropy("testtestA1$", 80)).to.be.false;
        expect(passwordConformsToEntropy("testtesttesttesttestA1$", 150)).to.be.true;

    });

});
