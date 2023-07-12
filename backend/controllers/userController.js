import Users from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
   try {
      const users = await Users.findAll();
      res.json(users);
   } catch (error) {
      console.log(error);
   }
};

export const registerUsers = async (req, res) => {
   let { username, password, confirmPassword } = req.body;

   const cekUsername = await Users.findAll({ where: { username: username } });

   if (cekUsername.length != 0) {
      res.status(400).json({ msg: "Username already exist" });
      return;
   }

   if (password !== confirmPassword) {
      res.status(400).json({ msg: "Password and Confirm Password does not match" });
      return;
   }

   const salt = await bcrypt.genSalt();
   const hashPassword = await bcrypt.hash(password, salt);
   try {
      await Users.create({
         username: username,
         password: hashPassword,
      });
      res.status(200).json({
         msg: "Register user success",
      });

      return;
   } catch (error) {
      res.status(500).json({
         msg: "Register Failed",
      });
      return;
   }
};

export const loginUser = async (req, res) => {
   try {
      const user = await Users.findOne({
         where: {
            username: req.body.username,
         },
      });

      if (!user) {
         res.status(404).json({
            msg: "Sorry, Wrong Username ",
         });
         return;
      }

      const match = await bcrypt.compare(req.body.password, user.password);

      if (!match) {
         res.status(403).json({ msg: "Sorry, Wrong  Password" });
         return;
      }

      const userId = user.id;
      const usernameId = user.username;

      const accessToken = jwt.sign({ userId, usernameId }, process.env.ACCESS_TOKEN_SECRET, {
         expiresIn: "15s",
      });

      const refreshToken = jwt.sign({ userId, usernameId }, process.env.REFRESH_TOKEN_SECRET, {
         expiresIn: "1d",
      });

      await Users.update(
         {
            refresh_token: refreshToken,
         },
         {
            where: {
               username: usernameId,
            },
         }
      );

      await res.cookie("refreshToken", refreshToken, {
         httpOnly: true,
         secure: true, // nanti bisa dimainin di frontend
         maxAge: 60 * 60 * 24 * 30 * 1000,
         sameSite: "none",
      });

      res.status(200).json({ msg: accessToken, refreshToken: refreshToken });

      return;
   } catch (error) {
      res.status(500).json({ msg: error });
      return;
   }
};

export const logoutUser = async (req, res) => {
   try {
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken);

      if (!refreshToken) {
         res.clearCookie("refreshToken");
         res.status(400).json({
            msg: "Cookie not found",
         });
         return;
      }

      const user = await Users.findOne({
         where: {
            refresh_token: refreshToken,
         },
      });

      if (!user) {
         res.clearCookie("refreshToken");
         res.status(404).json({
            msg: "Sorry, Wrong Username ",
         });
         return;
      }

      const userId = user.id;

      await Users.update(
         { refresh_token: null },
         {
            where: {
               id: userId,
            },
         }
      );

      res.clearCookie("refreshToken");
      res.status(200).json({ msg: "Berhasil Logout" });
      return;
   } catch (error) {
      res.status(500).json({ msg: error });
      return;
   }
};
