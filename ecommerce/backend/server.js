import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

// add these imports
import orderRoute from './routes/orderRoute.js'
import cartRoute from './routes/cartRoute.js'
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'

//app config

const app = express()
const port = process.env.PORT||4000;
connectDB();
connectCloudinary();

// middlewares 
app.use(express.json())
app.use(cors())

//api end points

// existing mounted routes (example)
// app.use('/api/user', userRoute)
// app.use('/api/product', productRoute)

// mount cart & order routes so /api/order/place and /api/cart/* work
// mount user and product routes as well (fixes 404 for /api/user and /api/product)
app.use('/api/user', userRoute)
app.use('/api/product', productRoute)
app.use('/api/cart', cartRoute)
app.use('/api/order', orderRoute)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=>{ console.log(`Server started on PORT: ${port}`) })