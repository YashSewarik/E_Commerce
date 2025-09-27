import mongoose from "mongoose"
const orderSchema= mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    items:{
        type:Array,
        required:true

    },
    amount:{
        type:Number,
        required:true,
        default:0
    },
    address:{
        type:Object,
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true,
    },
    payment:{
        type:Boolean,
        required:true,
        default:false,
    },
    status:{
        type:String,
        default:"Order Placed",
        required:true
    },
    date:{
        type:Number,
        required:true
    }
    


})
const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel