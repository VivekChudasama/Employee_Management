const app = require('./routes');

const sequelize = require('./util/database');

const PORT = 3000;

sequelize
    .sync()
    .then(result => {
        console.log('Database synced');
        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log(err);
    });

