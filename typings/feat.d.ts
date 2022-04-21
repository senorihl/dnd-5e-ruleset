import { SourceLocation } from "./source";
import {ArrayAble, LevelArray} from "./utils";
import {Common} from "./common";
import {ClassChoice} from "./class";

interface CharacterInfo {
  isSpellcaster: boolean,
  isSpellcastingClass: boolean,
  characterLevel: number,
  shieldProf: boolean,
  lightArmorProf: boolean,
  mediumArmorProf: boolean,
  heavyArmorProf: boolean,
  simpleWeaponsProf: boolean,
  martialWeaponsProf: boolean,
  otherWeaponsProf: string[],
  toolProfs: string[],
  toolProfsLC: string[],
  languageProfs: string[],
  languageProfsLC: string[],
  skillProfs: string[],
  skillProfsLC: string[],
  skillExpertise: string[],
  skillExpertiseLC: string[],
  hasEldritchBlast: boolean,
  choice: string,
}

export type BaseFeat = Common & {
  name: string;
  source: ArrayAble<SourceLocation>;
  defaultExcluded?: boolean;
  prerequisite?: string;
  prereqeval?: string | ((v: CharacterInfo) => boolean);
  allowDuplicates?: boolean;
  description: LevelArray<string> | string;
  descriptionFull?: string;
  calculate?: string;
};

export type Feat = BaseFeat & {
  choices?: string[];
  selfChoosing?: () => boolean
} & {
  [choice: string]: BaseFeat;
}
