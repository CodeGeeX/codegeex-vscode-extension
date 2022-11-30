import { tianqiApiKey, tianqiApiSecret,statsHerf } from "../localconfig";

export const extensionId = "aminer.codegeex";
export const extensionVersion = "1.0.7";
export const myScheme = "codegeex";

//configure the key and Secret of tianqi
export const apiKey = tianqiApiKey;
export const apiSecret = tianqiApiSecret;

//api to do the statistics of data
export const apiHerf = statsHerf;

//language accepted by the model
export const languageList = [
    "C++",
    "C",
    "C#",
    "Cuda",
    "Objective-C",
    "Objective-C++",
    "Python",
    "Java",
    "TeX",
    "HTML",
    "PHP",
    "JavaScript",
    "TypeScript",
    "Go",
    "Shell",
    "Rust",
    "CSS",
    "SQL",
    "R",
];

//const to replace specfic characters
export const comment = "<|comment|>";
export const addSignal = "<|add|>";
export const andSignal = "<|and|>";
export const hash = "<|hash|>";
