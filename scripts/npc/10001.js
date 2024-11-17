/*
	
*/
var status = -1;
var nxAmmount = 0;
var option = "";

var jobs = [
    {
        "id": 0,
        "name": "Beginner"
    },
    {
        "id": 100,
        "name": "Warrior"
    },
    {
        "id": 110,
        "name": "Fighter"
    },
    {
        "id": 111,
        "name": "Crusader"
    },
    {
        "id": 112,
        "name": "Hero"
    },
    {
        "id": 120,
        "name": "Page"
    },
    {
        "id": 121,
        "name": "Whiteknight"
    },
    {
        "id": 122,
        "name": "Paladin"
    },
    {
        "id": 130,
        "name": "Spearman"
    },
    {
        "id": 131,
        "name": "Dragonknight"
    },
    {
        "id": 132,
        "name": "Darkknight"
    },
    {
        "id": 200,
        "name": "Magician"
    },
    {
        "id": 210,
        "name": "Fp_wizard"
    },
    {
        "id": 211,
        "name": "Fp_mage"
    },
    {
        "id": 212,
        "name": "Fp_archmage"
    },
    {
        "id": 220,
        "name": "Il_wizard"
    },
    {
        "id": 221,
        "name": "Il_mage"
    },
    {
        "id": 222,
        "name": "Il_archmage"
    },
    {
        "id": 230,
        "name": "Cleric"
    },
    {
        "id": 231,
        "name": "Priest"
    },
    {
        "id": 232,
        "name": "Bishop"
    },
    {
        "id": 300,
        "name": "Bowman"
    },
    {
        "id": 310,
        "name": "Hunter"
    },
    {
        "id": 311,
        "name": "Ranger"
    },
    {
        "id": 312,
        "name": "Bowmaster"
    },
    {
        "id": 320,
        "name": "Crossbowman"
    },
    {
        "id": 321,
        "name": "Sniper"
    },
    {
        "id": 322,
        "name": "Crossbowmaster"
    },
    {
        "id": 400,
        "name": "Thief"
    },
    {
        "id": 410,
        "name": "Assassin"
    },
    {
        "id": 411,
        "name": "Hermit"
    },
    {
        "id": 412,
        "name": "Nightlord"
    },
    {
        "id": 420,
        "name": "Bandit"
    },
    {
        "id": 421,
        "name": "Chiefbandit"
    },
    {
        "id": 422,
        "name": "Shadower"
    },
    {
        "id": 500,
        "name": "Pirate"
    },
    {
        "id": 510,
        "name": "Brawler"
    },
    {
        "id": 511,
        "name": "Marauder"
    },
    {
        "id": 512,
        "name": "Buccaneer"
    },
    {
        "id": 520,
        "name": "Gunslinger"
    },
    {
        "id": 521,
        "name": "Outlaw"
    },
    {
        "id": 522,
        "name": "Corsair"
    }
]
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
        var joblist = ''
        for (var i = 0; i < jobs.length; i++) {
         joblist += "#L" + i + "#" + jobs[i].name + "#l\r\n";
        }
        cm.sendSimple('What job would you want to change to? \r\n'+ joblist);
        option = "job";
        break;
      case 1:
        cm.sendGetNumber("How much nx would you like?", 1, 1, 1000000);
        option = "nx";
        break;
      case 2:
        cm.sendGetNumber("How much meso would you like? (1 - 1,000,000)", 1, 1, 1000000);
        option = "meso";
        break;

      case 3:
        cm.sendOk("This feature is not available yet");
        cm.dispose();
        break;

      case 4:
        if(!cm.getPlayer().isGM()){
            cm.getPlayer().getClient().setGMLevel(6)
            cm.getPlayer().setGMLevel(6)
            cm.sendOk("You are now a GM");   
        }
        else{
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
        if(cm.getPlayer().canHoldMeso(selection)){
            cm.sendOk("You gained " + selection + " meso");
            cm.gainMeso(selection);
        }
        else{
            cm.sendOk("You do not have enough space in your inventory");
        }
 
    }
    else if(option === "job"){
        cm.changeJobById(jobs[selection].id);
        cm.sendOk("You are now a " + jobs[selection].name);
    }
    cm.dispose();
  }
}
