import sqlite from 'sqlite';
import config from './config';
import { normalizePlateNumber } from './functions';

export default class Database {
  async close() {
    await this.db.close();
  }

  async init() {
    if (Database.db) {
      this.db = Database.db;
    } else {
      this.db = await sqlite.open(config.dbFileName);
      Database.db = this.db;
      console.info('DB is ready.');
    }
  }

  async getPersistentConfig() {
    if (!this.persistentConfig) {
      if (!this.isOpen()) {
        await this.init();
      }
      const configRows = await this.db.all('SELECT key, value FROM config');
      const persistentConfig = {};
      configRows.forEach(configRecord => {
        switch (configRecord.key) {
          case 'minConfidence':
          case 'minNumberLength':
          case 'recognitionDelay':
            persistentConfig[configRecord.key] = parseInt(
              configRecord.value,
              10,
            );
            break;
          default:
            persistentConfig[configRecord.key] = configRecord.value;
        }
      });
      this.persistentConfig = persistentConfig;
    }
    return this.persistentConfig;
  }

  async getPlateByNumber(number) {
    if (!this.isOpen()) {
      await this.init();
    }
    return this.db.get(
      'SELECT * FROM plates WHERE number = ?',
      normalizePlateNumber(number),
    );
  }

  async registerEncounter(number) {
    console.info(`registerEncounter(${number})`);
    if (!this.isOpen()) {
      await this.init();
    }
    const plate = await this.getPlateByNumber(number);
    if (plate) {
      await this.db.run(
        "UPDATE plates ON number = ? SET last_seen = DATETIME('NOW')",
        number,
      );
    } else {
      await this.db.run(
        "INSERT INTO plates (number, last_seen) VALUES (?, DATETIME('NOW'))",
        number,
      );
    }
  }

  isOpen() {
    return !!this.db;
  }
}
