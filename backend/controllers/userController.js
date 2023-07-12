import Users from "../models/userModels.js";
import bcrypt from "bcrypt";

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
   console.log(username);
   console.log(password);

   const cekUsername = await Users.findAll({ where: { username: username } });
   console.log(cekUsername);

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
