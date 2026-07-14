module.exports = {
  up: async (db) => {
    await db.query(`
      ALTER TABLE user_episodes
        ADD COLUMN poster VARCHAR(255) NULL AFTER episode_number
    `);
  },
  down: async (db) => {
    await db.query(`
      ALTER TABLE user_episodes
        DROP COLUMN poster
    `);
  },
};
