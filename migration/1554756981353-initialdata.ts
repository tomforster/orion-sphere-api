import {MigrationInterface, QueryRunner} from "typeorm";

export class initialdata1554756981353 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const ts = new Date().toISOString().replace("T", " ");
    
        const it = [
            {id: 1, name:"Light Energy Weapon", code:"EL"},
            {id: 2, name:"Medium Energy Weapon", code:"EM"},
            {id: 3, name:"Heavy Energy Weapon", code:"EH"},
            {id: 4, name:"Small Melee Weapon", code:"MS"},
            {id: 5, name:"Medium Melee Weapon", code:"MM"},
            {id: 6, name:"Large Melee Weapon", code:"ML"},
            {id: 7, name:"Projectile", code:"PR"},
            {id: 8, name:"Shield", code:"SH"},
            {id: 9, name:"Light Armour", code:"AL"},
            {id: 10, name:"Medium Armour", code:"AM"},
            {id: 11, name:"Heavy Armour", code:"AH"},
            {id: 12, name:"Energy Field", code:"EF"},
            {id: 13, name:"Science Device - Analyser", code:"SA"},
            {id: 14, name:"Science Device - Detector", code:"SD"},
            {id: 15, name:"Science Device - Scanner", code:"SS"},
            {id: 16, name:"Science Device - Extractor", code:"SE"},
            {id: 17, name:"Medical Device", code:"DM"},
            {id: 18, name:"Device", code:"DG"},
            {id: 19, name:"Psionic Device", code:"DP"}];
    
        await queryRunner.query(`insert into "item_type" (id, name, code, "createdOn", version) values ${it.map((itemType, i) => `('${i+1}', '${itemType.name}', '${itemType.code}', '${ts}', 0)`).join(",")}`);
        
        const abilities = ["+2 Charge Capacity",
            "1 charge to call RESIST to SUNDER",
            "RESIST one EFFECT call or roleplay effect each day",
            "+3 Charge Capacity",
            "You may spend psi points in place of charges when using this item",
            "Resonant Blade Psi Powers can be used with this weapon",
            "1 charge to call FREEZE (5)",
            "1 charge to call THROUGH",
            "2 charges to call DISRUPT",
            "4 charges to call LETHAL",
            "1 charge to call STRIKEDOWN",
            "1 charge to call STRIKE",
            "1 charge to call FREEZE (10)",
            "1 charge to call KNOCKOUT (10)",
            "2 charges to call REND",
            "2 charges to call SUNDER",
            "1 charge to call DISRUPT",
            "1 charge to call DISARM",
            "2 charges to call KNOCKOUT (10)", //special
            "2 charges to call SUNDER to a weapon that strikes this shield",
            "You can move at full speed while under fire with this shield",
            "You may call RESIST to STRIKEDOWN and REPEL attacks that strike this shield.",
            "FREEZE and KNOCKOUT effects that strike this shield are reduced by 10 seconds",
            "RESIST a Call that strikes this shield",
            "2 charges to call REPEL to characters that strike this shield in melee",
            "FREEZE effects that hit you are reduced by 2 seconds",
            "1 charge to instantly restore 1 lost Armour Hit", //needs clarification
            "+1 Armour Hit",
            "1 charge to call RESIST to REND",
            "1 charge to call RESIST to STRIKEDOWN",
            "2 charges to call RESIST to all THROUGH attacks for 30 secs",
            "4 charges to call RESIST to all attacks 30 secs",
            "Energy Field gains 1 Field Hit",
            "Tear 1 charge to initiate a 30-second recharge cycle. After 30 seconds all field hits are restored. If you are struck during this period then the recharge fails and the charges spent are wasted.",
            "Improves device effectiveness. Extractors harvest more samples, Detectors work over wider areas, Analysers grant more detail",
            "Containment, Grants an additional slot for Exotic Substances",
            "Changes an extractor into an Energy Interface (charges anything), and an Analyser into a Field Transducer (maximum detail on Etheric phenomena)",
            "Changes a Detector into a Mineral Scanner (detects mineral deposits over wide area), and an Analyser into a Spectrometer (maximum detail on Corporeal phenomena)",
            "Changes a Detector into a Lifesigns Detector (detects lifesigns over local area), and an Analyser into a Diagnosis Module (allows diagnosis of most Conditions)",
            "Tear 1 charge to instantly reset the target''s Death Count to 0.",
            "You may use this device as part of a meditative rite (such as Rite of Recovery) over minutes in length. When you do so, you can use the Sensing the Web power on other participants in the rite without spending any Psi Points.",
            "2 charges to call FREEZE (20)",
            "Tear 1 charge to halve manual repair time on a single suit of armour for 10 minutes.",
            "If you are carrying this device while under the effect of the Empty Mind Psionic Condition, your emotions are not muted by that Condition.",
            "Tear 1 charge to identify and diagnose a Condition. (Requires a Ref)",
            "Tear 1 charge to collect a sample of a phenomenon. (Requires a Ref)",
            "Tear 1 charge to scan the immediate area for phenomena (requires a Ref)",
            "Tear 1 charge to gather more information from a phenomenon. (Requires a Ref)",
            "Tear 1 charge to scan a wide area for mineral phenomena (requires a Ref)",
            "Tear 1 charge to gather more information from a phenomenon. (Requires a Ref)",
            "Tear 2 charges to deliver an effect equivalent to a dose of Bloodfire Antivirals, but in the space of 30 seconds.",
            "1 Global Field Hit. 1 charge to re-power when not in combat",
            "2 Global Field Hits. 1 charge to re-power when not in combat",
            "3 Global Field Hits. 1 charge to re-power when not in combat",
            "2 charges to call FREEZE (10)",
            "You can spend Psi Points in place of Charges on this item.",
            "Tear 1 charge to gather considerable information from a Corporeal Science phenomenon. (Requires a Ref)",
            "Tear 1 charge to gather considerable information from an Etheric Science phenomenon. (Requires a Ref)",
            "Tear 1 charge to gather enhanced information from a phenomenon. (Requires a Ref)",
            "Tear 1 charge to scan the area for life signs, pointing out where other living creatures are concentrated. (requires a Ref)",
            "Tear 1 charge to scan a wide area for mineral concentrations (requires a Ref)",
            "You may transfer charges from this device to any other item that can hold Charges (including Artefacts)",
            "Tear 1 charge to collect up to 5 samples of a phenomenon. (Requires a Ref)",
            "Tear 1 charge to scan the immediate and wider area for phenomena (requires a Ref)",
            // "+2 Armour Hits",
            // "+3 Armour Hits",
            // "+4 Armour Hits",
            // "+5 Armour Hits",
            // "+6 Armour Hits",
        ];
    
        await queryRunner.query(`insert into "ability"(id, description, "createdOn", version) values ${abilities.map((ability, i) => `(${i+1}, '${ability}', '${ts}', 0)`).join(",\n")}`);
        
        await queryRunner.query(`
insert into "mod"(id, description, "abilityId", "maxStacks", "createdOn", version) values
-- Generic Mods
(1, 'Increased Charge Capacity', 1, 0, '${ts}', 0),
(2, 'Integrity Field', 2, 1, '${ts}', 0),
-- Cultural Mods
(3, 'Talisman', 3, 1, '${ts}', 0),
(4, 'Psi Crystal Battery', 4, 0, '${ts}', 0),
(5, 'Psi Crystal Capacitor', 5, 1, '${ts}', 0),
(6, 'Psi Crystal Matrix', 6, 1, '${ts}', 0),
-- Energy Weapons
(7, 'Shock Bolt', 7, 0, '${ts}', 0),
(8, 'Penetrator Bolt', 8, 1, '${ts}', 0),
(9, 'Disruption Bolt', 9, 1, '${ts}', 0),
(10, 'Kill Bolt', 10, 1, '${ts}', 0),
(11, 'Impact Bolt', 11, 1, '${ts}', 0),
-- Heavy Energy Weapons
(12, 'Heavy Force Bolt', 12, 1, '${ts}', 0),
(13, 'Heavy Shock Bolt', 13, 0, '${ts}', 0),
(14, 'Heavy Stun Bolt', 14, 0, '${ts}', 0),
(15, 'Heavy Shredder Bolt', 15, 1, '${ts}', 0),
(16, 'Heavy Ruin Bolt', 16, 1, '${ts}', 0),
-- Melee Weapons
(17, 'Penetrator Matrix', 8, 1, '${ts}', 0),
(18, 'Shock Matrix', 7, 0, '${ts}', 0),
-- Small Melee
(19,  'Disruption Matrix', 17, 1, '${ts}', 0),
-- Medium Melee
(20,  'Convulsor Matrix', 18, 1, '${ts}', 0),
-- Large Melee
(21,  'Force Matrix', 12, 1, '${ts}', 0),
(22,  'Impact Matrix', 11, 1, '${ts}', 0),
(23,  'Stun Matrix', 19, 0, '${ts}', 0),
(24,  'Shredder Matrix', 15, 1, '${ts}', 0),
(25,  'Ruination Matrix', 16, 1, '${ts}', 0),
-- Shields
(26, 'Reflection Matrix', 20, 1, '${ts}', 0),
(27, 'Compensator Matrix', 21, 1, '${ts}', 0),
(28, 'Force Absorption Matrix', 22, 1, '${ts}', 0),
(29, 'Energy Absorption Matrix', 23, 0, '${ts}', 0),
(30, 'Resistance Matrix', 24, 1, '${ts}', 0),
(31, 'Repulsor Matrix', 25, 1, '${ts}', 0),
-- Armour
(32, 'Shock Distributors', 26, 0, '${ts}', 0),
(33, 'Reinforcement Pattern', 27, 0, '${ts}', 0),
(34,  'Ablative Layers (Light)', 28, 1, '${ts}', 0),
(35,  'Ablative Layers (Medium)', 28, 2, '${ts}', 0),
(36,  'Ablative Layers (Heavy)', 28, 3, '${ts}', 0),
(37, 'Integrity Pattern', 29, 1, '${ts}', 0),
(38, 'Stabilisers', 30, 1, '${ts}', 0),
(39, 'Weave Solidifier', 31, 1, '${ts}', 0),
(40, 'Deflection Generator', 32, 1, '${ts}', 0),
-- Energy Fields
(41, 'Field Strengthener', 33, 1, '${ts}', 0), --does not stack?
(42, 'Combat Repower', 34, 4, '${ts}', 0), --not sure about max here
-- Science Devices
(43, 'Amplified Gain', 35, 0, '${ts}', 0),
(44, 'Flexible Energy', 36, 1, '${ts}', 0),
(45, 'Etheric Science Focus', 37, 1, '${ts}', 0),
(46, 'Corporeal Science Focus', 38, 1, '${ts}', 0),
(47, 'Life Science Focus', 39, 1, '${ts}', 0);`);
    
        await queryRunner.query(`insert into mod_restricted_to_item_type ("modId", "itemTypeId") values
(7, 1),(7, 2),(7, 3),
(8, 1),(8, 2),(8, 3),
(9, 1),(9, 2),(9, 3),
(10, 1),(10, 2),(10, 3),
(11, 1),(11, 2),(11, 3),
(12, 3),
(13, 3),
(14, 3),
(15, 3),
(16, 3),
(17, 4),(17, 5),(17, 6),
(18, 4),(18, 5),(18, 6),
(19, 4),
(20, 5),
(21, 6),
(22, 6),
(23, 6),
(24, 6),
(25, 6),
(26, 8),
(27, 8),
(28, 8),
(29, 8),
(30, 8),
(31, 8),
(32, 9),(32, 10),(32, 11),
(33, 9),(33, 10),(33, 11),
(34, 9),
(35, 10),
(36, 11),
(37, 9),(37, 10),(37, 11),
(38, 9),(38, 10),(38, 11),
(39, 9),(39, 10),(39, 11),
(40, 9),(40, 10),(40, 11),
(41, 12), --does not stack?
(42, 12), --not sure about max here
(43, 13),
(44, 13),
(45, 13),
(46, 13),
(47, 13);`);
    
        await queryRunner.query(`
insert into "audit" ("auditType", "abilityId", "createdOn") values
${[...Array(38).keys()].map(key => `(0, ${key+1},'${ts}')`).join(",")}`);
    
        await queryRunner.query(`
insert into "audit" ("auditType", "modId", "createdOn") values
${[...Array(46).keys()].map(key => `(0, ${key+1},'${ts}')`).join(",")}`);
    
        await queryRunner.query(`SELECT setval('mod_id_seq', ${47})`);
        await queryRunner.query(`SELECT setval('ability_id_seq', ${abilities.length})`);
        
        await queryRunner.query(``);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
