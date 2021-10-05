import { hash } from "bcrypt";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    username: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column()
    address: string

    @Column()
    state: string

    @Column()
    city: string

    @BeforeInsert()
    async beforeInsert() {
        this.password = await hash(this.password, 10)
    }
}