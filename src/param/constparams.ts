import { statApiHerf, surveyUrlCN, surveyUrlEN } from "../localconfig";
import * as vscode from "vscode";
import { localeCN } from "../locales/localeCN";
import { localeEN } from "../locales/localeEN";

export const extensionId = "aminer.codegeex";
export const extensionVersion = "1.1.2";
export const myScheme = "codegeex";

//api to do the statistics of data
export const apiHerf = statApiHerf;

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

//locale language
export const locale = vscode.env.language;

export const surveyUrl = locale === "zh-cn" ? surveyUrlCN : surveyUrlEN;
export const localeTag = locale === "zh-cn" ? localeCN : localeEN;
