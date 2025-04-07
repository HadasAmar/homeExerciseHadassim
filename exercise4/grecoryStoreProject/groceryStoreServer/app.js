import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import supplierRoute from './routes/supplierRoute.js'
import productRoute from './routes/productRoute.js'
import orderRoute from './routes/orderRoute.js'
import ownerRoute from './routes/ownerRoute.js'
import stockRoute from './routes/stockRoute.js'


dotenv.config(); 

const app = express()

app.use(cors())

app.use(express.json());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} :)`)
})

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("The connection was successful")
})
.catch((err) => {
    console.log(err.message)
})

app.use('/suppliers', supplierRoute);
app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/owner', ownerRoute);
app.use('/stocks', stockRoute);
