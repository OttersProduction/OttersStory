export enum GearSlot {
  Hat = "Hat",
  Face = "Face",
  Eye = "Eye",
  Pendant = "Pendant",
  Top = "Top",
  Bottom = "Bottom",
  Overall = "Overall",
  Earring = "Earring",
  Shoulder = "Shoulder",
  Gloves = "Gloves",
  Weapon = "Weapon",
  Shield = "Shield",
  Cape = "Cape",
  Shoes = "Shoes",
  Belt = "Belt",
  Ring1 = "Ring1",
  Ring2 = "Ring2",
  Ring3 = "Ring3",
  Ring4 = "Ring4",
}

export interface GearItem {
  id: string | number;
  name: string;
  slot: GearSlot;
  requiredLevel: number;
  int: number;
}

const SLOT_ORDER: GearSlot[] = [
  GearSlot.Hat,
  GearSlot.Face,
  GearSlot.Eye,
  GearSlot.Pendant,
  GearSlot.Top,
  GearSlot.Bottom,
  GearSlot.Overall,
  GearSlot.Earring,
  GearSlot.Shoulder,
  GearSlot.Gloves,
  GearSlot.Weapon,
  GearSlot.Shield,
  GearSlot.Cape,
  GearSlot.Shoes,
  GearSlot.Belt,
  GearSlot.Ring1,
  GearSlot.Ring2,
  GearSlot.Ring3,
  GearSlot.Ring4,
];

export const gearItems: GearItem[] = [
  {
    id: 1372005,
    name: "Wooden Wand",
    slot: GearSlot.Weapon,
    requiredLevel: 8,
    int: 0,
  },

  {
    id: 1082002,
    name: "Work Gloves",
    slot: GearSlot.Gloves,
    requiredLevel: 10,
    int: 0,
  },

  {
    id: 1012102,
    name: "Maple Leaf",
    slot: GearSlot.Face,
    requiredLevel: 0,
    int: 5,
  },

  {
    id: 1102079,
    name: "Ragged Red Cape",
    slot: GearSlot.Cape,
    requiredLevel: 25,
    int: 0,
  },
  {
    id: 1082246,
    name: "Flamekeeper Cordon",
    slot: GearSlot.Gloves,
    requiredLevel: 50,
    int: 0,
  },

  {
    id: 1002391,
    name: "Green Bandana",
    slot: GearSlot.Hat,
    requiredLevel: 10,
    int: 10,
  },
  {
    id: 1050100,
    name: "Male Sauna Robe",
    slot: GearSlot.Overall,
    requiredLevel: 20,
    int: 20,
  },
  {
    id: 1051098,
    name: "Female Sauna Robe",
    slot: GearSlot.Overall,
    requiredLevel: 20,
    int: 20,
  },
  {
    id: 1092030,
    name: "Maple Shield",
    slot: GearSlot.Shield,
    requiredLevel: 20,
    int: 6,
  },
  {
    id: 1072239,
    name: "Yellow Snowshoes",
    slot: GearSlot.Shoes,
    requiredLevel: 50,
    int: 4,
  },
  {
    id: 1072634,
    name: "Squishy Shoes",
    slot: GearSlot.Shoes,
    requiredLevel: 30,
    int: 4,
  },
  {
    id: 1122000,
    name: "Horntail Necklace",
    slot: GearSlot.Pendant,
    requiredLevel: 120,
    int: 21,
  },
  {
    id: 1022060,
    name: "White Raccoon Mask",
    slot: GearSlot.Face,
    requiredLevel: 45,
    int: 5,
  },
  {
    id: 1022073,
    name: "Broken Glasses",
    slot: GearSlot.Eye,
    requiredLevel: 45,
    int: 2,
  },
  {
    id: 1002357,
    name: "Zakum Helmet",
    slot: GearSlot.Hat,
    requiredLevel: 50,
    int: 25,
  },
  {
    id: 1122014,
    name: "Silver Deputy Star",
    slot: GearSlot.Pendant,
    requiredLevel: 50,
    int: 5,
  },
].sort((a, b) => {
  const slotIndexA = SLOT_ORDER.indexOf(a.slot);
  const slotIndexB = SLOT_ORDER.indexOf(b.slot);

  if (slotIndexA !== slotIndexB) {
    return slotIndexA - slotIndexB;
  }

  if (a.requiredLevel !== b.requiredLevel) {
    return a.requiredLevel - b.requiredLevel;
  }

  return a.name.localeCompare(b.name);
});
