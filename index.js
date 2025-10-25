// import express and we will be sending back json so we will import json as well from express
import express, {json} from 'express';

import cors from 'cors';
//import dotenv inorder to setup some environment variable(dotenv will help us do it on our dev server manually on our deployent server)
import dotenv from 'dotenv';
//we will use cookies 
import cookieParser from 'cookie-parser';
//inorder to use ES modules in node we need to import dirname and join 
import {dirname, join} from 'path';

import { fileURLToPath } from 'url';
import usersRouter from './routes/users-route.js';

dotenv.config();//looks for a dotenv file and pull in any env variable from that file

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {credentials:true, origin:process.env.URL || '*'}

app.use(cors(corsOptions));

app.use(json())
app.use(cookieParser());
//serve app

app.use('/', express.static(join(__dirname,'public')));
app.use('/v1/api/users', usersRouter);

app.listen(PORT,()=>console.log(`server is listening on ${PORT}`));

