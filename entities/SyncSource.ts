import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn} from "typeorm";
  

@Entity("sync_source")
export class SyncSource { 
    @PrimaryColumn({name: "id"}) 
    id: string;

    @Column({name: "name"}) 
    name: string;

    @Column({name: "host"}) 
    host: string;

    @Column({name: "port"}) 
    port: string;

    @Column({name: "username"}) 
    username: string;

    @Column({name: "password"}) 
    password: string;

    @Column({name: "db"}) 
    db: string;

    @Column({name: "updated_by"}) 
    updatedBy: string;

    @Column({name: "updated_on"}) 
    updatedOn: Date;
   
}

