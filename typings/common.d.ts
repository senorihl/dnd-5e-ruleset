import { Armor } from "./armor";
import { Ammunition } from "./gear";
import { SourceLocation } from "./source";
import { Spell } from "./spell";
import { AbilityArray, ArrayAble, LevelArray } from "./utils";
import { Weapon } from "./weapon";

export type SpellcastingBonus = {
  spells?: string[];

  name: string;

  times?: number;
  selection?: string[];

  firstCol?: string;

  spellcastingAbility?: number;
  fixedDC?: number;
  fixedSpAttack?: number;
  allowUpCasting?: boolean;
  magicItemComponents?: boolean;
};

export type CommonSpellList = Partial<{
  extraspells: string[];
  spells: string[];
  notspells: string[];
  class: string[];
  level: [lower: number, upper: number];
  school: string[];
  attackOnly: boolean;
  ritual: boolean;
  psionic: boolean;
}>;

export type Common = Partial<{
  action?: Array<[type: "action" | "bonus action" | "reaction", info: string]>;
  usages?: number | string | LevelArray<number>;

  recovery?: string | LevelArray<string>;
  altResource?: string | LevelArray<string>;
  usagescalc?: string | LevelArray<string>;

  limfeaname?: string;

  limfeaAddToExisting?: boolean;

  additional?: string | LevelArray<string>;

  extraLimitedFeatures: Array<{
    name: string;
    usages: number | string | LevelArray<number>;
    recovery: string | LevelArray<string>;
    usagescalc?: string | LevelArray<string>;
    additional?: string | LevelArray<string>;
    altResource?: string | LevelArray<string>;
    addToExisting?: boolean;
  }>;

  toolProfs: Array<
    string | [name: string, ability: string] | [name: string, amount: number]
  >;
  languageProfs: Array<string | number | [name: string, amount: number]>;
  saves: string[];
  skills: Array<string | [name: string, exp: "full" | "only" | "increment"]>;
  skillstxt: string;
  armorProfs: [light: false, medium: false, heavy: false, shields: true];
  weaponProfs: [simple: false, martial: false, other: string[]];

  // >>>>>>>>>>>>>>>>>>>>>>>> //
  // >>> Weapons & Armour >>> //
  // >>>>>>>>>>>>>>>>>>>>>>>> //

  weaponsAdd?: string[];

  armorAdd?: string;
  shieldAdd: string | [name: string, ac: number, weight: number];

  ammoAdd: ArrayAble<[name: string, amount: number]>;

  ammoOptions: Array<Ammunition>;
  armorOptions: Array<Armor>;

  weaponOptions: Array<Weapon>;

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
  // >>> Other Fields on the 1st or 2nd Page >>> //
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

  dmgres: Array<string | [type: string, against: string]>;

  savetxt: Partial<{
    text: string[];

    immune: string[];

    adv_vs: string[];
  }>;

  vision: Array<
    [type: string, distance: number] | [type: string, modifier: string]
  >;

  speed: Partial<{
    walk: { spd: number | string; enc: number | string };
    burrow: { spd: number | string; enc: number | string };

    fly: { spd: number | string; enc: number | string };

    // example of using a modifier:
    climb: { spd: number | string; enc: number | string };

    // example of using "fixed":
    swim: { spd: number | string; enc: number | string };

    allModes: string;
  }>;

  carryingCapacity: number;

  advantages: Array<[name: string, adv: boolean]>;

  scores: AbilityArray<number>;
  scorestxt: string;

  scoresOverride: AbilityArray<number>;

  scoresMaximum: AbilityArray<number | string>;

  scoresMaxLimited: boolean;

  spellcastingBonus: Array<SpellcastingBonus>;

  spellcastingAbility: ArrayAble<string>;

  fixedDC: number;

  fixedSpAttack: number;

  allowUpCasting: boolean;

  magicItemComponents: boolean;

  spellcastingExtra: string[];

  spellcastingExtraApplyNonconform: boolean;

  spellFirstColTitle: string;

  spellChanges: {
    [key: string]: Partial<Spell>;
  };

  spellcastingBonusElsewhere: {
    addTo: string;

    spellcastingBonus?: Array<SpellcastingBonus>;

    addToKnown?: string[];

    countsTowardsKnown?: boolean;
  };

  // >>>>>>>>>>>>>>>>>>>>>>>>> //
  // >>> Companion Options >>> //
  // >>>>>>>>>>>>>>>>>>>>>>>>> //

  creatureOptions: [
    {
      /* CreatureList object, see "companion, wild shape (CreatureList).js" syntax file  */
    }
  ];
  /*	creatureOptions // OPTIONAL //
	TYPE:	array of objects (variable length)
	USE:	adds each object in the array to the CreatureList variable
	ADDED:	v13.0.6
	The syntax of the objects is not explained here, but in the "companion, wild shape (CreatureList).js" syntax file.
	This way you can have a feature add a type of creature to the automation.
	It will also be added to the options in each companion page's Race field drop-down.
	This will result in having the creature only available if the feature is present.
	IMPORTANT!
	Creatures added in this way are never available as a wild shape.
	When the feature with this attribute is removed, any companion pages that these
	creature(s) are	used on will have the race field reset (and thus the creature's stats
	will be removed from that companion page).
*/

  creaturesAdd: Array<[name: string] | [name: string, deleted: boolean]>;
  /*	creatureOptions // OPTIONAL //
	TYPE:	array of arrays (variable length)
	USE:	adds a creature to a companion page (adds companion page if none empty)
	ADDED:	v13.0.6
	CHANGE:	v13.0.10 (added 4th array entry)
	Each array must contain 1, 2, 3, or 4 entries, which are the following:
	1) String with the name of the race to add to the companion page // REQUIRED
		The sheet will search for the first empty companion page (or add an empty page)
		and add this entry in the "Race" drop-down box on that page.
		This string is added exactly as it is written here, so it is recommended to capitalize it for consistency.
		If the race already exists on a companion page, it is not added.
		When the parent feature is removed, any companion page with this filled out as
		the race, will have the race reset. Thus, all stats of that race will be removed.
	2) Boolean, set to true if the whole page should be removed // OPTIONAL
		If set to true, when the parent feature is removed, any companion page with the
		1st entry filled out as the race, will be deleted without warning.
		Deleted pages can not be recovered, any information on them is lost.
		Setting this to false will cause the sheet to do the default action, which is to only
		reset the race of the companion pages with the 1st entry filled out as the race.
	3) Function called when the creature is added/removed // OPTIONAL
		This function is called after the creature race in the 1st entry is added or
		removed from a page (even if the whole page is removed, see 2) ).
		This function is passed two variables:
		3.1) AddRemove
			A boolean that tells whether the creature was added (true) or removed (false).
		3.2) prefix
			A string with the page identifier for the companion page.
			You can use this to call on fields or invoke functions for that companion page.
		If the 1st entry race is already present on a companion page, no changes will be
		made to that page and the first such page will be used for this callback function.
		If you are adding a creature that is itself added using the `creatureOptions`
		attribute, consider not using this callback function, but adding an `eval` and
		`removeeval` to its CreatureList object instead.
	4) String of the special companion type that should be applied // OPTIONAL
		This string has to be a key in the CompanionList object.
		This companion type will be applied before the callback function above
		(3rd array entry) is called.
		Import scripts can add things to the CompanionList object, but generally these
		options should be available (if the applicable scripts are imported if they're not SRD):
		SRD   OBJECT KEY             EXPLANATION
		 V    "familiar"             Find Familiar spell
		 V    "pact_of_the_chain"    Pact of the Chain familiar (Warlock 3rd-level boon)
		 V    "mount"                Find Steed spell
		 -    "steed"                Find Greater Steed spell
		 -    "companion"            Ranger's Companion (Ranger: Beast Master feature)
		 -    "strixhaven_mascot"    Strixhaven Mascot familiar (Strixhaven Mascot feat)
		 -    "companionrr"          Animal Companion (2016/09/12 Unearthed Arcana:
			                                           Revised Ranger's Beast Conclave feature)
		 -    "mechanicalserv"       Mechanical Servant (2017/01/09 Unearthed Arcana: 
			                                             Artificer's Mechanical Servant feature)
		If the string doesn't match a CompanionList object key, nothing will happen.
	The changes dialog will list on which companion page something was added or removed.
	If a feature with this attribute is removed, these creatures will be removed as well.
*/

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
  // >>> Dynamic Automation Changes >>> //
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

  calcChanges: {
    hp?:
      | string
      | ((
          totalHD: number,
          HDobj: {
            conMod: number;
            conCorrection: boolean;
            count: number;
            dieStr: string[];
            average: number;
            fixed: number;
            max: number;
            alt: number[];
            altStr: string[];
          },
          prefix: string
        ) => void | [hpAdd: number, text?: string, raw: boolean]);
    hpForceRecalc?: boolean;

    atkAdd?: [
      mod:
        | string
        | ((
            fields: {
              Proficiency: boolean;
              Mod: number;
              Range: string;
              Damage_Type: string;
              Description: string;
              Description_Tooltip: string;
              To_Hit_Bonus: string;
              Damage_Bonus: string;
              Damage_Die: string;
              Weight: number;
            },
            v: {
              WeaponText: string;
              WeaponTextName: string;
              isDC: boolean;
              isSpell: boolean;
              isWeapon: boolean;
              isMeleeWeapon: boolean;
              isRangedWeapon: boolean;
              isNaturalWeapon: boolean;
              theWea: Weapon;
              StrDex: number;
              WeaponName: string;
              baseWeaponName: string;
              thisWeapon: [];
            }
          ) => any),
      text?: string,
      order?: number
    ];

    atkCalc: [
      mod:
        | string
        | ((
            fields: {
              Proficiency: boolean;
              Mod: number;
              Range: string;
              Damage_Type: string;
              Description: string;
              Description_Tooltip: string;
              To_Hit_Bonus: string;
              Damage_Bonus: string;
              Damage_Die: string;
              Weight: number;
            },
            v: {
              WeaponText: string;
              WeaponTextName: string;
              isDC: boolean;
              isSpell: boolean;
              isWeapon: boolean;
              isMeleeWeapon: boolean;
              isRangedWeapon: boolean;
              isNaturalWeapon: boolean;
              theWea: Weapon;
              StrDex: number;
              WeaponName: string;
              baseWeaponName: string;
              thisWeapon: [];
            },
            output: {
              prof: number;
              die: string;
              modToDmg: boolean;
              mod: number;
              magic: number;
              bHit: string;
              bDmg: string;
              extraDmg: number;
              extraHit: number;
            }
          ) => any),
      text?: string,
      order?: number
    ];

    spellCalc: [
      mod: (
        type: "dc" | "attack" | "prepare",
        spellcasters: string[],
        ability: number
      ) => number,
      text?: string,
      order?: number
    ];
    spellList: [
      mod: (
        spList: CommonSpellList,
        spName: string,
        spType: "book" | "list" | "known" | "feat" | "race" | "item"
      ) => number,
      text?: string,
      order?: number
    ];
    spellAdd: [
      mod: (
        spellKey: string,
        spellObj: Spell,
        spName: string,
        isDuplicate: true
      ) => any,
      text?: string,
      order?: number
    ];

    creatureCallback: [
      mod: (prefix: string, oCrea: any, bAdd: boolean) => any,
      text?: string,
      order?: number
    ];
    companionCallback: [
      mod: (
        prefix: string,
        oCrea: any,
        bAdd: boolean,
        sCompType: string
      ) => any,
      text?: string,
      order?: number
    ];
  };

  addMod: Array<{
    type: "" | "skill" | "save" | "dc";
    field: string;
    mod: number | string;
  }>;

  extraAC: ArrayAble<{
    mod: string | number;
    name?: string;
    magic?: boolean;
    text?: string;
    stopeval?: (v: {
      theArmor: Armor;
      usingShield: boolean;
      wearingArmor: boolean;
      mediumArmor: boolean;
      heavyArmor: boolean;
      shieldProf: boolean;
      lightProf: boolean;
      mediumProf: boolean;
      heavyProf: boolean;
    }) => boolean;
  }>;

  bonusClassExtrachoices: ArrayAble<{
    class: string;
    subclass?: string;
    feature: string;
    bonus: number;
  }>;

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
  // >>> Fields on Other Pages >>> //
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

  toNotesPage: ArrayAble<{
    name: ArrayAble<string>;
    page3notes?: boolean;
    popupName?: string;
    source?: ArrayAble<SourceLocation>;
    additional?: string;
    amendTo: string;
  }>;

  magicitemsAdd: Array<string | [name: string, force: boolean]>;

  // >>>>>>>>>>>>>>>>>>>>>>> //
  // >>> Run Custom Code >>> //
  // >>>>>>>>>>>>>>>>>>>>>>> //

  eval:
    | string
    | ((
        lvl: [oldLvl: number, newLvl: number],
        chc: [
          oldChoice: string,
          newChoice: string,
          choiceAct: "change" | "only" | ""
        ]
      ) => any);
  removeeval:
    | string
    | ((
        lvl: [oldLvl: number, newLvl: number],
        chc: [
          oldChoice: string,
          newChoice: string,
          choiceAct: "change" | "only" | ""
        ]
      ) => any);
  changeeval:
    | string
    | ((
        lvl: [oldLvl: number, newLvl: number],
        chc: [
          oldChoice: string,
          newChoice: string,
          choiceAct: "change" | "only" | ""
        ]
      ) => any);
}>;
