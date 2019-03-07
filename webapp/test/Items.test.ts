import {Selector} from 'testcafe'; // first import testcafe selectors

fixture `Items`
    .page `http://localhost:3000/#!/items`;

const it = ["Light Energy Weapon", "Medium Energy Weapon", "Heavy Energy Weapon", "Small Melee Weapon", "Medium Melee Weapon",
    "Large Melee Weapon", "Projectile", "Shield", "Light Armour", "Medium Armour", "Heavy Armour", "Energy Field",
    "Science Device", "Medical Device", "General Device"];


it.forEach(itemType => {
    test(`Selecting item type ${itemType} filters page`, async  t => {
            await t
                .click(Selector("select"))
                .click(Selector("option").withText(itemType))
                .expect(Selector('td.item-type').innerText).eql(itemType);
    })
});

