import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
   const authHeader = req.headers["authorization"];
   //  console.log(authHeader);
   const token = authHeader && authHeader.split(" ")[1];
  //  console.log(req);
   if (token == null) {
      res.sendStatus(401);
   }
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
         res.sendStatus(403);
      }
      console.log("decoded.username");
      console.log(err);
      req.username = decoded.username;
      next();
   });
};
