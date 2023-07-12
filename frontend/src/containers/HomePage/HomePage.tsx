import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { instance } from "../Auth/axiosInstance";
import jwtDecode from "jwt-decode";
import axios from "axios";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import styles from "./HomePage.module.css";
import { Row, Col } from "react-bootstrap";

interface CheckboxChangeEvent {
   target: {
      checked: boolean;
   };
}

function HomePage() {
   let useEffectCall = 0;
   const [page, setPage] = useState(1);
   const [token, setToken] = useState("");
   const [expire, setExpire] = useState("");
   const [jobData, setJobData] = useState("");
   const [loading, setLoading] = useState(true);

   const [queryParams, setQueryParams] = useState({
      description: "",
      location: "",
      full_time: true,
      page: page,
   });

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
      const responseData = await axiosJWT.get(`http://localhost:5000/api/jobs`, { params: queryParams });
      console.log(responseData.data);

      setJobData(responseData.data);
      setLoading(false);
   };

   const handleCheckboxChange = (event: CheckboxChangeEvent) => {
      setQueryParams((prevParams) => ({
         ...prevParams,
         full_time: event.target.checked,
      }));
   };

   const handleFormChange = (event: any) => {
      setQueryParams((prevParams) => ({
         ...prevParams,
         [event.target.name]: event.target.value,
      }));
   };

   return (
      <div>
         <CustomNavbar />
         <div className={styles["Homepage-Container"]}>
            <Row
               className={styles["Homepage-SubNavbar"]}
               style={{
                  marginTop: "20px",
               }}
            >
               <Col md={4}>
                  <p className={styles["HomePage-SubNavbar-Title"]}>Job Description</p>
               </Col>
               <Col md={4}>
                  <p className={styles["HomePage-SubNavbar-Title"]}>Location</p>
               </Col>
            </Row>
            <Row className={styles["Homepage-SubNavbar"]}>
               <Col>
                  <input onChange={handleFormChange} name="description" placeholder="Filter by title, benefits, companies, expertise" className={styles["HomePage-SubNavbar-SearchContent"]} type="text" />
               </Col>
               <Col>
                  <input onChange={handleFormChange} name="location" placeholder="Filter by city, state, zip code or country" className={styles["HomePage-SubNavbar-SearchContent"]} type="text" />
               </Col>
               <Col>
                  <Row
                     style={{
                        height: "40px",
                        marginTop: "10px",
                     }}
                  >
                     <Col
                        style={{
                           display: " flex",
                           alignItems: "center",
                           justifyContent: "center",
                        }}
                     >
                        <input type="checkbox" name="fulltime" id="fulltime" checked={queryParams.full_time} onChange={handleCheckboxChange} />
                        <label className={styles["HomePage-SubNavbar-Label"]} htmlFor="fulltime">
                           Full Time Only
                        </label>
                     </Col>
                     <Col
                        style={{
                           display: " flex",
                           alignItems: "center",
                           justifyContent: "center",
                           height: "100%",
                        }}
                     >
                        <button onClick={getJobs} className={styles["HomePage-SubNavbar-Button"]}>
                           Search
                        </button>
                        <button
                           onClick={() => {
                              console.log(queryParams);
                           }}
                        >
                           cek
                        </button>
                     </Col>
                  </Row>
               </Col>
            </Row>
         </div>
      </div>
   );
}

export default HomePage;
