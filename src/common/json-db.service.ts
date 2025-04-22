import { Injectable, Inject } from '@nestjs/common';
import { JsonDB, Config } from 'node-json-db';

@Injectable()
export class JsonDbService {
  private db: JsonDB;

  constructor(@Inject('DB_PATH') private dbPath: string) {
    this.db = new JsonDB(new Config(this.dbPath, true, true, '/data'));
  }

  async push(path: string, data: any, override = true) {
    await this.db.push(path, data, override);
  }

  async getData(path: string) {
    return await this.db.getData(path);
  }

  async delete(path: string) {
    await this.db.delete(path);
  }
}
