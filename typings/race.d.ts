import { SourceLocation } from "./source";
import { ArrayAble, LevelArray, SpellCastingBonus } from "./utils";

declare enum Size {
  Gargantuan = 0,
  Huge = 1,
  Large = 2,
  Medium = 3,
  Small = 4,
  Tiny = 5,
}

export type Race = {
  regExpSearch: RegExp;
  name: string;
  sortname?: string;
  source: ArrayAble<SourceLocation>;
  plural: string;
  size: Array<Size>;
  speed: {
    walk: { spd: number | string; enc: number | string };
    climb?: { spd: number | string; enc: number | string };
    fly?: { spd: number | string; enc: number | string };
    swim?: { spd: number | string; enc: number | string };
    allModes?: string;
  };
  toolProfs?: Array<
    [name: string, ability: string] | [name: string, adv: number] | string
  >;
  languageProfs?: Array<string | number>;
  weapons?: string[];
  addarmor?: string;
  vision?: Array<
    [name: string, range: number] | [name: string, modifier: string]
  >;
  dmgres?: Array<string | [name: string, condition: string]>;
  savetxt?: {
    text?: Array<string>;
    immune?: Array<string>;
    adv_vs?: Array<string>;
  };

  weaponProfs?: [simple: false, martial: false, other: string[]];

  armorProfs?: [light: false, medium: false, heavy: false, shields: true];

  skills?: string[];

  skillstxt?: string;

  age?: string;

  height?: string;

  weight?: string;

  heightMetric?: string;

  weightMetric?: string;

  improvements?: string;

  scores: [
    Str: number,
    Dex: number,
    Con: number,
    Int: number,
    Wis: number,
    Cha: number
  ];

  scorestxt?: string;

  trait: string;

  abilitySave?: 1 | 2 | 3 | 4 | 5 | 6;

  variants?: string[];

  spellcastingAbility?: 1 | 2 | 3 | 4 | 5 | 6;

  spellcastingBonus?: SpellCastingBonus;

  features: {
    [key: string]: RaceFeature;
  };
};

export interface BaseRaceFeature {
  name: string;
  minlevel: number;
  tooltip?: string;
  action?: [type: "action", suffix: ""];
  spellcastingBonus?: SpellCastingBonus;

  calcChanges?: {
    hp: string;

    atkCalc: [eval: string, explanation: string];

    atkAdd: [eval: string, explanation: string];
  };

  dmgres?: Array<string | [name: string, condition: string]>;

  addMod?: ArrayAble<{
    type?: "skill" | "save";
    field?: string;
    mod?: number | string;
    text?: string;
  }>;
}

export interface SpellcastingRaceFeature extends BaseRaceFeature {
  recovery: string;
  usages: number | LevelArray<number>;
}

export type RaceFeature = BaseRaceFeature | SpellcastingRaceFeature;
