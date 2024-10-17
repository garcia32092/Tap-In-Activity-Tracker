const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const activityRoutes = require('./routes/activity');
const journalRoutes = require('./routes/journal');
const smallWinRoutes = require('./routes/smallWin');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use the routes
app.use('/api/activities', activityRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/small-wins', smallWinRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
