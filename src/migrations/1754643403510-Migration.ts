import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754643403510 implements MigrationInterface {
    name = 'Migration1754643403510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notes\` (\`note_id\` varchar(36) NOT NULL, \`note_title\` varchar(255) NOT NULL, \`note_content\` text NOT NULL, \`last_update\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_on\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NOT NULL, INDEX \`IDX_7708dcb62ff332f0eaf9f0743a\` (\`user_id\`), PRIMARY KEY (\`note_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`user_id\` varchar(36) NOT NULL, \`user_name\` varchar(255) NOT NULL, \`user_email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`last_update\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_on\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_074a1f262efaca6aba16f7ed92\` (\`user_name\`), UNIQUE INDEX \`IDX_643a0bfb9391001cf11e581bdd\` (\`user_email\`), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notes\` ADD CONSTRAINT \`FK_7708dcb62ff332f0eaf9f0743a7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notes\` DROP FOREIGN KEY \`FK_7708dcb62ff332f0eaf9f0743a7\``);
        await queryRunner.query(`DROP INDEX \`IDX_643a0bfb9391001cf11e581bdd\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_074a1f262efaca6aba16f7ed92\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_7708dcb62ff332f0eaf9f0743a\` ON \`notes\``);
        await queryRunner.query(`DROP TABLE \`notes\``);
    }

}
