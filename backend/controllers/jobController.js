import JobModel from "../models/jobModels.js";
import { Op } from "sequelize";

export const getAllJobs = async (req, res) => {
   try {
      const { description, location, full_time, page } = req.query;

      let pageBaru = page;
      if (page === undefined || page === "") {
         pageBaru = 1;
      } else {
         pageBaru = page;
      }

      const resultsPerPage = 5;

      const searchCriteria = {};

      if (description) {
         searchCriteria.description = {
            [Op.like]: `%${description}%`,
         };
      }

      if (location) {
         searchCriteria.location = {
            [Op.like]: `%${location}%`,
         };
      }

      if (full_time) {
         if (full_time === "true") {
            searchCriteria.type = {
               [Op.like]: "Full Time",
            };
         } else {
            searchCriteria.type = {
               [Op.ne]: "Full Time",
            };
         }
      }

      const offset = (pageBaru - 1) * resultsPerPage;

      const joblist = await JobModel.findAll({
         where: searchCriteria,
      });

      const jumlahPage = Math.ceil(joblist.length / resultsPerPage);

      let hasilJumlahPerPage = 0;

      if (page != jumlahPage) {
         hasilJumlahPerPage = resultsPerPage * page;
      } else {
         hasilJumlahPerPage = joblist.length;
      }

      res.status(200).json({
         jumlahPage: jumlahPage,
         jumlahData: joblist.length,
         data: joblist.slice(0, hasilJumlahPerPage),
      });
   } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      return;
   }
};

export const detailJob = async (req, res) => {
   try {
      const job = await JobModel.findOne({
         where: {
            id: req.params.id,
         },
      });

      if (!job) {
         res.status(404).json({ msg: "Job ID Not Found" });
         return;
      }

      res.status(200).json(job);
      return;
   } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      return;
   }
};

export const addJob = async (req, res) => {
   let { id, type, url, created_at, company, company_url, location, title, description, how_to_apply, company_logo } = req.body;

   const cekId = await JobModel.findOne({ where: { id: id } });

   console.log(cekId);

   if (cekId) {
      res.status(400).json({ msg: "Id Job Already exist" });
      return;
   }

   try {
      await JobModel.create({
         id: id,
         type: type,
         url: url,
         created_at: created_at,
         company: company,
         company_url: company_url,
         location: location,
         title: title,
         description: description,
         how_to_apply: how_to_apply,
         company_logo: company_logo,
      });

      res.status(200).json({
         msg: "Add New Job success",
      });

      return;
   } catch (error) {
      res.status(500).json({
         msg: "Register Failed",
      });
      return;
   }
};
