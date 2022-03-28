import { SourceLocation } from "./source";
import { ArrayAble } from "./utils";

export type Spell = {
  name: string;
  nameAlt?: string;
  nameShort?: string;
  regExpSearch?: RegExp;
  source: ArrayAble<SourceLocation>;
  defaultExcluded: boolean;
  classes?: string[];
  level: number;
  school?: string;
  time: string;
  timeFull?: string;
  range: string;
  rangeMetric: string;
  components?: string;
  compMaterial?: string;
  duration: string;
  save?: "Str" | "Dex" | "Con" | "Int" | "Wis" | "Cha";
  description: string;
  descriptionCantripDie?: string;
  descriptionMetric?: string;
  descriptionFull?: string;
  ritual?: boolean;
  psionic?: boolean;
  firstCol?: string;
  dependencies?: string[];
  allowUpCasting?: boolean;
  descriptionShorter?: string;
  descriptionShorterMetric?: string;
  dynamicDamageBonus?: {
    doNotProcess?: boolean;
    multipleDmgMoments?: boolean;
    allDmgTypesSingleMoment?: boolean;
    extraDmgGroupsSameType?: RegExp;
    multipleDmgTypes?: {
      dmgTypes: string[];
      inDescriptionAs: string[];
    };
    skipDmgGroupIfNotMultiple?: RegExp;
  };
};
