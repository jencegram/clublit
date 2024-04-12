const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const bookClubRoutes = require('./routes/bookClubs');
const stateRoutes = require('./routes/states'); 
const profileRoutes = require('./routes/profile');
const genreRoutes = require('./routes/genreRoutes');
const postsRouter = require('./routes/posts');
const forumsRouter = require('./routes/forums');

app.use((req, res, next) => {
  next();
});


app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', bookRoutes);
app.use('/api', bookClubRoutes);
app.use('/api/states', stateRoutes); 
app.use('/api/profile', profileRoutes);
app.use('/api/genres', genreRoutes)
app.use('/api/posts', postsRouter);
app.use('/api/forums', forumsRouter);
app.use('/api/users', userRoutes);

// Conditional listen
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT);
}

module.exports = app;