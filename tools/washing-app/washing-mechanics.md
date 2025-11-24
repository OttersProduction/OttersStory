# Washing Mechanics (Developer Summary)

This document summarizes the **HP/MP washing logic** implemented in this app, based primarily on:

- [HP Washing for Dummies – Sylafia](https://royals.ms/forum/threads/hp-washing-for-dummies.224894/)
- MapleRoyals bishop/HT washing discussions referenced from that thread

It is meant as a **formula / logic reference for developers**, not a full player-facing guide. For the original prose guide, see `washing-guide.md`.

## Key Terminology

- **Fresh AP**: An unspent Ability Point gained from leveling or job advancing.
- **HPMP pool**: Internal combined HP/MP stat pool – putting AP into HP or MP increases this pool; AP Resets remove from the same pool.
- **HP Washing**: Converting *excess MP* into HP using AP Resets.
- **MP Washing**: Using **fresh AP** to temporarily increase MP, then resetting that AP back into a main stat so the extra MP remains.
- **Double Washing**: Old term for MP washing.
- **Infinite Washing**: Advanced method that uses SP resets on “Improved MaxHP/MaxMP Increase” skills plus AP Resets to gain HP/MP even without new levels.
- **HP Goal**: Desired HP at a specific level (e.g. 10k HP at 155 for Horntail).
- **Washing Goal**: Portion of the HP goal that must come from base HP + washing (HP goal minus HP from gear/quests).
- **Minimum MP**: Class‑ and level‑specific lower bound; you cannot remove MP (via AP Reset) if current MP is at or below this value.

## Core HP Washing Logic

Conceptually, HP washing relies on how the **HPMP pool** works:

1. Start with at least **1 AP in HPMP** (i.e. you have put AP into HP or MP at some point).
2. Use an **AP Reset**:
   - Remove 1 point from **MP**.
   - Add 1 point into **HP**.
3. Your HPMP pool still has 1 point in it, but:
   - **HP is higher**.
   - **MP is lower**.
4. Repeat this loop as long as:
   - You have AP Resets available, and
   - `currentMP > minimumMP(job, level)`.

In code, this is modelled as:

- `getMinimumMP(job, level)` — returns the minimum MP for the job and level.
- `getHPGainByAP(job, freshAP?)` — HP gained per AP Reset (or per fresh AP) for that job.
- `getMPLossByAP(job, apCount)` — MP lost per AP Reset for that job.
- `getAPResetsHPWash(job, level, currentMP)` — how many HP washes are possible at this point.

The **Player** model tracks:

- `naturalHP` / `naturalMP` — base HP/MP from formulas and quests.
- `hpGain` / `mpGain` — accumulated extra HP/MP from previous washing and level‑up INT bonuses.

Total HP/MP is computed as:

- `hp = naturalHP + hpGain`
- `mp = naturalMP + mpGain`

This separation allows us to:

- Reconstruct a character that has already washed by comparing input HP/MP to base values.
- Continue washing and leveling while preserving prior gains.

## MP Washing Logic

MP washing is a different loop that exploits the difference between **adding fresh AP** and **removing AP with an AP Reset**:

1. Add **fresh AP** into **MP**.
2. Use an **AP Reset** to:
   - Remove 1 point from **MP**.
   - Add 1 point into your **main stat** (STR/DEX/LUK/INT as appropriate).
3. Net effect:
   - Your main stat increases by 1.
   - MP stays **higher than before step 1**, because:
     - Fresh AP → MP uses a formula that adds **base MP + INT‑scaled bonus**.
     - Removing AP from MP uses a **different (smaller) formula**.

From Sylafia’s guide and follow‑up discussions:

- Each MP wash yields **≈ ⌊baseINT / 10⌋ extra MP** (server‑specific constants vary by class).
- Only **base INT** (no gear, no Maple Warrior) is used for this MP‑wash bonus.
- Higher base INT makes MP washing more efficient, at the cost of more AP Resets later to move INT back into main stat.

In this app, the extra MP from allocating AP into MP is modelled via:

- `getMPGainByAP(job, int)` — base MP per AP for the job, plus `⌊INT / 10⌋` bonus.

> **Important**: MP washing is **not required** to reach high HP goals, but is often used to **reduce total NX/meso cost** by allowing lower base INT while still generating enough MP.

## Thief‑Specific Washing Behaviour

Thieves (Assassin → Night Lord, Bandit → Shadower) have **non‑standard HP gains**:

- For thieves, **fresh AP into HP** gives **more HP per point** than washing via AP Reset.
- For most other jobs, the reverse is true (AP Reset washing is equal or better than fresh AP into HP).

Practical consequence (per [HP Washing for Dummies](https://royals.ms/forum/threads/hp-washing-for-dummies.224894/)):

- Thieves often use a “fresh AP HP wash” loop:
  1. Add **fresh AP into HP** (high HP gain).
  2. Use an **AP Reset** to:
     - Remove 1 point from **MP**.
     - Add 1 point into **LUK** (or the main stat).
  3. Repeat while `currentMP > minimumMP`.
- They **can** also use normal HP washing (remove from MP → add to HP) like other classes, but it tends to be **less efficient** than the fresh‑AP method.

When modelling thieves in the calculator:

- Make sure `getHPGainByAP(job, freshAP = true)` and `freshAP = false` reflect the “fresh AP is better” behaviour.
- Ensure thief minimum MP uses the correct class‑specific formula via `getMinimumMP`.

## INT, Level‑Up MP, and Extra MP from INT

Both the guide and in‑game behaviour emphasize:

- **Total INT on level‑up** (base + gear + buffs like Maple Warrior) increases MP gained per level.
- Rough rule of thumb: **every 10 total INT (floored)** gives **+1 extra MP per level**.

This app models that with:

- `getLevelUpMP(job, level)` — base MP per level for each job.
- In `Player.levelUp()`:
  - It adds `intBonus = ⌊INT / 10⌋` into `mpGain` on each level‑up.

This means:

- Raising INT early and keeping it high while leveling produces large **MP surpluses**.
- That surplus MP can be:
  - Directly washed into HP (HP washing).
  - Further amplified via MP washing before converting to HP.

## Infinite Washing / SP Reset “Weirdness”

The **SP Reset Weirdness** section of the guide (and bishop/mage discussions) describes an advanced technique:

- Certain skills (e.g. **Improved MaxHP/MaxMP Increase**) modify the HP/MP you gain **both when adding and removing AP**.
- By:
  1. Setting the skill to **0** using an SP Reset when **removing** AP from HP/MP.
  2. Setting the skill to **max** when **adding** AP back.
- You create a **difference in HP/MP gained vs. lost** over a full AP Reset cycle, generating net HP/MP without new levels.

This is primarily relevant for:

- Mages (infinite MP washing).
- Warriors and Buccaneers with Improved MaxHP Increase (though they rarely *need* it due to high natural HP + quest HP).

Implementation notes for this app:

- The current calculator **does not explicitly model** SP‑based infinite washing — it focuses on:
  - Level‑up HP/MP.
  - HP/MP washing with AP Resets.
  - INT‑based MP scaling.
- If infinite washing is added later, it should:
  - Extend the `Player` model with skill levels.
  - Adjust the add/remove formulas in `getHPGainByAP` / `getMPGainByAP` depending on skill state.

## HP Goals, Quests, and Non‑Washing HP

The guide stresses that final HP is a combination of:

1. **Natural HP** (from job and level).
2. **HP from washing** (what this app optimizes).
3. **HP from quests and gear**.

Relevant logic in this app:

- `getQuestHP(hpQuests, job, level)` — returns:
  - Total HP from quests that become available up to a given level.
  - Breakdown per quest.
- `Player.levelUp()`:
  - Applies quest HP when the character reaches the relevant levels.
  - Tracks which quests have already been “consumed”.

The calculator workflow matches the guide’s recommendations:

- User sets an **HP Goal** (e.g. 10k / 12k / 17.5k for various bosses in MapleRoyals).
- User may account for HP from **quests/gear** outside the app.
- The app then finds how much **washing** (and base INT) is required to cover the remaining gap.


