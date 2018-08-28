import {IsPositive} from "class-validator";
import {PrimaryGeneratedColumn} from "typeorm";

export class DomainEntity
{
    @IsPositive()
    @PrimaryGeneratedColumn()
    id:number;
}