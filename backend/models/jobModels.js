import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const JobModel = db.define(
   "job",
   {
      id: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
         primaryKey: true,
      },
      type: {
         type: DataTypes.STRING,
      },
      url: {
         type: DataTypes.STRING,
      },
      created_at: {
         type: DataTypes.STRING,
      },
      company: {
         type: DataTypes.STRING,
      },
      company_url: {
         type: DataTypes.STRING,
      },
      location: {
         type: DataTypes.STRING,
      },
      title: {
         type: DataTypes.STRING,
      },
      description: {
         type: DataTypes.STRING,
      },
      how_to_apply: {
         type: DataTypes.STRING,
      },
      company_logo: {
         type: DataTypes.STRING,
      },
   },
   {
      freezeTableName: true,
      createdAt: false,
      updatedAt: false,
   }
);

export default JobModel;
