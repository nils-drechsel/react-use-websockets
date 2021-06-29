import { PasswordStrengthCriterium } from "../store/beans/Beans";


export const getPasswordStrengthPoolSize = (criterium: PasswordStrengthCriterium) => {
    switch (criterium) {
        case PasswordStrengthCriterium.LOWERCASE: return 26;
        case PasswordStrengthCriterium.UPPERCASE: return 26;
        case PasswordStrengthCriterium.NUMBERS: return 10;
        case PasswordStrengthCriterium.SPECIAL_CHARACTERS: return 32;
        default: throw new Error("unknown password strength criterium " + criterium);
    }
}

export const getPasswordCriteriumPattern = (criterium: PasswordStrengthCriterium) => {
    switch (criterium) {
        case PasswordStrengthCriterium.LOWERCASE: return /[a-z]+/;
        case PasswordStrengthCriterium.UPPERCASE: return /[A-Z]+/;
        case PasswordStrengthCriterium.NUMBERS: return /[0-9]+/;
        case PasswordStrengthCriterium.SPECIAL_CHARACTERS: return /[\~'!@#$%^&*()-=_+[{\]}\\|;':",.<>/?]+/;
        default: throw new Error("unknown password strength criterium " + criterium);
    }
}



export const calculatePasswordEntropy = (pw: string) => {

    let poolSize = 0;
    const length = pw.length;

    for (const criterium of Object.values(PasswordStrengthCriterium)) {

        const pattern = getPasswordCriteriumPattern(criterium);
        if (pattern.test(pw)) {
            poolSize += getPasswordStrengthPoolSize(criterium);
        }

    }

    return length * Math.log2(poolSize);

}

export const passwordConformsToEntropy = (pw: string, minEntropy: number) => {
    return calculatePasswordEntropy(pw) >= minEntropy;
}