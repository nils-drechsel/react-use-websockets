import { PasswordStrengthCriterium } from "../store/beans/Beans";
export declare const getPasswordStrengthPoolSize: (criterium: PasswordStrengthCriterium) => 32 | 10 | 26;
export declare const getPasswordCriteriumPattern: (criterium: PasswordStrengthCriterium) => RegExp;
export declare const calculatePasswordEntropy: (pw: string) => number;
export declare const passwordConformsToEntropy: (pw: string, minEntropy: number) => boolean;
