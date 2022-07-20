import { Column, CreateDateColumn, Entity, PrimaryColumn, Timestamp, UpdateDateColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity("assets")
class Asset {
    @PrimaryColumn()
    id?: string;

    @Column()
    name: string;

    @Column()
    latest_price: number;

    @Column()
    is_subscribed: boolean;

    @Column()
    ticker: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }
    }
}

export { Asset };
