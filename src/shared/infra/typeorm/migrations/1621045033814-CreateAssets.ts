import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAssets1621045033814 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "assets",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true
                        },
                        {
                            name: "name",
                            type: "varchar"
                        },
                        {
                            name: "ticker",
                            type: "varchar",
                            isUnique: true
                        },
                        {
                            name: "latest_price",
                            type: "numeric",
                            isNullable: true,
                        },
                        {
                            name: "is_subscribed",
                            type: "boolean",
                            default: true,
                        },
                        {
                            name: "created_at",
                            type: "timestamp",
                            default: "now()"
                        },
                        {
                            name: "updated_at",
                            type: "timestamp",
                            default: "now()"
                        },
                    ]
                }
            )
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("assets");
    }

}
