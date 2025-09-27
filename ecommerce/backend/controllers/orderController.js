import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js';

// COD ORDERS

const placeOrder = async (req, res) => {
  try {
    console.log('placeOrder called', { headers: req.headers, body: req.body, userIdFromMiddleware: req.userId });

    const userId = req.userId ?? req.body.userId;
    const { items, amount, address } = req.body;

    if (!userId) {
      console.log('placeOrder aborted: missing userId');
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      console.log('placeOrder aborted: no items', { items });
      return res.status(400).json({ success: false, message: 'No items to place order' });
    }
    if (!address) {
      console.log('placeOrder aborted: missing address');
      return res.status(400).json({ success: false, message: 'Missing address' });
    }

    const orderData = {
      userId,
      items,
      amount: Number(amount || 0),
      paymentMethod: 'COD',
      payment: false,
      date: Date.now(),
      address,
    };

    console.log('placeOrder -> creating order', { userId, itemsCount: items.length, amount: orderData.amount });
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // clear user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    console.log('placeOrder -> cleared user cart', { userId });

    return res.status(201).json({ success: true, message: 'Order Placed', orderId: newOrder._id });
  } catch (error) {
    console.error('placeOrder error', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}

//stripe


const placeOrderStripe = async(req,res)=>{
    
}


//razrpay
const placeOrderRazorpay = async(req,res)=>{
    
}

// all orders


const allOrders = async(req,res)=>{
    try {
      const orders=await orderModel.find({})
      return res.json(
        {
            success:true,
           orders
        })

  } catch (error) {
    console.log(error)
    return res.json(
        {
            success:false,
            message:error.message
        }
    )
    
  }
}

//user order data for frontened
const userOrders = async (req, res) => {
  try {
    console.log('userOrders called', { headers: req.headers, userIdFromMiddleware: req.userId, userIdFromBody: req.body.userId });
    const userId = req.userId ?? req.body.userId;
    if (!userId) {
      console.log('userOrders aborted: missing userId');
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const orders = await orderModel.find({ userId });
    return res.json({ success: true, orders });
  } catch (error) {
    console.error('userOrders error', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// update order status


const updateStatus = async(req,res)=>{
     try {
        const {orderId, status} = req.body;
        // console.log(orderId,status)
        await orderModel.findByIdAndUpdate(orderId,{status})
        res.json({
            success:true,
            message:"Status Update"
        })
        
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message,
        })
        
    }
}

export {userOrders,placeOrder,placeOrderRazorpay,placeOrderStripe,allOrders,updateStatus}