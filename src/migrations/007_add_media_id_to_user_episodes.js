module.exports = {
  up: async (db) => {
    await db.query(`
      ALTER TABLE user_episodes
        ADD COLUMN media_id INT NULL AFTER tvshow_id,
        ADD CONSTRAINT fk_user_episodes_media FOREIGN KEY (media_id)
          REFERENCES media(id) ON DELETE CASCADE
    `);

    // Backfill existing rows: tvshow_id holds the TMDB id.
    await db.query(`
      UPDATE user_episodes ue
        JOIN media m ON m.tmdbId = ue.tvshow_id AND m.type = 'tv'
      SET ue.media_id = m.id
    `);
  },
  down: async (db) => {
    await db.query(`
      ALTER TABLE user_episodes
        DROP FOREIGN KEY fk_user_episodes_media,
        DROP COLUMN media_id
    `);
  },
};
