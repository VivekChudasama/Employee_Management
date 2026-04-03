import app from './routes.js';

import { AppDataSource }  from './util/database.js';

const PORT = 3001;

AppDataSource.initialize()
    .then(() => {
        console.log('Database initialized');
    })
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