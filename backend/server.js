import express from 'express';
import cors from 'cors';
import connectdb from './config/mongodb.js';
import 'dotenv/config';
import adminRouter from './routes/adminRoute.js';
import connectCloudinary from './config/cloudinary.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

const app = express();
const port = process.env.PORT || 3000;

// Ensure Database Connection
connectdb();
connectCloudinary();

app.use(express.json({ limit: '10mb' }));
// app.use(cors({ origin: '*' }));

const corsOption = {
    origin: ['http://localhost:52','http://localhost:51'],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
}
app.use(cors(corsOption));


// API Endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor',doctorRouter);
app.use('/api/user',userRouter)

app.get('/', (req, res) => {
    res.send("API Working");
});

// Start the Server
app.listen(port, () => console.log(`✅ Server started on port ${port}`));
