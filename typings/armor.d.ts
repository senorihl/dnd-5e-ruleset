import { SourceLocation } from "./source";
import { ArrayAble } from "./utils";

export type Armor = {
  name: string;
  source?: ArrayAble<SourceLocation>;
  defaultExcluded?: boolean;
  regExpSearch?: RegExp;
  ac: number | string;
  type?: "light" | "medium" | "heavy";
  list?: string;
  dex?: number;
  stealthdis?: boolean;
  addMod?: boolean;
  isMagicArmor?: boolean;
  weight?: number;
  strReq?: number;
  invName?: string;
  affectsWildShape?: boolean;
};
