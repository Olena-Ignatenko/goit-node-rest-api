import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { promisify } from "util";


const verify = promisify(jwt.verify);

async function authMiddleware(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (typeof authorizationHeader !== "string") {
return res.status(401).json({ message: "Not authorized" });    }
    const [bearer, token] = authorizationHeader.split(" ", 2);
    
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    try {
      const decode = await verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id);
      if (!user || user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }
      req.user = { id: decode.id, email: decode.email };
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized" });
    }
}

export default authMiddleware;


