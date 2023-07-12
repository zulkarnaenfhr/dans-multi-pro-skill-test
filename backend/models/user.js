import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Users = db.define(
   "user",
   {
      username: {
         type: DataTypes.STRING,
         allowNull: false,
         primaryKey: true,
         unique: true,
      },
      password: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      token: {
         type: DataTypes.STRING,
      },
      token_expired_at: {
         type: DataTypes.STRING,
      },
   },
   {
      freezeTableName: true,
      createdAt: false,
      updatedAt: false,
   }
);

export default Users;
