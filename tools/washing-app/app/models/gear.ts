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


