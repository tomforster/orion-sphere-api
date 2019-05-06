/**
 * @author Tom Forster <tom.forster@mpec.co.uk>
 *         Date: 2019-03-20
 */

import * as fs from "fs";
import * as yauzl from "yauzl";
import {JSDOM} from "jsdom";
import {IImportItem} from "../interfaces/IImportItem";
import axios from "axios";

const itemTypes = [
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
    {id: 19, name:"Psionic Device", code:"DP"}
];

// const file = "OSLRP - Armour Lammies.odt";
// const file = "OSLRP - Devices.odt";
// const file = "OSLRP - Energy Fields Lammies.odt";
// const file = "OSLRP - Energy Weapon Lammies.odt";
// const file = "OSLRP - Melee Weapon Lammies.odt";
// const file = "OSLRP - Science Device Lammies.odt";
// const file = "OSLRP - Shield Lammies.odt";

const files = fs.readdirSync("./resources");

init();

async function init()
{
    for (const file of files.filter(file => file.charAt(0) !== "~"))
    {
        await readFile("./resources/"+file).then(async items =>
        {
            for(let i = 0; i < items.length; i++)
            {
                const item = items[i];
                console.log("posting item: ", item);
                await axios.post("http://127.0.0.1:3000/item-import", item);
            }
        });
    }
}

async function readFile(filePath:string):Promise<IImportItem[]>
{
    console.log("Reading file:", filePath);
    return new Promise((resolve, reject) =>
    {
        yauzl.open( filePath, function( err, zipfile )
        {
            if (err)
            {
                reject(err);
                return;
            }
    
            zipfile.on('entry', async (entry) =>
            {
                if (entry.fileName === 'content.xml')
                {
                    try
                    {
                        const text = await getTextFromZipFile(zipfile, entry);
                        const dom = new JSDOM(text);
                        const items:IImportItem[] = Array.from(dom.window.document.querySelectorAll("table\\:table-row"))
                            .map((row:any) =>
                            {
                                const children = Array.from(row.childNodes);
                                const frontLeft = processFrontLeft(children[0] as HTMLUnknownElement),
                                    frontRight = processFrontRight(children[1] as HTMLUnknownElement),
                                    backLeft = processBackLeft(children[2] as HTMLUnknownElement),
                                    backRight = processBackRight(children[3] as HTMLUnknownElement);
                
                                const serial = backRight.serial;
                                const modelId = parseInt(serial.substring(2, 6));
                                const itemId = parseInt(serial.substring(7));
                
                                return {
                                    itemTypeName: frontLeft.itemType.name,
                                    name: frontLeft.name,
                                    abilityDescriptions: frontLeft.abilities,
                                    maxCharges: frontLeft.maxCharges || 0,
                                    baseCost: backLeft.cost || backLeft.maintenanceCost,
                                    serial: backRight.serial,
                                    modDescriptions: backRight.modDescriptions,
                                    modelId,
                                    itemId,
                                    exoticSlot: frontRight.text === "Exotic Substance",
                                    maintOnly: !backLeft.cost
                                };
                            });
                        resolve(items);
                    } catch (e)
                    {
                        reject(e);
                    }
                }
            });
        });
    })
}

const abilityReqRegex = new RegExp(/^Abilities\s?(\((.*)\))*:\|(.*)$/);
const maxChargesRegex = new RegExp(/^((.*)\|)?(Max\sCharges\s-\s(\d+))?$/);
const backLeftRegex = new RegExp(/^(Cost:\s?(\d+)\.?\s?)?Maint:\s?(\d+)(\s?Mod:\s?(\d+))?$/);
const backRightRegex = new RegExp(/^Expires\sbefore\sE(\d+)\sID\s([-–])\s?([\w][\w][\d][\d][\d][\d]-\d+)\|?(.*)$/);

function processFrontLeft(node:HTMLUnknownElement)
{
    const elements:HTMLUnknownElement[] = Array.from(node.childNodes) as HTMLUnknownElement[];
    
    const typeElementIndex = elements.findIndex(element => !!itemTypes.find(itemType => element.textContent === itemType.name));
    
    if(typeElementIndex < 0) throw new Error("bad element found " + JSON.stringify(elements));
    
    const name = elements.slice(0, typeElementIndex).map(e => e.textContent).join(" ");
    const itemType = itemTypes.find(itemType => elements[typeElementIndex].textContent === itemType.name);
    let rest = elements.slice(typeElementIndex+1).map(e => e.textContent).join("|");
    const abilityReqMatches = abilityReqRegex.exec(rest);
    const abilityReq = abilityReqMatches[2];
    rest = abilityReqMatches[3];
    const maxChargesMatches = maxChargesRegex.exec(rest);
    let maxCharges:number;
    if(!maxChargesMatches)
    {
        if(node.innerHTML.indexOf("Max") > -1) console.log(rest);
        maxCharges = null;
    }
    else
    {
        maxCharges = parseInt(maxChargesMatches[4]);
        if(!isFinite(maxCharges)) maxCharges = null;
        rest = maxChargesMatches[2];
    }
    
    let abilities = [];
    if(rest && rest !== 'None')
    {
        abilities = rest
            .split("|")
            .map(ability =>
            {
                return ability
                    .trim()
                    .replace("1 Charge", "1 charge")
                    .replace("1 charges", "1 charge")
                    .replace("2 Charges", "2 charges")
                    .replace("4 Charges", "4 charges")
                    .replace("1 charge RESIST", "1 charge to call RESIST")
                    .replace("RESIST(REND)", "RESIST to REND")
                    .replace("RESIST(STRIKEDOWN)", "RESIST to STRIKEDOWN");
            });
    }
    
    return {maxCharges, abilities, itemType, name, abilityReq};
}

function processFrontRight(node:HTMLUnknownElement)
{
    const elements:HTMLUnknownElement[] = Array.from(node.childNodes) as HTMLUnknownElement[];
    
    return {text:elements.map(element => element.textContent).join(" ")};
}

function processBackLeft(node:HTMLUnknownElement)
{
    const elements:HTMLUnknownElement[] = Array.from(node.childNodes) as HTMLUnknownElement[];
    
    const rest = elements.map(element => element.textContent).join(" ");
    const backLeftRegexMatches = backLeftRegex.exec(rest);
    const cost = parseInt(backLeftRegexMatches[2]);
    const maintenanceCost = parseInt(backLeftRegexMatches[3]);
    const modCost = parseInt(backLeftRegexMatches[5]);
    return {cost, maintenanceCost, modCost};
}

function processBackRight(node:HTMLUnknownElement)
{
    const elements:HTMLUnknownElement[] = Array.from(node.childNodes) as HTMLUnknownElement[];
    
    let rest = elements.map(element => element.textContent).join("|");
    const backRightRegexMatches = backRightRegex.exec(rest);
    const expiry = backRightRegexMatches[1];
    const serial = backRightRegexMatches[3];
    rest = backRightRegexMatches[4];
    let rawMods = [];
    if(rest.indexOf("None") == -1)
    {
        rawMods = rest.split("|").filter(t => !!t).slice(1);
    }
    
    const modDescriptions:string[] = [];
    
    rawMods.forEach(mod => {
        let m = mod.match(/^(.*)(\sX(\d+))$/);
        if(m && parseInt(m[3])){
            for(let i = 0; i < parseInt(m[3]); i++)
            {
                const modText:string = m[1];
                modDescriptions.push(modText);
            }
        }
        else
        {
            modDescriptions.push(mod);
        }
    });
    
    return {expiry, serial, modDescriptions:modDescriptions};
}

async function getTextFromZipFile( zipfile, entry): Promise<string>
{
    return new Promise((resolve, reject) =>
    {
        zipfile.openReadStream( entry, ( err, readStream ) =>
        {
            let text = '',
                error = '';
        
            if ( err ) {
                reject(err);
                return;
            }
        
            readStream.on( 'data', chunk => text += chunk);
            
            readStream.on( 'end', () =>
            {
                if ( error.length > 0 ) {
                    reject(error);
                } else {
                    resolve(text);
                }
            });
            
            readStream.on( 'error', function( _err ) {
                error += _err;
            });
        });
    });
}