import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { promisify } from "util";


const verify = promisify(jwt.verify);

async function authMiddleware(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (typeof authorizationHeader !== "string") {
        return next(HttpError(401, { message: "Not authorized" }));
    }
    const [bearer, token] = authorizationHeader.split(" ", 2);
    
    if (bearer !== "Bearer" || !token) {
      return next(HttpError(401, { message: "Not authorized" }));
    }

    try {
      const decode = await verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id);
      if (!user || user.token !== token) {
        return next(HttpError(401, { message: "Not authorized" }));
      }
      req.user = { id: decode.id, email: decode.email };
      next();
    } catch (err) {
      next(HttpError(401, { message: "Not authorized" }));
    }
}

export default authMiddleware;


