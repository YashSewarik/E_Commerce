import jwt from 'jsonwebtoken';

// Accept either Authorization: Bearer <token> or token: <token>
const authUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization || req.headers.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorised: no token' });
    }

    // strip "Bearer " prefix if present
    if (typeof token === 'string' && token.toLowerCase().startsWith('bearer ')) {
      token = token.slice(7).trim();
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    // support both payload shapes: { userId } or { id }
    req.userId = tokenDecode.userId ?? tokenDecode.id ?? null;
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }
    next();
  } catch (error) {
    console.error('auth error:', error);
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

export default authUser;