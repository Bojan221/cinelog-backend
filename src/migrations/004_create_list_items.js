module.exports = {
  up: async (db) => {
    await db.query(`
      CREATE TABLE list_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        list_id INT NOT NULL,
        media_id INT NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_list_items_list FOREIGN KEY (list_id)
          REFERENCES lists(id) ON DELETE CASCADE,
        CONSTRAINT fk_list_items_media FOREIGN KEY (media_id)
          REFERENCES media(id) ON DELETE CASCADE,
        UNIQUE KEY uq_list_items (list_id, media_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  },
  down: async (db) => {
    await db.query("DROP TABLE IF EXISTS list_items");
  },
};
