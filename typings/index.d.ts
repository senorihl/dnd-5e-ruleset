export enum Size {
  Gargantuan = 0,
  Huge = 1,
  Large = 2,
  Medium = 3,
  Small = 4,
  Tiny = 5,
}

export type ArrayAble<T> = T | Array<T>;
export type LevelArray<T> = [
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T,
  T
];

export type Source = {
  name: string;
  abbreviation: string;
  abbreviationSpellsheet?: string;
  date?: string;
  group?: string;
  url?: string;
  defaultExcluded?: boolean;
};

type SpellCastingBonus = {
  name: string;

  class?: string;

  school?: string[];

  level?: [lower: number, upper: number];

  ritual?: boolean;

  spells?: string[];

  selection?: string[];

  times?: number | LevelArray<number>;

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
};

type SpellcastingRaceFeature = BaseRaceFeature & {
  recovery: string;
  usages: number | LevelArray<number>;
};

export type RaceFeature = BaseRaceFeature | SpellcastingRaceFeature;

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

  trait: string;

  abilitySave?: 1 | 2 | 3 | 4 | 5 | 6;

  variants?: string[];

  spellcastingAbility?: 1 | 2 | 3 | 4 | 5 | 6;

  spellcastingBonus?: SpellCastingBonus;

  features: {
    [key: string]: RaceFeature;
  };
};

export type BaseClass = {
  name: string;
  regExpSearch: RegExp;
  source: ArrayAble<SourceLocation>;
  defaultExcluded?: boolean;
  primaryAbility: string;
  prereqs: string;
  die: number;
  improvements: [0] | LevelArray<number>;
  saves?: Array<"Str" | "Dex" | "Con" | "Int" | "Wis" | "Cha">;
  skills: [primary: string, secondary: string];
  toolProfs?: {
    primary: Array<
      [name: string, ability: string] | [name: string, adv: number] | string
    >;
    secondary?: Array<
      [name: string, ability: string] | [name: string, adv: number] | string
    >;
  };

  armorProfs: {
    primary: [light: false, medium: false, heavy: false, shields: true];
    secondary: [light: false, medium: false, heavy: false, shields: true];
  };

  weaponProfs: {
    primary: [simple: false, martial: false, other: string[]];
    secondatry: [simple: false, martial: false, other: string[]];
  };

  equipment: string;

  subclasses: [label: string, variants: string[]];

  prestigeClassPrereq: number | string;

  attacks: LevelArray<number>;

  features: {
    [key: string]: ClassFeature;
  };
};

interface BaseClassFeature {
  name: string;
  source: ArrayAble<SourceLocation>;
  minlevel: number;
  description: string;
  skills?: string[];
  skillstxt?: string;
  vision?: Race["vision"];
  additional?: string | LevelArray<string>;
  armor?: Race["armorProfs"];
  weapons?: Race["weaponProfs"];
  addarmor?: Race["addarmor"];
  addMod?: BaseRaceFeature["addMod"];
  savetxt?: Race["savetxt"];
  dmgres?: Race["dmgres"];
  saves?: BaseClass["saves"];
  toolProfs?: Race["toolProfs"];
  languageProfs?: Race["languageProfs"];
  speed?: Race["speed"];
}

interface BaseClassChoice {
  name: string;
  description: string;
}

interface ActionClassFeature extends BaseClassChoice {
  action: [type: "action" | "bonus action" | "reaction", suffix: string];
}

interface CalcChangeClassFeature extends BaseClassChoice {
  calcChanges: {
    hp?: string;

    atkCalc?: [eval: string, explanation: string];

    atkAdd?: [eval: string, explanation: string];
  };
}

export type ClassChoice =
  | BaseClassChoice
  | ActionClassFeature
  | CalcChangeClassFeature;

export type ChoiceClassFeature = BaseClassFeature & {
  choices: string[];
  choicesNotInMenu?: boolean;
} & {
  [choice: string]: ClassChoice;
};

interface SpellCastingClassFeature extends BaseClassFeature {
  spellcastingBonus: SpellCastingBonus;
  spellFirstColTitle?: string;
}

interface UsageClassFeature extends BaseClassFeature {
  usages: number | LevelArray<number>;
  recovery: string;
}

export type ClassFeature =
  | BaseClassFeature
  | ChoiceClassFeature
  | UsageClassFeature;

type SpellSlots = [
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

export type SpellcastingClass = BaseClass & {
  abilitySave: 1 | 2 | 3 | 4 | 5 | 6;
  abilitySaveAlt?: 1 | 2 | 3 | 4 | 5 | 6;
  spellcastingFactor: 1 | 2 | 3 | string;
  spellcastingTable?: LevelArray<SpellSlots>;
  spellcastingKnown?: {
    cantrips?: LevelArray<number>;

    spells?: LevelArray<number>;

    prepared?: boolean;
  };

  spellcastingList?: {
    //Optional; Only needed if the class doesn't have its own spell list. This object denotes what spells the class has access to. All things in this object constrain the selection of spells that will be available. The contstraints are cumulative.

    class: string; //Required; The name of the class from whose spell list the spells come from. This can be "any" if the spells are not limited by a spell list of just one class. The entry has to match the name of the class in the SpellsList

    school?: string[]; //Optional; An array of abbreviations of spell school names (see SpellsList). These have to be in an array, even if it is just one value. Each entry has to match the name of the spell school in the SpellsList

    level?: [lower: number, upper: number]; //Optional; The lower and upper limit of spell levels that the class has access to.

    ritual?: boolean; //Optional; Denotes if only ritual (true) or only non-ritual (false) spells should be included in the list

    spells?: string[]; //Optional; If a "spells" array is present, all other objects will be ignored and only this list of spells will populate the list of available spells. each entry has to match the name of the spell in the SpellsList

    notspells?: string[]; //Optional; Any spells listed in this array will be excluded from the list
  };

  spellcastingExtra?: string[];
};

export type CClass = BaseClass | SpellcastingClass;

export type SourceLocation = [source: string, page: number];

declare module "dnd-5th-ruleset" {
  const SourceList: { [key: string]: Source };
  const RaceList: { [key: string]: Race };
  const RaceSubList: { [key: string]: Race };
  const ClassList: { [key: string]: CClass };
}
