import express, { json } from 'express';
import dotenv from 'dotenv'
import Connection from './database/db.js';

import Router from './routes/route.js'

import cors from 'cors';
import bodyParser  from 'body-parser'


dotenv.config();

const app = express();
app.use(bodyParser.json( {extended: true} ));
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors()) // Use this after the variable declaratio
app.use('/', Router);


const URL = process.env.MONGODB_URL
Connection(URL);

const PORT = 8000;

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
