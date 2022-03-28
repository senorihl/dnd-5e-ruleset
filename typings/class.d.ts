import { BaseRaceFeature, Race } from "./race";
import { SourceLocation } from "./source";
import { ArrayAble, LevelArray, SpellCastingBonus } from "./utils";

export type BaseClass = {
  name: string;
  subname?: string;
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

  subclasses?: [label: string, variants: string[]];

  prestigeClassPrereq: number | string;

  attacks: LevelArray<number>;

  variants?: string[];

  features: {
    [key: string]: ClassFeature;
  };
};

export interface BaseClassFeature {
  name: string;
  source: ArrayAble<SourceLocation>;
  minlevel: number;
  description: string | LevelArray<string>;
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

export interface BaseClassChoice {
  name: string;
  description: string;
}

export interface ActionClassFeature extends BaseClassChoice {
  action: [type: "action" | "bonus action" | "reaction", suffix: string];
}

export interface CalcChangeClassFeature extends BaseClassChoice {
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

export interface SpellCastingClassFeature extends BaseClassFeature {
  spellcastingBonus: SpellCastingBonus;
  spellFirstColTitle?: string;
}

export interface UsageClassFeature extends BaseClassFeature {
  usages: number | LevelArray<number>;
  recovery: string;
}

export type ClassFeature =
  | BaseClassFeature
  | ChoiceClassFeature
  | UsageClassFeature;

export type SpellSlots = [
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

export type Class = BaseClass | SpellcastingClass;
