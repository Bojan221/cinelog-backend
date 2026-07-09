module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE lists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        media_type ENUM('movie', 'tv', 'mixed') DEFAULT 'movie',
        is_default TINYINT(1) DEFAULT 0,
        is_public TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_lists_user FOREIGN KEY (user_id)
          REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uq_lists_user_name_type (user_id, name, media_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  },
  down: async (db) => {
    await db.query("DROP TABLE IF EXISTS lists");
  },
};
