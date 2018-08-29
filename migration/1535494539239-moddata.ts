import {MigrationInterface, QueryRunner} from "typeorm";

export class moddata1535494539239 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // language=PostgreSQL
        return queryRunner.query(`
-- Abilties
insert into "orion_sphere"."ability"(id, description, "chargeCost") values
(1, '+2 Charge Capacity', 0),
(2, 'Resist a SUNDER call that hits this weapon, shield or device', 1),
(3, 'RESIST one EFFECT call or roleplay effect each day', 0),
(4, '+3 Charge Capacity', 0),
(5, 'You may spend psi points in place of Charges when using this item', 0),
(6, 'Weapon can be used with the Resonant Blade psionic powers', 0),
(7, 'FREEZE(5)', 1),
(8, 'THROUGH', 1),
(9, 'DISRUPT', 2),
(10, 'LETHAL', 4),
(11, 'STRIKEDOWN', 1),
(12, 'STRIKE', 1),
(13, 'FREEZE(10)', 1),
(14, 'KNOCKOUT(10)', 1),
(15, 'REND', 2),
(16, 'SUNDER', 2),
(17, 'DISRUPT', 1),
(18, 'DISARM', 1),
(19, 'KNOCKOUT(10)', 2), --special
(20, 'SUNDER a melee weapon that strikes this shield.', 2),
(21, 'You may move at full speed while under fire using this shield', 0),
(22, 'You may call RESIST to STRIKEDOWN and REPEL attacks that strike this shield', 0),
(23, 'Reduce the duration of FREEZE and KNOCKOUT attacks that strike this shield by 10 seconds', 0),
(24, 'RESIST a Call that strikes this shield', 1),
(25, 'REPEL a character that strikes this shield with a melee weapon', 2),
(26, 'Reduce FREEZE duration by 2 seconds', 0),
(27, 'Restore 1 lost hit on a location. Can be applied multiple times to restore more hits per Charge expended', 1), --needs clarification
(28, 'Adds 1 Armour Hit to the armour', 0),
(29, 'RESIST(REND)', 1),
(30, 'RESIST(STRIKEDOWN)', 1),
(31, 'RESIST(THROUGH) at no cost for 30 seconds', 2),
(32, 'RESIST to all attacks at no cost for 30 seconds', 4),
(33, 'Energy Field gains 1 Field Hit', 0),
(34, 'Tear 1 charge to initiate a 30-second recharge cycle. After 30 seconds all field hits are restored. If you are struck during this period then the recharge fails and the charges spent are wasted.', 1),
(35, 'Improves device effectiveness. Extractors harvest more samples, Detectors work over wider areas, Analysers grant more detail', 0),
(36, 'Containment, Grants an additional slot for Exotic Substances', 0),
(37, 'Changes an extractor into an Energy Interface (charges anything), and an Analyser into a Field Transducer (maximum detail on Etheric phenomena)', 0),
(38, 'Changes a Detector into a Mineral Scanner (detects mineral deposits over wide area), and an Analyser into a Spectrometer (maximum detail on Corporeal phenomena)', 0),
(39, 'Changes a Detector into a Lifesigns Detector (detects lifesigns over local area), and an Analyser into a Diagnosis Module (allows diagnosis of most Conditions)', 0);
        `).then(
// language=PostgreSQL
            () => queryRunner.query(`
-- Mods
insert into "orion_sphere"."mod"(id, "modType", description, "abilityId", "maxStacks") values
-- Generic Mods
(1, 'GEN', 'Increase Charge Capacity', 1, 0),
(2, 'GEN', 'Integrity Field', 2, 1),

-- Cultural Mods
(3, 'CUL', 'Talisman', 3, 1),
(4, 'CUL', 'Psi Crystal Battery', 4, 0),
(5, 'CUL', 'Psi Crystal Capacitor', 5, 1),
(6, 'CUL', 'Psi Crystal Matrix', 6, 1),

-- Energy Weapons
(7, 'EW', 'Shock Bolt', 7, 0),
(8, 'EW', 'Penetrator Bolt', 8, 1),
(9, 'EW', 'Disruption Bolt', 9, 1),
(10, 'EW', 'Kill Bolt', 10, 1),
(11, 'EW', 'Impact Bolt', 11, 1),

-- Heavy Energy Weapons
(12, 'EWH', 'Heavy Force Bolt', 12, 1),
(13, 'EWH', 'Heavy Shock Bolt', 13, 0),
(14, 'EWH', 'Heavy Stun Bolt', 14, 0),
(15, 'EWH', 'Heavy Shredder Bolt', 15, 1),
(16, 'EWH', 'Heavy Ruin Bolt', 16, 1),

-- Melee Weapons
(17, 'MW', 'Penetrator Matrix', 8, 1),
(18, 'MW', 'Shock Matrix', 7, 0),

-- Small Melee
(19, 'MWS', 'Disruption Matrix', 17, 1),

-- Medium Melee
(20, 'MWM', 'Convulsor Matrix', 18, 1),

-- Large Melee
(21, 'MWL', 'Force Matrix', 12, 1),
(22, 'MWL', 'Impact Matrix', 11, 1),
(23, 'MWL', 'Stun Matrix', 19, 0),
(24, 'MWL', 'Shredder Matrix', 15, 1),
(25, 'MWL', 'Ruination Matrix', 16, 1),

-- Shields
(26, 'SH', 'Reflection Matrix', 20, 1),
(27, 'SH', 'Compensator Matrix', 21, 1),
(28, 'SH', 'Force Absorption Matrix', 22, 1),
(29, 'SH', 'Energy Absorption Matrix', 23, 0),
(30, 'SH', 'Resistance Matrix', 24, 1),
(31, 'SH', 'Repulsor Matrix', 25, 1),

-- Armour
(32, 'AR', 'Shock Distributors', 26, 0),
(33, 'AR', 'Reinforcement Pattern', 27, 0),
(34, 'ARL', 'Ablative Layers (Light)', 28, 1),
(35, 'ARM', 'Ablative Layers (Medium)', 28, 2),
(36, 'ARH', 'Ablative Layers (Heavy)', 28, 3),
(37, 'AR', 'Integrity Pattern', 29, 1),
(38, 'AR', 'Stabilisers', 30, 1),
(39, 'AR', 'Weave Solidifier', 31, 1),
(40, 'AR', 'Deflection Generator', 32, 1),

-- Energy Fields
(41, 'EF', 'Field Strengthener', 33, 1), --does not stack?
(42, 'EF', 'Combat Repower', 34, 4), --not sure about max here

-- Science Devices
(43, 'SD', 'Amplified Gain', 35, 0),
(44, 'SD', 'Flexible Energy', 36, 1),
(45, 'SD', 'Etheric Focus', 37, 1),
(46, 'SD', 'Corporeal Focus', 38, 1),
(47, 'SD', 'Life Focus', 39, 1);
        `))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
