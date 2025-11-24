## INT Gear Support – Design & Implementation Plan

### 1. Goals

- **INT gear modeling**: Represent MapleStory gear with proper slots, required level, and INT.
- **Auto-equip best gear**: At each simulated level, auto-equip the best INT item per slot whose required level ≤ current level.
- **Derived gear INT**: Treat gear INT as a derived value from equipped items; **no raw “gear INT” number** stored on the player.
- **Formula integration**: Feed gear INT into existing MP gain / washing formulas via total INT, without changing other stats.
- **Form-driven config**: Gear is configured entirely via the main form and sent to the `Player` as its inventory.
- **Single source design doc**: This file is the single place that tracks the INT gear feature’s design and scope.

---

### 2. Data Model

#### 2.1 Gear slots

Create a `GearSlot` enum in `app/models/gear.ts`:

- **Non-ring slots**:
  - `Hat`, `Face`, `Eye`, `Pendant`, `Top`, `Bottom`, `Overall`, `Earring`, `Shoulder`, `Gloves`, `Cape`, `Shoes`, `Belt`
- **Ring slots (distinct)**:
  - `Ring1`, `Ring2`, `Ring3`, `Ring4`

> Rationale: MapleStory allows up to 4 rings; modeling them as distinct slots keeps auto-equip logic simple and explicit.

#### 2.2 Gear item type

In `app/models/gear.ts`, define:

- **`GearItem`**
  - `id: string | number`  
    - Item ID (later will map to a real item DB).  
    - For now, can be a synthetic ID (e.g. index or UUID) when created from the form.
  - `name: string`  
    - Human-readable name (e.g. "Zakum Helmet").
  - `slot: GearSlot`
  - `requiredLevel: number`
  - `int: number`

Constraints / notes:

- Multiple items per slot are allowed (e.g. several hats with different levels / INT).
- For the first version, **`int >= 0`**; negative INT items are not needed.

#### 2.3 Player gear state

Extend `Player` in `app/models/player.ts`:

- **New fields**
  - `public inventory: GearItem[] = []`  
    - All gear items defined by the user via the form.
  - `public equipped: GearItem[] = []`  
    - Auto-populated list of items that are currently equipped for the player’s level.
    - At most one item per non-ring slot; up to 4 items for `Ring1`–`Ring4`.

- **New getters**
  - `get bonusIntFromGear(): number`  
    - Returns `equipped.reduce((sum, item) => sum + item.int, 0)`.

- **Total INT concept**
  - Introduce a conceptual `totalInt` for internal use:
    - `totalInt = this.stats.int + this.bonusIntFromGear + (other buffs like MW if those are later added)`
  - Any code that calculates MP gains per level should use **total INT**, not just `this.stats.int`.

---

### 3. Auto-Equip Logic

#### 3.1 Core rule

At any level `L`, for each gear slot, equip:

- The **single item from `inventory` with the highest `int`** such that `requiredLevel <= L`.
- In case of a tie on `int`, pick:
  - Lower `requiredLevel`, then
  - Lower `id` (as a stable tie-breaker).

This ensures that:

- Gear always trends toward **maximizing total INT at or below the player’s level**.
- Future upgrades (higher-level, higher-INT gear) automatically take over as the player levels.

#### 3.2 Implementation in `Player`

In `app/models/player.ts`, add:

- **`private updateEquippedForLevel(level: number): void`**
  - Groups `inventory` by `slot`.
  - For each `slot`:
    - Filters items where `requiredLevel <= level`.
    - If any remain, chooses the best item per the rule above.
  - Rebuilds the `equipped` array from these per-slot choices.

Usage points:

- **Constructor**:
  - After setting `job`, `level`, and any provided `stats`:
    - Set `this.inventory` from constructor args (new optional parameter).
    - Call `this.updateEquippedForLevel(this.level)`.
- **`levelUp()`**:
  - After `this.level++`:
    - Call `this.updateEquippedForLevel(this.level)` before recalculating INT-based MP gains.
- **Cloning / re-simulation**:
  - Wherever a new `Player` is created for the simulation, pass in the inventory and initialize equipped using the same helper.

#### 3.3 No manual overrides (first version)

- There is **no concept of “locking” weaker gear** in this version:
  - The system always chooses the best-INT item available for the level.
  - Manual override / “don’t upgrade this slot” can be considered as a future enhancement if needed.

---

### 4. Integration with Existing Form & UI

#### 4.1 Form schema changes

In `components/logical/form.tsx`:

- Extend `formSchema` with a `gearItems` array:

```ts
const gearSlotEnum = z.enum([
  "Hat",
  "Face",
  "Eye",
  "Pendant",
  "Top",
  "Bottom",
  "Overall",
  "Earring",
  "Shoulder",
  "Gloves",
  "Cape",
  "Shoes",
  "Belt",
  "Ring1",
  "Ring2",
  "Ring3",
  "Ring4",
]);

const gearItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(), // can be filled in by the app
  name: z.string().min(1, "Item name is required"),
  slot: gearSlotEnum,
  requiredLevel: z
    .number()
    .min(1, { message: "Required level must be at least 1" })
    .max(200, { message: "Required level cannot exceed 200" }),
  int: z
    .number()
    .min(0, { message: "INT must be at least 0" })
    .max(999, { message: "INT cannot exceed 999" }),
});

const formSchema = z.object({
  // existing fields...
  gearItems: z.array(gearItemSchema),
});
```

- **Defaults**:

```ts
export const DEFAULT_FORM_VALUES: FormValues = {
  // existing defaults...
  gearItems: [],
};
```

> `FormValues` will now carry `gearItems` and pass them through the submit handler to the page component and ultimately into the `Player`.

#### 4.2 Gear UI (“todo-like” list)

In the current **Gear section** in `form.tsx` (currently “Coming soon”):

- Replace with:
  - A **card section** that lists all current `gearItems` rows.
  - Each row includes:
    - **Slot dropdown** (using the same `gearSlotEnum` values).
    - **Item name input** (text).
    - **Required level input** (number).
    - **INT input** (number).
    - **Delete row button** (e.g. trash icon).
    - **Small icon** near the name/slot (generic gear icon) to visually emphasize it’s equipment.
  - An **“Add gear item” button** at the bottom to append a blank row.

Behavior:

- Fully managed via `react-hook-form` field arrays (e.g. `useFieldArray` with `control` and `name="gearItems"`).
- Changes are local to the form and included automatically when the form is submitted.
- UI is intentionally simple and number-based:
  - Users type the INT and required level directly.
  - Later, this will be replaced by an item selector that auto-fills `int` and `requiredLevel` from a database.

---

### 5. Player & Simulation Wiring

#### 5.1 Player constructor changes

Update `Player` in `app/models/player.ts` to accept an optional `inventory` parameter:

- New constructor signature (conceptual):

```ts
constructor(
  job: Job,
  level: number,
  args?: Stats,
  hpQuests: HPQuest[] = [],
  inventory: GearItem[] = []
) {
  this.job = job;
  this.level = level;
  this.inventory = inventory;
  // existing washed-gain logic...
  this.updateEquippedForLevel(this.level);
}
```

- When constructing the `Player` from form values:
  - Map `FormValues["gearItems"]` to `GearItem[]`:
    - Ensure each has a stable `id` (if not provided, generate one).
  - Pass this array into the `Player` constructor.

#### 5.2 Level up and INT usage

- In `levelUp()`:
  - After incrementing `this.level` and AP:
    - Call `this.updateEquippedForLevel(this.level)`.
  - When computing INT-based MP gain per level:
    - Replace `const intBonus = Math.floor(this.stats.int / 10);` with:
      - `const intBonus = Math.floor(this.totalInt / 10);`
    - Where `totalInt` is a getter combining base INT and gear INT.

- Any other places that currently use `this.stats.int` for MP/INT-related mechanics should be reviewed and, where appropriate, updated to use `totalInt` instead.

#### 5.3 Simulation entry points

- Wherever `createHPWashPlan` and `simulateWashing` initialize the `Player` (in `app/utils/hp-wash.ts`):
  - Accept `gearItems` from the page’s submit handler and pass them into the `Player` constructor.
  - No other changes to simulation behavior are needed beyond recognizing gear-provided INT in MP gain.

---

### 6. Testing Strategy

#### 6.1 Auto-equip logic tests

- **Single slot / multiple items**
  - Inventory: `Hat` items at different levels and INT.
  - Verify:
    - At low levels, only low-requirement gear is considered.
    - As `level` crosses new gear requirements, the best-INT hat is auto-equipped.

- **Multi-slot behavior**
  - Populate multiple slots (Hat, Gloves, Cape, etc.).
  - Ensure:
    - One item per non-ring slot.
    - Up to four items across `Ring1`–`Ring4`.

- **`bonusIntFromGear` correctness**
  - Known equipped set with fixed INT values.
  - Confirm the getter returns the correct sum.

#### 6.2 Simulation sanity checks

- Compare:
  - **No gear case** vs.
  - **With a simple gear set** (e.g. 20 INT hat at level 50, 30 INT overall at level 100).
- Expectations:
  - MP gains per level increase once gear becomes equippable.
  - HP washing outcomes reflect the increased MP availability.

---

### 7. Future Enhancements (Out of Scope for First Pass)

- **Item database integration**
  - Replace free-form `name` / `requiredLevel` / `int` inputs with:
    - An item dropdown per slot, backed by an item DB keyed by `id`.
  - Auto-populate `requiredLevel` and `int` from the DB.

- **Manual gear locking**
  - Allow users to override auto-equip logic for specific slots (e.g. keep lower-level gear equipped intentionally).

- **Additional stats**
  - Extend `GearItem` with HP, MP, main stat, etc., if future washing/cost models need them.

This document is the single source of truth for the INT gear feature’s scope, data shapes, and integration points in the washing app.


