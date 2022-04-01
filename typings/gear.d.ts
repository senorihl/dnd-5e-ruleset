import { SourceLocation } from "./source";
import { ArrayAble } from "./utils";

export type Gear = {
  infoname: string;
  name: string;
  amount: number | "";
  weight: number | "";
  type: string;
  source?: ArrayAble<SourceLocation>;
};

export type Pack = {
  name: string;
  source: ArrayAble<SourceLocation>;
  items: Array<[name: string, amount: number | "", weight: number | ""]>;
};

interface IEval {
  isSpellcaster: boolean; // boolean; true if the character has spellcasting from a source other than magic items
  isSpellcastingClass: boolean; // boolean; true if the character has spell slots from a class (i.e. the Spellcasting or Pact Magic feature)
  characterLevel: number; // number; the total character level
  shieldProf: boolean; // boolean; true if the checkbox for shield proficiency is checked
  lightArmorProf: boolean; // boolean; true if the checkbox for light armour proficiency is checked
  mediumArmorProf: boolean; // boolean; true if the checkbox for medium armour proficiency is checked
  heavyArmorProf: boolean; // boolean; true if the checkbox for heavy armour proficiency is checked
  simpleWeaponsProf: boolean; // boolean; true if the checkbox for simple weapon proficiency is checked
  martialWeaponsProf: boolean; // boolean; true if the checkbox for martial weapon proficiency is checked
  otherWeaponsProf: string[]; // array; the WeaponsList object names of those listed in the other weapon proficiencies field (or the literal string if not a recognized weapon)
  toolProfs: string[]; // array; the contents of the tool fields, one field per array entry
  toolProfsLC: string[]; // array; same as toolProfs, but all lowercase
  languageProfs: string[]; // array; the contents of the language fields, one field per array entry
  languageProfsLC: string[]; // array; same as languageProfs, but all lowercase
  skillProfs: string[]; // array; the skills the character is proficient in, one skill name per array entry
  skillProfsLC: string[]; // array; same as skillProfs, but all lowercase
  skillExpertise: string[]; // array; the skills the character has expertise with, one skill name per array entry
  skillExpertiseLC: string[]; // array; same as skillExpertise, but all lowercase
  hasEldritchBlast: boolean; // boolean; true if the character has the Eldritch Blast cantrips
  choice: string; // string; the sub-choice of this feat (empty string if no choice)
}

export type Ammunition = {
  name: string;
  source: ArrayAble<SourceLocation>;
  defaultExcluded?: boolean;
  icon:
    | "Arrows"
    | "Axes"
    | "Bullets"
    | "Daggers"
    | "Flasks"
    | "Hammers"
    | "Spears"
    | "Vials";
  weight?: number;
  isMagicAmmo?: boolean;
  invName?: string;
  alternatives: Array<string | RegExp>;
};

type BaseMagicItem = {
  name: string;
  sortname?: string;
  nameAlt?: string;
  nameTest?: string | RegExp;
  source: ArrayAble<SourceLocation>;
  defaultExcluded?: boolean;
  type: string;
  rarity: string;
  notLegalAL?: boolean;
  magicItemTable: ArrayAble<string>;
  storyItemAL?: boolean;
  extraTooltip?: string;
  attunement?: boolean;
  weight?: number;
  prerequisite?: string;
  prereqeval: string | ((v: Partial<IEval>) => boolean);
  allowDuplicates?: boolean;
  description: string;
  descriptionLong?: string;
  descriptionFull?: string;
  calculate?: string;
  chooseGear?: {
    type: "armor" | "weapon" | "ammo";
    excludeCheck?: (inObjKey: string, inObj: string) => boolean;
    prefixOrSuffix?: "suffix" | "suffix" | "brackets";
    descriptionChange?: [
      type: "replace" | "prefix" | "suffix" | "brackets",
      change: string
    ];
    itemName1stPage:
      | [type: "replace" | "prefix" | "suffix" | "brackets", change: string]
      | [type: "between", changeLeft: string, changeRight: string];
    ammoAmount?: number;
  };
  choices: string[];
  selfChoosing: () => string;
  choicesNotInMenu?: boolean;
};

export type MagicItem = BaseMagicItem & {
  [nameLC: string]: Partial<
    Omit<BaseMagicItem, "choices" | "name" | "description"> & {
      name: BaseMagicItem["name"];
      description: BaseMagicItem["description"];
    }
  >;
};
