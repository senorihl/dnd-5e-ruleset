import { SourceLocation } from "./source";
import { ArrayAble } from "./utils";

interface BaseBackground {
  regExpSearch: RegExp;
  name: string;
  source: ArrayAble<SourceLocation>;
  gold: number;
  equipleft?: Array<[description: string, amount: string, weight: string]>;
  equipright?: Array<[description: string, amount: string, weight: string]>;
  feature: string;
  trait: string[];
  ideal: Array<[ideal: string, description: string]>;
  bond: string[];
  flaw: string[];
  extra?: [choicetxt: string, ...choices: string[]];

  toolProfs?: Array<
    [name: string, ability: string] | [name: string, adv: number] | string
  >;

  languageProfs?: Array<string | number>;

  variant?: string[];

  lifestyle?:
    | "wretched"
    | "squalid"
    | "poor"
    | "modest"
    | "comfortable"
    | "wealthy"
    | "aristocratic";
}

export interface FixedSkillsBackground extends BaseBackground {
  skills: string[];
}

export interface VaryingSkillsBackground extends BaseBackground {
  skillstxt: string;
}

export type BackgroundFeature = {
  description: string;
  source: ArrayAble<SourceLocation>;
};

export type Background = FixedSkillsBackground | VaryingSkillsBackground;
