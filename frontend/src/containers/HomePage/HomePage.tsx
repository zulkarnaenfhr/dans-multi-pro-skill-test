import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { instance } from "../Auth/axiosInstance";
import jwtDecode from "jwt-decode";
import axios from "axios";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";

function HomePage() {
   let useEffectCall = 0;
   const [token, setToken] = useState("");
   const [expire, setExpire] = useState("");
   const [jobData, setJobData] = useState("");
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (useEffectCall > 0) return;

      refreshToken();

      useEffectCall++;
   }, []);

   const refreshToken = async () => {
      try {
         instance
            .get("/refreshToken", { withCredentials: true })
            .then(async (response) => {
               await setToken(response.data.accessToken);
               const decode: any = jwtDecode(response.data.accessToken);
               setExpire(decode.exp);
               getJobs();
            })
            .catch(async (error) => {
               console.log(error);
            });
      } catch (error) {
         Swal.fire({
            title: `Session Login Telah Habis, Silahkan Login Kembali!`,
            timer: 3000,
            timerProgressBar: true,
            icon: "error",
            iconColor: "#002145",
         }).then((result) => {
            /* Read more about handling dismissals below */
            // Logout();
         });
      }
   };

   const axiosJWT = axios.create();

   axiosJWT.interceptors.request.use(
      async (config) => {
         const currentDate = new Date();
         const expireNumber = Number(expire);

         if (expireNumber < currentDate.getTime()) {
            const response = await instance.get(`/refreshToken`, { withCredentials: true });

            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decode: any = jwtDecode(response.data.accessToken);
            setExpire(decode.exp);
         }
         return config;
      },
      (error) => {
         return Promise.reject(error);
      }
   );

   const getJobs = async () => {
      const responseData = await axiosJWT.get(`http://localhost:5000/api/jobs`);
      setJobData(responseData.data);
      setLoading(false);
   };

   return (
      <div>
         <CustomNavbar />
         <h1>homepage</h1>
      </div>
   );
}

export default HomePage;
