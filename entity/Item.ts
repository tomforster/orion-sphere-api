import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
import {ItemDefinition} from "./ItemDefinition";
import {IsPositive} from "class-validator";

@Entity()
export class Item
{
    @IsPositive()
    @PrimaryGeneratedColumn()
    id:number;
    
    @OneToOne(type => ItemDefinition)
    @JoinColumn()
    itemDefinition:ItemDefinition;
    
    constructor(id:number = 0, itemDefinition:ItemDefinition)
    {
        this.id = id;
        this.itemDefinition = itemDefinition;
    }
}