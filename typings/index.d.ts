import { Background, BackgroundFeature } from "./background";
export * from "./background";
import { Class } from "./class";
export * from "./class";
import { Race } from "./race";
export * from "./race";
import { Source } from "./source";
export * from "./source";
import { Spell } from "./spell";
export * from "./spell";
declare module "dnd-5th-ruleset" {
  const SourceList: { [key: string]: Source };
  const RaceList: { [key: string]: Race };
  const RaceSubList: { [key: string]: Race };
  const ClassList: { [key: string]: Class };
  const ClassSubList: { [key: string]: Class };
  const BackgroundList: { [key: string]: Background };
  const BackgroundSubList: { [key: string]: Background };
  const BackgroundFeatureList: { [key: string]: BackgroundFeature };
  const SpellsList: { [key: string]: Spell };
}
