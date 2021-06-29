import { PasswordStrengthCriterium } from "../store/beans/Beans";
export declare const getPasswordStrengthPoolSize: (criterium: PasswordStrengthCriterium) => 26 | 10 | 32;
export declare const getPasswordCriteriumPattern: (criterium: PasswordStrengthCriterium) => RegExp;
export declare const calculatePasswordEntropy: (pw: string) => number;
export declare const passwordConformsToEntropy: (pw: string, minEntropy: number) => boolean;
