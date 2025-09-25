import userModel from '../models/userModel.js'
// add products
const addToCart = async (req, res) => {
  try {
    // log entry and incoming data
    console.log('addToCart called', { headers: req.headers, body: req.body, userIdFromMiddleware: req.userId });

    // prefer req.userId set by auth middleware, fallback to body.userId
    const userId = req.userId ?? req.body.userId;
    const { itemId, size } = req.body;
    if (!userId) {
      console.log('addToCart aborted: no userId');
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    if (!itemId || !size) {
      console.log('addToCart aborted: missing itemId or size', { itemId, size });
      return res.status(400).json({ success: false, message: 'Missing itemId or size' });
    }

    const userData = await userModel.findById(userId);
    console.log('addToCart - userData found', { userId: userData?._id });

    let cartData = await userData.cartData;
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {}
      cartData[itemId][size] = 1;
    }

    console.log('addToCart - updated cartData (before save)', { userId, itemId, size, cartDataForItem: cartData[itemId] });

    await userModel.findByIdAndUpdate(userId, { cartData })
    console.log('addToCart - saved cartData to DB', { userId });

    res.json({ success: true, message: 'Added to cart' })
  } catch (error) {
    console.log('addToCart error', error);
    res.json({ success: false, message: error.message })

  }

}

const updateCart = async (req, res) => {
  try {
    console.log('updateCart called', { headers: req.headers, body: req.body, userIdFromMiddleware: req.userId });

    // prefer req.userId set by auth middleware, fallback to body.userId
    const userId = req.userId ?? req.body.userId;
    const { itemId, size, quantity } = req.body;
    if (!userId) {
      console.log('updateCart aborted: missing userId');
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const userData = await userModel.findById(userId);
    console.log('updateCart - userData found', { userId: userData?._id });

    let cartData = await userData.cartData;
    if (!cartData[itemId]) cartData[itemId] = {};
    // if quantity is 0 remove size entry
    if (quantity === 0) {
        if (cartData[itemId] && cartData[itemId][size]) {
            delete cartData[itemId][size];
        }
        if (cartData[itemId] && Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId];
        }
    } else {
        cartData[itemId][size] = quantity;
    }

    console.log('updateCart - updated cartData (before save)', { userId, itemId, size, quantity });

    await userModel.findByIdAndUpdate(userId, { cartData })
    console.log('updateCart - saved cartData to DB', { userId });

    return res.json({
      success: true,
      message: "Cart Updated"
    })

  } catch (error) {
    console.log('updateCart error', error.message)
    return res.json({
      success: false,
      message: error.message
    })

  }
}

const getUserCart = async (req, res) => {
  try {
    console.log('getUserCart called', { headers: req.headers, body: req.body, userIdFromMiddleware: req.userId });

    const userId = req.body.userId ?? req.userId;
    if (!userId) {
      console.log('getUserCart aborted: missing userId');
      return res.status(400).json({ success: false, message: 'Missing userId' });
    }

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    console.log('getUserCart - cartData fetched', { userId, cartKeys: Object.keys(cartData || {}) });

    return res.json({
      success: true,
      message: "Cart Delivered",
      cartData
    })

  } catch (error) {
    console.log('getUserCart error', error.message)
    return res.json({
      success: false,
      message: error.message
    })

  }
}

export { addToCart, updateCart, getUserCart }