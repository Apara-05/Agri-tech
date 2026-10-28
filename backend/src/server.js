
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import farmRoutes from './routes/farms.js';
import cropRoutes from './routes/crops.js';
import orderRoutes from './routes/orders.js';
import weatherRoutes from './routes/weather.js';
import communityRoutes from './routes/community.js';
import adminRoutes from './routes/admin.js';
import { notFound, errorHandler } from './middleware/errors.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters');
}
const app=express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({origin:process.env.CLIENT_ORIGIN?.split(',').map(s=>s.trim())||'http://localhost:5173'}));
app.use(express.json({limit:'100kb'}));
app.use(express.urlencoded({extended:false,limit:'100kb'}));
if(process.env.NODE_ENV!=='test') app.use(morgan('combined'));
app.use('/api',rateLimit({windowMs:15*60*1000,limit:300,standardHeaders:'draft-7',legacyHeaders:false}));
app.get('/api/health',(req,res)=>res.json({status:'ok',service:'agritech-api',time:new Date().toISOString()}));
app.use('/api/auth',authRoutes);
app.use('/api/farms',farmRoutes);
app.use('/api/crops',cropRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/weather',weatherRoutes);
app.use('/api/community',communityRoutes);
app.use('/api/admin',adminRoutes);
app.use(notFound);
app.use(errorHandler);

const port=Number(process.env.PORT)||5000;
connectDB().then(()=>app.listen(port,()=>console.log(`AgriTech API listening on ${port}`))).catch(err=>{console.error('Startup failed:',err.message);process.exit(1);});
