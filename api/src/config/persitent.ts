import { getConnection } from "typeorm";
import Config from "../entity/Config";

export default class PersistentConfiguration {
  static async get(key): Promise<any | null> {
    const configRepo = getConnection().getRepository(Config);
    const { value } = await configRepo.findOne({ key });

    return value;
  }

  static async list(priv = true): Promise<any> {
    const configRepo = getConnection().getRepository(Config);
    const items = await configRepo.find({ order: { id: "ASC" } });

    const obj = {};

    for (const [_, config] of Object.entries(items)) {
      if (priv) {
        obj[config.key] = config.value;
      } else {
        if (!config.private) {
          obj[config.key] = config.value;
        }
      }
    }

    return obj;
  }

  static async set(key: string, value: any): Promise<any | null> {
    const connection = getConnection();

    if (await PersistentConfiguration.configExists(key)) {
      return await connection.createQueryBuilder().update(Config).set({ value }).where("key = :key", { key }).execute();
    }

    const configRepo = connection.getRepository(Config);

    const config = configRepo.create({ key, value });

    return await configRepo.save(config);
  }

  static async configExists(key: string): Promise<boolean> {
    const found = await getConnection().getRepository(Config).findOne({ key });
    return !!found;
  }

  static async setIfNotSet(key: string, value: any) {
    if (!(await PersistentConfiguration.configExists(key))) {
      await PersistentConfiguration.set(key, value);
      return value;
    }

    return await PersistentConfiguration.get(key);
  }
}
