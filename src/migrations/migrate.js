const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const MIGRATIONS_DIR = __dirname;

const getMigrationFiles = () =>
  fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => /^\d+_.*\.js$/.test(file))
    .sort();

const ensureMigrationsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) NOT NULL PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
};

const getApplied = async () => {
  const [rows] = await db.query("SELECT name FROM schema_migrations");
  return rows.map((row) => row.name);
};

const runUp = async () => {
  const applied = await getApplied();
  const pending = getMigrationFiles().filter((f) => !applied.includes(f));

  if (pending.length === 0) {
    console.log("Nothing to migrate. Database is up to date.");
    return;
  }

  for (const file of pending) {
    const migration = require(path.join(MIGRATIONS_DIR, file));
    console.log(`Applying ${file}...`);
    await migration.up(db);
    await db.query("INSERT INTO schema_migrations (name) VALUES (?)", [file]);
    console.log(`  ✓ ${file}`);
  }

  console.log(`Done. Applied ${pending.length} migration(s).`);
};

const runDown = async () => {
  const applied = await getApplied();

  if (applied.length === 0) {
    console.log("No migrations to roll back.");
    return;
  }

  const last = applied.sort().at(-1);
  const migration = require(path.join(MIGRATIONS_DIR, last));
  console.log(`Rolling back ${last}...`);
  await migration.down(db);
  await db.query("DELETE FROM schema_migrations WHERE name = ?", [last]);
  console.log(`  ✓ Rolled back ${last}`);
};

const main = async () => {
  const command = process.argv[2] || "up";
  try {
    await ensureMigrationsTable();

    if (command === "up") {
      await runUp();
    } else if (command === "down") {
      await runDown();
    } else {
      console.error(`Unknown command "${command}". Use "up" or "down".`);
      process.exit(1);
    }

    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
};

main();
