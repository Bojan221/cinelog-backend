module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tmdbId INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        overview TEXT NULL,
        poster VARCHAR(500) NULL,
        releaseDate DATE NULL,
        vote DECIMAL(3,1) NULL,
        runtime INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        type VARCHAR(255) NULL,
        UNIQUE KEY uq_media_tmdb (tmdbId, type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  },
  down: async (db) => {
    await db.query("DROP TABLE IF EXISTS media");
  },
};
