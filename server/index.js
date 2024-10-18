import express from 'express';
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
// import bodyParser from 'body-parser';

import routes from './src/routes/index.js';
// import  { connectDB } from './src/libs/prisma.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect Database
// connectDB()

// Middleware
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//Routes
routes(app);

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
