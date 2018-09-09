import {MigrationInterface, QueryRunner} from "typeorm";

export class moddata1535494539239 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const ts = new Date().toLocaleString().replace(",", "");
        
        // language=PostgreSQL
        await queryRunner.query(`
insert into "orion_sphere"."ability"(id, description, "chargeCost", "createdOn", version) values
(1, '+2 Charge Capacity', 0, '${ts}', 0),
(2, 'Resist a SUNDER call that hits this weapon, shield or device', 1, '${ts}', 0),
(3, 'RESIST one EFFECT call or roleplay effect each day', 0, '${ts}', 0),
(4, '+3 Charge Capacity', 0, '${ts}', 0),
(5, 'You may spend psi points in place of Charges when using this item', 0, '${ts}', 0),
(6, 'Weapon can be used with the Resonant Blade psionic powers', 0, '${ts}', 0),
(7, 'FREEZE(5)', 1, '${ts}', 0),
(8, 'THROUGH', 1, '${ts}', 0),
(9, 'DISRUPT', 2, '${ts}', 0),
(10, 'LETHAL', 4, '${ts}', 0),
(11, 'STRIKEDOWN', 1, '${ts}', 0),
(12, 'STRIKE', 1, '${ts}', 0),
(13, 'FREEZE(10)', 1, '${ts}', 0),
(14, 'KNOCKOUT(10)', 1, '${ts}', 0),
(15, 'REND', 2, '${ts}', 0),
(16, 'SUNDER', 2, '${ts}', 0),
(17, 'DISRUPT', 1, '${ts}', 0),
(18, 'DISARM', 1, '${ts}', 0),
(19, 'KNOCKOUT(10)', 2, '${ts}', 0), --special
(20, 'SUNDER a melee weapon that strikes this shield.', 2, '${ts}', 0),
(21, 'You may move at full speed while under fire using this shield', 0, '${ts}', 0),
(22, 'You may call RESIST to STRIKEDOWN and REPEL attacks that strike this shield', 0, '${ts}', 0),
(23, 'Reduce the duration of FREEZE and KNOCKOUT attacks that strike this shield by 10 seconds', 0, '${ts}', 0),
(24, 'RESIST a Call that strikes this shield', 1, '${ts}', 0),
(25, 'REPEL a character that strikes this shield with a melee weapon', 2, '${ts}', 0),
(26, 'Reduce FREEZE duration by 2 seconds', 0, '${ts}', 0),
(27, 'Restore 1 lost hit on a location. Can be applied multiple times to restore more hits per Charge expended', 1, '${ts}', 0), --needs clarification
(28, 'Adds 1 Armour Hit to the armour', 0, '${ts}', 0),
(29, 'RESIST(REND)', 1, '${ts}', 0),
(30, 'RESIST(STRIKEDOWN)', 1, '${ts}', 0),
(31, 'RESIST(THROUGH) at no cost for 30 seconds', 2, '${ts}', 0),
(32, 'RESIST to all attacks at no cost for 30 seconds', 4, '${ts}', 0),
(33, 'Energy Field gains 1 Field Hit', 0, '${ts}', 0),
(34, 'Tear 1 charge to initiate a 30-second recharge cycle. After 30 seconds all field hits are restored. If you are struck during this period then the recharge fails and the charges spent are wasted.', 1, '${ts}', 0),
(35, 'Improves device effectiveness. Extractors harvest more samples, Detectors work over wider areas, Analysers grant more detail', 0, '${ts}', 0),
(36, 'Containment, Grants an additional slot for Exotic Substances', 0, '${ts}', 0),
(37, 'Changes an extractor into an Energy Interface (charges anything), and an Analyser into a Field Transducer (maximum detail on Etheric phenomena)', 0, '${ts}', 0),
(38, 'Changes a Detector into a Mineral Scanner (detects mineral deposits over wide area), and an Analyser into a Spectrometer (maximum detail on Corporeal phenomena)', 0, '${ts}', 0),
(39, 'Changes a Detector into a Lifesigns Detector (detects lifesigns over local area), and an Analyser into a Diagnosis Module (allows diagnosis of most Conditions)', 0, '${ts}', 0);
        `);
// language=PostgreSQL
        
        await queryRunner.query(`
insert into "orion_sphere"."mod"(id, description, "abilityId", "maxStacks", "restrictedTo" , "createdOn", version) values
-- Generic Mods
(1, 'Increase Charge Capacity', 1, 0, '', '${ts}', 0),
(2, 'Integrity Field', 2, 1, '', '${ts}', 0),
-- Cultural Mods
(3, 'Talisman', 3, 1, '', '${ts}', 0),
(4, 'Psi Crystal Battery', 4, 0, '', '${ts}', 0),
(5, 'Psi Crystal Capacitor', 5, 1, '', '${ts}', 0),
(6, 'Psi Crystal Matrix', 6, 1, '', '${ts}', 0),
-- Energy Weapons
(7, 'Shock Bolt', 7, 0, 'EL,EM,EH', '${ts}', 0),
(8, 'Penetrator Bolt', 8, 1, 'EL,EM,EH', '${ts}', 0),
(9, 'Disruption Bolt', 9, 1, 'EL,EM,EH', '${ts}', 0),
(10, 'Kill Bolt', 10, 1, 'EL,EM,EH', '${ts}', 0),
(11, 'Impact Bolt', 11, 1, 'EL,EM,EH', '${ts}', 0),
-- Heavy Energy Weapons
(12, 'Heavy Force Bolt', 12, 1, 'EH', '${ts}', 0),
(13, 'Heavy Shock Bolt', 13, 0, 'EH', '${ts}', 0),
(14, 'Heavy Stun Bolt', 14, 0, 'EH', '${ts}', 0),
(15, 'Heavy Shredder Bolt', 15, 1, 'EH', '${ts}', 0),
(16, 'Heavy Ruin Bolt', 16, 1, 'EH', '${ts}', 0),
-- Melee Weapons
(17, 'Penetrator Matrix', 8, 1, 'MS,MM,ML', '${ts}', 0),
(18, 'Shock Matrix', 7, 0, 'MS,MM,ML', '${ts}', 0),
-- Small Melee
(19,  'Disruption Matrix', 17, 1, 'MS', '${ts}', 0),
-- Medium Melee
(20,  'Convulsor Matrix', 18, 1, 'MM', '${ts}', 0),
-- Large Melee
(21,  'Force Matrix', 12, 1, 'ML', '${ts}', 0),
(22,  'Impact Matrix', 11, 1, 'ML', '${ts}', 0),
(23,  'Stun Matrix', 19, 0, 'ML', '${ts}', 0),
(24,  'Shredder Matrix', 15, 1, 'ML', '${ts}', 0),
(25,  'Ruination Matrix', 16, 1, 'ML', '${ts}', 0),
-- Shields
(26, 'Reflection Matrix', 20, 1, 'SH', '${ts}', 0),
(27, 'Compensator Matrix', 21, 1, 'SH', '${ts}', 0),
(28, 'Force Absorption Matrix', 22, 1, 'SH', '${ts}', 0),
(29, 'Energy Absorption Matrix', 23, 0, 'SH', '${ts}', 0),
(30, 'Resistance Matrix', 24, 1, 'SH', '${ts}', 0),
(31, 'Repulsor Matrix', 25, 1, 'SH', '${ts}', 0),
-- Armour
(32, 'Shock Distributors', 26, 0, 'AL,AM,AH', '${ts}', 0),
(33, 'Reinforcement Pattern', 27, 0, 'AL,AM,AH', '${ts}', 0),
(34,  'Ablative Layers (Light)', 28, 1, 'AL', '${ts}', 0),
(35,  'Ablative Layers (Medium)', 28, 2, 'AM', '${ts}', 0),
(36,  'Ablative Layers (Heavy)', 28, 3, 'AH', '${ts}', 0),
(37, 'Integrity Pattern', 29, 1, 'AL,AM,AH', '${ts}', 0),
(38, 'Stabilisers', 30, 1, 'AL,AM,AH', '${ts}', 0),
(39, 'Weave Solidifier', 31, 1, 'AL,AM,AH', '${ts}', 0),
(40, 'Deflection Generator', 32, 1, 'AL,AM,AH', '${ts}', 0),
-- Energy Fields
(41, 'Field Strengthener', 33, 1, 'EF', '${ts}', 0), --does not stack?
(42, 'Combat Repower', 34, 4, 'EF', '${ts}', 0), --not sure about max here
-- Science Devices
(43, 'Amplified Gain', 35, 0, 'DS', '${ts}', 0),
(44, 'Flexible Energy', 36, 1, 'DS', '${ts}', 0),
(45, 'Etheric Focus', 37, 1, 'DS', '${ts}', 0),
(46, 'Corporeal Focus', 38, 1, 'DS', '${ts}', 0),
(47, 'Life Focus', 39, 1, 'DS', '${ts}', 0);
        `);
    
        await queryRunner.query(`
insert into "orion_sphere"."audit" ("auditType", "abilityId", "createdOn") values
${[...Array(38).keys()].map(key => `(0, ${key+1},'${ts}')`).join(",")}`);
    
        await queryRunner.query(`
insert into "orion_sphere"."audit" ("auditType", "modId", "createdOn") values
${[...Array(46).keys()].map(key => `(0, ${key+1},'${ts}')`).join(",")}`);
    
    
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
