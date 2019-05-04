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

const files = fs.readdirSync("./resources");
files.filter(file => file.charAt(0) !== "~").forEach(file => readFile("./resources/"+file, (r) => {
    r.forEach((item:IImportItem) => {
        axios.post("http://127.0.0.1:3000/item-import", item);
    });
}));

function readFile(filePath:string, cb:(items:IImportItem[]) => void)
{
    yauzl.open( filePath, function( err, zipfile )
    {
        if ( err ) {
            return;
        }
        
        zipfile.on( 'entry', function( entry ) {
            if ( entry.fileName === 'content.xml' ) {
                getTextFromZipFile(zipfile, entry, (error, text) => {
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
                            const modelId = parseInt(serial.substring(2,6));
                            const itemId = parseInt(serial.substring(7));
                            
                            return {
                                itemTypeName: frontLeft.itemType.name,
                                name: frontLeft.name,
                                abilityDescriptions: frontLeft.abilities,
                                maxCharges: frontLeft.maxCharges,
                                baseCost: backLeft.cost,
                                serial: backRight.serial,
                                modDescriptions: backRight.modDescriptions,
                                modelId,
                                itemId,
                                exoticSlot:frontRight.text === "Exotic Substance"
                            };
                        });
                    cb(items);
                })
            }
        });
    });
}

const abilityReqRegex = new RegExp(/^Abilities\s?(\((.*)\))*:\|(.*)$/);
const maxChargesRegex = new RegExp(/(.*)\|(Max\sCharges\s-\s(\d+))?$/);
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
        maxCharges = null;
    }
    else
    {
        maxCharges = parseInt(maxChargesMatches[3]);
        if(!isFinite(maxCharges)) maxCharges = null;
        rest = maxChargesMatches[1];
    }
    
    let abilities = [];
    if(rest !== 'None')
    {
        abilities = rest.split("|");
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
    const maintenanceCost = backLeftRegexMatches[3];
    const modCost = backLeftRegexMatches[5];
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

function getTextFromZipFile( zipfile, entry, cb ) {
    zipfile.openReadStream( entry, function( err, readStream ) {
        var text = ''
            , error = ''
        ;
        
        if ( err ) {
            cb( err, null );
            return;
        }
        
        readStream.on( 'data', function( chunk ) {
            text += chunk;
        });
        readStream.on( 'end', function() {
            if ( error.length > 0 ) {
                cb( error, null );
            } else {
                cb( null, text );
            }
        });
        readStream.on( 'error', function( _err ) {
            error += _err;
        });
    });
}
// {
//     textract.fromFileWithPath(path, {preserveLineBreaks: true, tesseract:{lang:"odt"}}, function( error, text ) {
//
//         console.log("reading", path);
//         if(error)
//         {
//             console.log("ERROR", path, error);
//             return;
//         }
//
//         console.log(text);
//         console.log(text.split("\n"));
//
//         // const items = text.split(/Advanced Armaments|Analyser|Spectrometer|Diagnosis Module|Scanner|Energy Interface|Field Transducer|Extractor|Detector|Psionic Device/)
//         //     .map(r => r.trim())
//         //     .filter(item => !!item)
//         //     .map(rawItem => {
//         //         let item = {};
//         //         itemTypes.forEach(itemType => {
//         //             let index;
//         //             console.log(rawItem);
//         //             // if((index = rawItem.indexOf("Light Energy Weapon")) > -1)
//         //             // {
//         //             //     const rest = rawItem.slice(index + itemType.length);
//         //             //     const matcher = rest.match(/Abilities: (.*) Max Charges...([0-9]*) (.*Cost: ([0-9]+))*.*Expires before (end )*(..) ID ..(......-...)(.Mods...(.*))*/);
//         //             //     if(!matcher) console.log(rawItem);
//         //             //     item = {
//         //             //         name: rawItem.slice(0,index-1),
//         //             //         type: itemType,
//         //             //         abilities:matcher[1],
//         //             //         maxCharges:matcher[2],
//         //             //         cost:matcher[4],
//         //             //         expiresBefore:matcher[6],
//         //             //         id:matcher[7],
//         //             //         modsAndNotes:matcher[9],
//         //             //     };
//         //             // }
//         //         });
//         //         return item;
//         //     })
//         //     .filter(i => !!i.name);
//
//         // items.forEach(item => {
//         //     console.log([item.id, item.name, item.type, item.abilities, item.maxCharges, item.cost, item.expiresBefore, item.modsAndNotes].join("\t"));
//         // })
//     });
// }
