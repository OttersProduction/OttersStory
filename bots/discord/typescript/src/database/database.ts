import sqlite3 from "sqlite3";
import { promisify } from "util";

export interface User {
  id: string;
  ign: string;
  timezone: string;
}

export class Database {
  private db: sqlite3.Database | null = null;

  public async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database("./database.db", (err) => {
        if (err) {
          console.error("Error opening database:", err);
          reject(err);
        } else {
          console.log("Connected to SQLite database");
          this.createTable()
            .then(() => resolve())
            .catch(reject);
        }
      });
    });
  }

  private async createTable(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const run = promisify(this.db.run.bind(this.db));

    try {
      await run(`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    ign TEXT,
                    timezone TEXT
                )
            `);

      await run(`
                CREATE TABLE IF NOT EXISTS tts_config (
                    guild_id TEXT PRIMARY KEY,
                    channel_id TEXT NOT NULL
                )
            `);

      console.log("Database table created/verified");
    } catch (error) {
      console.error("Error creating table:", error);
      throw error;
    }
  }

  public async upsertUser(
    id: string,
    ign: string,
    timezone: string
  ): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db!.run(
        "INSERT OR REPLACE INTO users (id, ign, timezone) VALUES (?, ?, ?)",
        [id, ign, timezone],
        function (err) {
          if (err) {
            console.error("Error upserting user:", err);
            reject(err);
          } else {
            console.log(
              `User ${id} upserted with IGN: ${ign}, Timezone: ${timezone}`
            );
            resolve();
          }
        }
      );
    });
  }

  public async getTimezone(id: string): Promise<string | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db!.get(
        "SELECT timezone FROM users WHERE id = ?",
        [id],
        function (err, row: { timezone: string } | undefined) {
          if (err) {
            console.error("Error getting timezone:", err);
            reject(err);
          } else {
            resolve(row ? row.timezone : null);
          }
        }
      );
    });
  }

  public async getUser(id: string): Promise<User | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db!.get(
        "SELECT * FROM users WHERE id = ?",
        [id],
        function (err, row: User | undefined) {
          if (err) {
            console.error("Error getting user:", err);
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  public async deleteUser(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db!.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) {
          console.error("Error deleting user:", err);
          reject(err);
        } else {
          console.log(`User ${id} deleted`);
          resolve();
        }
      });
    });
  }

  public async setTTSChannel(
    guildId: string,
    channelId: string
  ): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db!.run(
        "INSERT OR REPLACE INTO tts_config (guild_id, channel_id) VALUES (?, ?)",
        [guildId, channelId],
        function (err) {
          if (err) {
            console.error("Error setting TTS channel:", err);
            reject(err);
          } else {
            console.log(`TTS channel set for guild ${guildId}: ${channelId}`);
            resolve();
          }
        }
      );
    });
  }

  public async getTTSChannel(guildId: string): Promise<string | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db!.get(
        "SELECT channel_id FROM tts_config WHERE guild_id = ?",
        [guildId],
        function (err, row: { channel_id: string } | undefined) {
          if (err) {
            console.error("Error getting TTS channel:", err);
            reject(err);
          } else {
            resolve(row ? row.channel_id : null);
          }
        }
      );
    });
  }

  public async close(): Promise<void> {
    if (this.db) {
      const close = promisify(this.db.close.bind(this.db));
      await close();
      console.log("Database connection closed");
    }
  }
}
