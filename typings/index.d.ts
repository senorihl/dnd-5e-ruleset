export enum Size {
  Gargantuan = 0,
  Huge = 1,
  Large = 2,
  Medium = 3,
  Small = 4,
  Tiny = 5,
}

export type ArrayAble<T> = T | Array<T>;

export type Source = {
  name: string;
  abbreviation: string;
  abbreviationSpellsheet?: string;
  date?: string;
  group?: string;
  url?: string;
  defaultExcluded?: boolean;
};

type RaceSpellCastingBonus = {
  name: string;

  class?: string;

  school?: string[];

  level?: [lower: number, upper: number];

  ritual?: boolean;

  spells?: string[];

  selection?: string[];

  times?:
    | number
    | [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
      ];

  prepared?: boolean;

  atwill?: boolean;

  oncesr?: boolean;

  oncelr?: boolean;
};

type BaseRaceFeature = {
  name: string;
  minlevel: number;
  tooltip?: string;
  action?: [type: "action", suffix: ""];
  spellcastingBonus?: RaceSpellCastingBonus;

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
};

type SpellcastingClassFeature = {
  recovery: string;
  usages:
    | number
    | [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
      ];
};

export type RaceFeature = BaseRaceFeature & (SpellcastingClassFeature | {});

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

  weaponprofs?: [simple: false, martial: false, other: string[]];

  armor: [light: false, medium: false, heavy: false, shields: true];

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

  trait: string;

  abilitySave?: 1 | 2 | 3 | 4 | 5 | 6;

  variants?: string[];

  spellcastingAbility?: 1 | 2 | 3 | 4 | 5 | 6;

  spellcastingBonus?: RaceSpellCastingBonus;

  features: {
    [key: string]: RaceFeature;
  };
};

export type SourceLocation = [source: string, page: number];

declare module "dnd-5th-ruleset" {
  const SourceList: { [key: string]: Source };
  const RaceList: { [key: string]: Race };
  const RaceSubList: { [key: string]: Race };
}
