import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    // accept Authorization: Bearer <token> or token: <token>
    let token = req.headers.authorization || req.headers.token;
    if (!token) {
      console.log('adminAuth: no token header provided');
      return res.status(401).json({ success: false, message: 'Not Authorised' });
    }

    if (typeof token === 'string' && token.toLowerCase().startsWith('bearer ')) {
      token = token.slice(7).trim();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log('adminAuth: token verify failed', err.message);
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Accept either object payload with admin flag/email/role or legacy string payload
    let isAdmin = false;
    if (typeof decoded === 'string') {
      isAdmin = decoded === (process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD);
    } else if (typeof decoded === 'object' && decoded !== null) {
      if (decoded.email && decoded.email === process.env.ADMIN_EMAIL) isAdmin = true;
      if (decoded.role && decoded.role === 'admin') isAdmin = true;
      if (decoded.admin === true) isAdmin = true;
      // legacy support: email+password concatenation inside object
      if (decoded.email && decoded.password && (decoded.email + decoded.password) === (process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)) {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      console.log('adminAuth: not admin, decoded=', decoded);
      return res.status(403).json({ success: false, message: 'Not Authorised' });
    }

    req.admin = { email: decoded?.email ?? process.env.ADMIN_EMAIL };
    next();
  } catch (error) {
    console.error('adminAuth unexpected error', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

export default adminAuth;