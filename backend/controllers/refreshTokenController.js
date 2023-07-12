import Users from "../models/userModels.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
   try {
      const refreshToken = req.query.refreshToken;
      if (!refreshToken) {
         res.sendStatus(401);
         return;
      }
      const user = await Users.findAll({
         where: {
            refresh_token: refreshToken,
         },
      });

      if (!user[0]) {
         res.clearCookie("refreshToken");
         res.sendStatus(403);
         return;
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
         if (err) {
            res.sendStatus(403);
            return;
         }
         const userId = user[0].id;
         const username = user[0].username;
         const accessToken = jwt.sign({ userId, username }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15s",
         });
         res.status(200).json({ accessToken });
         return;
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
      return;
   }
};
