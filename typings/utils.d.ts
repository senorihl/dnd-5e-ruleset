export type AbilityArray<T> = [str: T, dex: T, con: T, int: T, wis: T, cha: T];
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
export type SpellCastingBonus = {
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
