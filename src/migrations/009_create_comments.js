module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content VARCHAR(255) NOT NULL,
        tmdb_id INT NOT NULL,
        media_type ENUM('movie', 'tv') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_comment_user FOREIGN KEY (user_id)
          REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  },
  down: async (db) => {
    await db.query("DROP TABLE IF EXISTS comments");
  },
};
