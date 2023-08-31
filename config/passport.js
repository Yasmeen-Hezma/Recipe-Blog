const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../server/models/User'); // Adjust the path

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username });

                if (!user) {
                    return done(null, false, { message: 'Incorrect username' });
                }

                const passwordMatch = await bcrypt.compare(password, user.password);

                if (passwordMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
