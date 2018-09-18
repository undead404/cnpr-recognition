import sqlite from 'sqlite';
import readline from 'readline';
import config from './config';
import { normalizePlateNumber } from './functions';

class Database {
  constructor() {
    if (process.platform === 'win32') {
      readline
        .createInterface({
          input: process.stdin,
          output: process.stdout,
        })
        .on('SIGINT', () => {
          process.emit('SIGINT');
        });
    }

    process.on('SIGINT', async () => {
      if (this.isOpen()) {
        console.info('Closing database connection...');
        await this.close();
      }
      process.exit();
    });
  }

  async close() {
    await this.db.close();
  }

  async init() {
    if (Database.db) {
      this.db = Database.db;
    } else {
      console.info(config.dbFileName);
      this.db = await sqlite.open(config.dbFileName);
      Database.db = this.db;
      console.info(this.db ? 'DB is ready.' : 'DB NOT READY');
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

  async getPlateById(id) {
    if (!this.isOpen()) {
      await this.init();
    }
    return this.db.get('SELECT * FROM plates WHERE id = ?', id);
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

  isOpen() {
    return !!this.db;
  }

  async registerEncounter(plateData) {
    if (!this.isOpen()) {
      await this.init();
    }
    const plate = await this.getPlateByNumber(plateData.plate);
    if (plate) {
      await this.db.run(
        "UPDATE plates SET last_seen = DATETIME('NOW') WHERE number = ?",
        plate.number,
      );
    } else {
      await this.db.run(
        "INSERT INTO plates (number, last_seen) VALUES (?, DATETIME('NOW'))",
        plateData.plate,
      );
    }
    await this.db.run(
      "INSERT INTO logs (plateNumber, datetime, confidence, region, allowed) VALUES (?, DATETIME('NOW'), ?, ?, ?)",
      plateData.plate,
      plateData.confidence,
      plateData.region,
      plate ? plate.allowed : 0,
    );
  }
}

export default new Database();
