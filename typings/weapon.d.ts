import { SourceLocation } from "./source";
import { ArrayAble } from "./utils";

export type Weapon = {
  name: string;
  source?: ArrayAble<SourceLocation>;
  defaultExcluded?: boolean;
  regExpSearch?: RegExp;
  ac: number | string;
  type?:
    | "Natural"
    | "Simple"
    | "Martial"
    | "Cantrip"
    | "Spell"
    | "Improvised Weapons"
    | "AlwaysProf";
  ability: number;
  abilitytodamage: boolean;
  damage: [diceNb: number, diceType: number, type: string];
  range: string;
  description: string;
  tooltip?: string;
  special?: boolean;
  list?: string;
  weight?: number;
  dc?: boolean;
  modifiers?: [string | number, string | number];
  monkweapon?: boolean;
  isMagicWeapon?: boolean;
  isAlwaysProf?: boolean;
  ammo?: string;
  SpellsList?: string;
  useSpellcastingAbility?: boolean;
  useSpellMod?: string;
  baseWeapon?: string;
};
