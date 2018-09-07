import sqlite from 'sqlite';
import config from './config';
import { normalizePlateNumber } from './functions';

export default class Database {
  async init() {
    this.db = await sqlite.open(config.dbFileName);
    console.info('DB is ready.');
  }

  async getPlateByNumber(number) {
    return this.db.get(
      'SELECT * FROM plates WHERE number = ?',
      normalizePlateNumber(number),
    );
  }

  isOpen() {
    return !!this.db;
  }
}
