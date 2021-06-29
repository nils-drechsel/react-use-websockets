"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordConformsToEntropy = exports.calculatePasswordEntropy = exports.getPasswordCriteriumPattern = exports.getPasswordStrengthPoolSize = void 0;
const Beans_1 = require("../store/beans/Beans");
const getPasswordStrengthPoolSize = (criterium) => {
    switch (criterium) {
        case Beans_1.PasswordStrengthCriterium.LOWERCASE: return 26;
        case Beans_1.PasswordStrengthCriterium.UPPERCASE: return 26;
        case Beans_1.PasswordStrengthCriterium.NUMBERS: return 10;
        case Beans_1.PasswordStrengthCriterium.SPECIAL_CHARACTERS: return 32;
        default: throw new Error("unknown password strength criterium " + criterium);
    }
};
exports.getPasswordStrengthPoolSize = getPasswordStrengthPoolSize;
const getPasswordCriteriumPattern = (criterium) => {
    switch (criterium) {
        case Beans_1.PasswordStrengthCriterium.LOWERCASE: return /[a-z]+/;
        case Beans_1.PasswordStrengthCriterium.UPPERCASE: return /[A-Z]+/;
        case Beans_1.PasswordStrengthCriterium.NUMBERS: return /[0-9]+/;
        case Beans_1.PasswordStrengthCriterium.SPECIAL_CHARACTERS: return /[\~'!@#$%^&*()-=_+[{\]}\\|;':",.<>/?]+/;
        default: throw new Error("unknown password strength criterium " + criterium);
    }
};
exports.getPasswordCriteriumPattern = getPasswordCriteriumPattern;
const calculatePasswordEntropy = (pw) => {
    let poolSize = 0;
    const length = pw.length;
    for (const criterium of Object.values(Beans_1.PasswordStrengthCriterium)) {
        const pattern = exports.getPasswordCriteriumPattern(criterium);
        if (pattern.test(pw)) {
            poolSize += exports.getPasswordStrengthPoolSize(criterium);
        }
    }
    return length * Math.log2(poolSize);
};
exports.calculatePasswordEntropy = calculatePasswordEntropy;
const passwordConformsToEntropy = (pw, minEntropy) => {
    return exports.calculatePasswordEntropy(pw) >= minEntropy;
};
exports.passwordConformsToEntropy = passwordConformsToEntropy;
//# sourceMappingURL=ClientUtils.js.map