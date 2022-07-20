import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1620846522705 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table(
                {
                    name: "users",
                    columns: [
                        {
                            name: "id",
                            type: "uuid",
                            isPrimary: true
                        },
                        {
                            name: "username",
                            type: "varchar"
                        },
                        {
                            name: "name",
                            type: "varchar"
                        },
                        {
                            name: "email",
                            type: "varchar",
                            isUnique: true
                        },
                        {
                            name: "password",
                            type: "varchar",
                        },
                        {
                            name: "avatar",
                            type: "varchar",
                            isNullable: true
                        },
                        {
                            name: "bio",
                            type: "varchar",
                            isNullable: true
                        },
                        {
                            name: "isAdmin",
                            type: "boolean",
                            default: false
                        },
                        {
                            name: "google_id",
                            type: "varchar",
                            isUnique: true,
                            isNullable: true
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
        await queryRunner.dropTable("users");
    }

}
