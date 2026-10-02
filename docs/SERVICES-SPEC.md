# Service catalog (client-provided, authoritative)

Four services. Nothing else is offered. Slugs are fixed; every link, test and data reference uses them.

## Vehicle classes (replaces sedan/suv/truck)

`VehicleSize` ids, in this order: `car`, `suv`, `truck`, `sports`, `exotic`, `motorcycle`.

| id           | Label      | Examples                                      |
| ------------ | ---------- | --------------------------------------------- |
| `car`        | Car        | Sedans, coupes, hatchbacks                    |
| `suv`        | SUV        | Crossovers, two- and three-row SUVs, minivans |
| `truck`      | Truck      | Pickups and full-size trucks                  |
| `sports`     | Sports car | Mustang, Camaro, Supra, M cars                |
| `exotic`     | Exotic     | Lamborghini, Ferrari, McLaren, Porsche GT     |
| `motorcycle` | Motorcycle | Cruisers, sport bikes                         |

## Prices (client-provided, final)

| Slug             | Name                                   | Category | car                                                                | suv  | truck | sports | exotic        | motorcycle |
| ---------------- | -------------------------------------- | -------- | ------------------------------------------------------------------ | ---- | ----- | ------ | ------------- | ---------- |
| `basic-wash`     | Basic Package — Exterior Wash          | exterior | $50                                                                | $60  | $65   | $70    | $100 starting | $40        |
| `premium-detail` | Premium Package — Exterior Detail      | exterior | $80                                                                | $90  | $100  | $120   | $150+         | $65        |
| `full-deluxe`    | Full Deluxe Package — Inside + Outside | packages | $120                                                               | $150 | $165  | $180   | $250+         | $100       |
| `working-truck`  | Working Truck                          | work     | $75 starting for any work vehicle (same number in every size slot) |      |       |        |               |            |

- Exotic prices are "starting at" / "+": set `priceSuffix` behaviour so exotic shows "from $100", "$150+", "$250+" (a per-size `startingFrom` flag or an `exoticNote` is acceptable; keep it simple).
- Working Truck: +$15–$30 for extremely dirty construction, farm or work vehicles (price factor, quoted on site).
- `full-deluxe` badge: "Best value". `working-truck` badge: "Work vehicles". No popularity claims.

## Includes (verbatim from the client, lightly edited)

**Basic Package — Exterior Wash**: Hand wash; Wheels & tires; Tire shine; Windows; Dry; Basic exterior wipe-down.

**Premium Package — Exterior Detail**: Everything in Basic; Deep wheel cleaning; Wheel wells; Door jambs; Bug removal; Spray wax/sealant; More detailed drying.

**Full Deluxe Package — Inside + Outside**: Everything in Premium; Full interior vacuum; Dash, console and doors; Seats; Mats; Interior windows; Deeper stain cleaning.

**Working Truck**: Exterior hand wash; Wheels/tires; Wheel wells; Bug/grime removal; Door jambs; Tire dressing.

## Rules

- All services are `location: "mobile"`. The garage-required logic stays in code but no service uses it now.
- Add-ons: none offered. `addOns` is an empty array; every add-on UI (cards, booking step, pricing list, sidebar) must hide itself when empty.
- Durations (estimates, mark as approximate): basic ~1 hr, premium ~1.5–2 hrs, full deluxe ~2.5–3.5 hrs, working truck ~1–1.5 hrs.
- No coatings, paint correction, interior-only or maintenance-plan wording anywhere on the site.
