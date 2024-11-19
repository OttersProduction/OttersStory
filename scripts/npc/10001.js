/*
	
*/
var status = -1;
var nxAmmount = 0;
var option = "";
var gearJob = 0;
var jobs = [
  {
    id: 0,
    name: "Beginner",
  },
  {
    id: 100,
    name: "Warrior",
  },
  {
    id: 110,
    name: "Fighter",
  },
  {
    id: 111,
    name: "Crusader",
  },
  {
    id: 112,
    name: "Hero",
  },
  {
    id: 120,
    name: "Page",
  },
  {
    id: 121,
    name: "Whiteknight",
  },
  {
    id: 122,
    name: "Paladin",
  },
  {
    id: 130,
    name: "Spearman",
  },
  {
    id: 131,
    name: "Dragonknight",
  },
  {
    id: 132,
    name: "Darkknight",
  },
  {
    id: 200,
    name: "Magician",
  },
  {
    id: 210,
    name: "Fire Poison Wizard",
  },
  {
    id: 211,
    name: "Fire Poison Mage",
  },
  {
    id: 212,
    name: "Fire Poison Archmage",
  },
  {
    id: 220,
    name: "Ice Lightning Wizard",
  },
  {
    id: 221,
    name: "Ice Lightning Mage",
  },
  {
    id: 222,
    name: "Ice Lightning Archmage",
  },
  {
    id: 230,
    name: "Cleric",
  },
  {
    id: 231,
    name: "Priest",
  },
  {
    id: 232,
    name: "Bishop",
  },
  {
    id: 300,
    name: "Bowman",
  },
  {
    id: 310,
    name: "Hunter",
  },
  {
    id: 311,
    name: "Ranger",
  },
  {
    id: 312,
    name: "Bowmaster",
  },
  {
    id: 320,
    name: "Crossbowman",
  },
  {
    id: 321,
    name: "Sniper",
  },
  {
    id: 322,
    name: "Crossbowmaster",
  },
  {
    id: 400,
    name: "Thief",
  },
  {
    id: 410,
    name: "Assassin",
  },
  {
    id: 411,
    name: "Hermit",
  },
  {
    id: 412,
    name: "Nightlord",
  },
  {
    id: 420,
    name: "Bandit",
  },
  {
    id: 421,
    name: "Chiefbandit",
  },
  {
    id: 422,
    name: "Shadower",
  },
  {
    id: 500,
    name: "Pirate",
  },
  {
    id: 510,
    name: "Brawler",
  },
  {
    id: 511,
    name: "Marauder",
  },
  {
    id: 512,
    name: "Buccaneer",
  },
  {
    id: 520,
    name: "Gunslinger",
  },
  {
    id: 521,
    name: "Outlaw",
  },
  {
    id: 522,
    name: "Corsair",
  },
];

var JobsGearTiers = [
  "Hero",
  "Paladin",
  "Darkknight",
  "Fire Poison Archmage",
  "Ice Lightning Archmage",
  "Bishop",
  "Bowmaster",
  "Crossbowmaster",
  "Nightlord",
  "Shadower",
  "Buccaneer",
  "Corsair",
];

var GearTiers = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [
    //shadower
    [
      // leveling
      {
        id: 1002391, //green bandana
        dex: 10,
      },
      {
        id: 1050100, // male sauna robe
        luk: 22,
      },
      {
        id: 1051098, // female sauna robe
        luk: 22,
      },
      {
        id: 1082002, //white glove
        attack: 8,
      },
      {
        id: 1072369, //Korean fan
        dex: 2,
        luk: 2,
      },
      {
        id: 1332020, //Korean fan
        attack: 57,
        luk: 4,
      },
      {
        id: 1332025, //Maple wanger
        attack: 67,
        luk: 6,
      },
      {
        id: 1332056, //Maple Asura
        attack: 87,
        luk: 6,
      },
      {
        id: 1092030, //Maple Shield
        attack: 10,
        str: 5,
      },
    ],
    [
      // early endgame
      {
        id: 1002357, // zakum helmet
      },
      {
        id: 1012101, //maple leaf dex
      },
      {
        id: 103200, //earring
        dex: 8,
      },
      {
        id: 1102028, //cape
        luk: 10,
      },
      {
        id: 1041096, // top female
        luk: 10,
        dex: 5,
      },
      {
        id: 1040100, //top male
        luk: 10,
        dex: 5,
      },
      {
        id: 1060087, //bottom male
        luk: 14,
        luk: 5,
      },
      {
        id: 1061093, //bottom female
        luk: 14,
        luk: 5,
      },
      {
        id: 1082002, //white glove
        attack: 10,
      },
      {
        id: 1072152, //shoes
        luk: 6,
        dex: 6,
      },
      {
        id: 1332051, //weapon
        attack: 116,
        luk: 6,
      },
      {
        id: 1092049, //shield
        attack: 25,
        str: 5,
      },
    ],
    [
      // mid endgame
      {
        id: 1002357, // zakum helmet
        dex: 30,
      },
      {
        id: 1012101, //maple leaf dex
        dex: 6,
      },
      {
        id: 103200, //earring
        dex: 10,
      },
      {
        id: 1102084, //cape
        attack: 4,
      },
      {
        id: 1041118, // top female
        luk: 18,
        dex: 6,
      },
      {
        id: 1040118, //top male
        luk: 18,
        dex: 6,
      },
      {
        id: 1060107, //bottom male
        dex: 18,
        luk: 5,
      },
      {
        id: 1061117, //bottom female
        dex: 18,
        luk: 5,
      },
      {
        id: 1082223, //white glove
        attack: 13,
      },
      {
        id: 1072344, //shoes
        attack: 5,
      },
      {
        id: 1332049, //weapon
        attack: 122,
        luk: 8,
      },
      {
        id: 1092049, //shield
        attack: 30,
        str: 9,
      },
    ],
    [
      // late endgame
      {
        id: 1002357, // zakum helmet
        dex: 35,
      },
      {
        id: 1012101, //maple leaf dex
        dex: 10,
      },
      {
        id: 103200, //earring
        dex: 12,
      },
      {
        id: 1102084, //cape
        attack: 12,
      },
      {
        id: 1041118, // top female
        luk: 24,
        dex: 6,
      },
      {
        id: 1040118, //top male
        luk: 24,
        dex: 6,
      },
      {
        id: 1060107, //bottom male
        dex: 22,
        luk: 5,
      },
      {
        id: 1061117, //bottom female
        dex: 22,
        luk: 5,
      },
      {
        id: 1082223, //white glove
        attack: 15,
      },
      {
        id: 1072344, //shoes
        attack: 12,
      },
      {
        id: 1332049, //weapon
        attack: 127,
        luk: 10,
      },
      {
        id: 1092049, //shield
        attack: 32,
        str: 10,
      },
    ],
  ],
];

function start() {
  cm.sendSimple(
    "Welcome I am the great pink otter, what would you want to do?\r\n#L0#Change job#l\r\n#L1#Get more nx#l\r\n#L2#Get more meso#l\r\n#L3#Choose gear#l\r\n#L4#Turn myself to GM#l\r\n"
  );
}

function action(mode, type, selection) {
  status++;

  if (mode != 1) {
    cm.dispose();
    return;
  }

  if (status == 0) {
    switch (selection) {
      case 0:
        var joblist = "";
        for (var i = 0; i < jobs.length; i++) {
          joblist += "#L" + i + "#" + jobs[i].name + "#l\r\n";
        }
        cm.sendSimple("What job would you want to change to? \r\n" + joblist);
        option = "job";
        break;
      case 1:
        cm.sendGetNumber("How much nx would you like?", 1, 1, 1000000);
        option = "nx";
        break;
      case 2:
        cm.sendGetNumber(
          "How much meso would you like? (1 - 1,000,000)",
          1,
          1,
          1000000
        );
        option = "meso";
        break;

      case 3:
        var joblist = "";
        for (var i = 0; i < JobsGearTiers.length; i++) {
          joblist += "#L" + i + "#" + JobsGearTiers[i] + "#l\r\n";
        }
        cm.sendSimple("What job would you want to gear? \r\n" + joblist);
        option = "gear";
        break;

      case 4:
        if (!cm.getPlayer().isGM()) {
          cm.getPlayer().getClient().setGMLevel(6);
          cm.getPlayer().setGMLevel(6);
          cm.sendOk("You are now a GM");
        } else {
          cm.sendOk("You are already a GM");
        }
        cm.dispose();
        break;
    }
  } else if (status == 1) {
    if (option === "nx") {
      cm.sendOk("You gained " + selection + " nx");
      cm.getPlayer().getCashShop().gainCash(1, selection);
    } else if (option === "meso") {
      if (cm.getPlayer().canHoldMeso(selection)) {
        cm.sendOk("You gained " + selection + " meso");
        cm.gainMeso(selection);
      } else {
        cm.sendOk("You do not have enough space in your inventory");
      }
    } else if (option === "job") {
      cm.changeJobById(jobs[selection].id);
      cm.sendOk("You are now a " + jobs[selection].name);
    } else if (option === "gear") {
      gearJob = selection;
      if (selection === 9) {
        cm.sendSimple(
          "What gear tier would you want? \r\n#L0#Leveling#l\r\n#L1#Early endgame#l\r\n#L2#Mid endgame#l\r\n#L3#Late endgame#l"
        );

        return;
      } else {
        cm.sendOk("not implemented yet");
      }
    }
    cm.dispose();
  } else if (status == 2) {
    var gearTier = selection;
    var selectedGear = GearTiers[gearJob][gearTier];
    if (selectedGear) {
      for (var i = 0; i < selectedGear.length; i++) {
        var gear = cm.createItem(selectedGear[i].id);
        if (selectedGear[i].str) {
          gear.setStr(selectedGear[i].str);
        }
        if (selectedGear[i].dex) {
          gear.setDex(selectedGear[i].dex);
        }
        if (selectedGear[i].int) {
          gear.setInt(selectedGear[i].int);
        }
        if (selectedGear[i].luk) {
          gear.setLuk(selectedGear[i].luk);
        }
        if (selectedGear[i].attack) {
          gear.setWatk(selectedGear[i].attack);
        }
        if (selectedGear[i].magic) {
          gear.setMatk(selectedGear[i].attack);
        }
        gear.setUpgradeSlots(0);
        gear.setOwner(cm.getPlayer().getName());
        cm.giveItem(gear);
      }

      cm.sendOk("You have gained the gear");
    }
    cm.dispose();
  }
}
