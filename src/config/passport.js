const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, Profiler, done) => {
      try {
        const email = profile.emails[0].value;
        const providerId = profileId;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;

        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
          email,
        ]);

        let user;

        if (rows.length > 0) {
          user = rows[0];

          await db.query(
            "UPDATE users SET provider = ?, provider_id = ? WHERE id = ? ",
            ["google", providerId, user.id],
          );
        } else {
          const [result] = await db.query(
            "INSERT INTO users (email, first_name, last_name, provider, provider_id, username) VALUES (?,?,?,?,?,?)",
            [
              email,
              firstName,
              lastName,
              "google",
              providerId,
              email.split("@")[0],
            ],
          );
          user = {
            id: result.insertId,
            email,
            first_name: firstName,
            last_name: lastName,
          };
        }
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
