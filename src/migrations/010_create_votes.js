module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE votes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        vote DECIMAL(3,1) NOT NULL,
        tmdb_id INT NOT NULL,
        media_type ENUM('movie', 'tv') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_vote_user
          FOREIGN KEY (user_id)
          REFERENCES users(id) ON DELETE CASCADE,

        UNIQUE KEY unique_vote (user_id, tmdb_id, media_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  },

  down: async (db) => {
    await db.query("DROP TABLE IF EXISTS votes");
  },
};