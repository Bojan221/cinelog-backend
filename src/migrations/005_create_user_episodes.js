module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE user_episodes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        tvshow_id INT NOT NULL,
        season_number INT NOT NULL,
        episode_number INT NOT NULL,
        watched_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user_episodes_user FOREIGN KEY (user_id)
          REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uq_user_episode (user_id, tvshow_id, season_number, episode_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  },
  down: async (db) => {
    await db.query("DROP TABLE IF EXISTS user_episodes");
  },
};
