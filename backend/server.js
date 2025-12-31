const cors = require("cors");

const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');
const patientRoutes = require('./routes/patients');
const reportRoutes = require('./routes/reports');



const app = express();
app.use(cors());

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/reports', reportRoutes);




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
