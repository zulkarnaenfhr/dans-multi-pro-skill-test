import React, { useState, useEffect } from "react";
import styles from "./DetailJob.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { instance } from "../Auth/axiosInstance";
import Swal from "sweetalert2";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Col, Row } from "react-bootstrap";

function DetailJob() {
   const navigate = useNavigate();

   const { id } = useParams();
   let useEffectCall = 0;
   const [token, setToken] = useState("");
   const [expire, setExpire] = useState("");
   const [loading, setLoading] = useState(true);
   const [jobData, setJobData] = useState<any>({});

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
               getDetailJobs();
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

   const getDetailJobs = async () => {
      const responseData = await axiosJWT.get(`http://localhost:5000/api/jobs/${id}`);

      console.log(responseData.data);

      setJobData(responseData.data);
      setLoading(false);
   };
   return (
      <div>
         <CustomNavbar />
         <div className={styles["DetailJob-Container"]}>
            <div className={styles["DetailJob-BackButton-Container"]}>
               <button
                  onClick={() => {
                     navigate("/");
                  }}
                  className={styles["DetailJob-BackButton"]}
               >
                  {" "}
                  <ArrowBackIcon /> <span>Back</span>
               </button>
            </div>
            <div className={styles["DetailJob-JobList-Parent-Container"]}>
               <div className={styles["DetailJob-JobList-Container"]}>
                  <div className={styles["DetailJob-JobList-Content-Container"]}>
                     {/* <h1 className={styles["DetailJob-JobList-Title"]}>Job List</h1> */}
                     {loading ? (
                        ""
                     ) : (
                        <div>
                           <p className={styles["JobData-Location"]}>
                              {jobData.type} / {jobData.location}{" "}
                           </p>
                           <p className={styles["JobData-Title"]}>{jobData.title}</p>
                           <div className={styles["JobData-Devider"]}></div>
                           <Row>
                              <Col md={8}>
                                 <div dangerouslySetInnerHTML={{ __html: jobData.description }} />
                              </Col>
                              <Col md={4}>
                                 <div className={styles["jobData-company-card"]}>
                                    <div className={styles["jobData-company-card-inner"]}>
                                       <p className={styles["JobData-Company"]}>{jobData.company}</p>
                                       <div className={styles["JobData-Devider-kecil"]}></div>
                                       <img src={jobData.company_logo} className={styles["JobData-Company-logo"]} alt="" />
                                       {jobData.company_url ? (
                                          <p
                                             onClick={() => {
                                                navigate(jobData.company_url);
                                             }}
                                             className={styles["JobData-Company-Url"]}
                                          >
                                             {jobData.company_url}
                                          </p>
                                       ) : (
                                          <p
                                             onClick={() => {
                                                navigate(jobData.company_url);
                                             }}
                                             className={styles["JobData-Company-Url"]}
                                             style={{
                                                color: "#a8a8a8",
                                             }}
                                          >
                                             {jobData.company_url}
                                          </p>
                                       )}
                                    </div>
                                 </div>
                                 <div className={styles["jobData-how_to_apply-card"]}>
                                    <div className={styles["jobData-how_to_apply-card-inner"]}>
                                       <div
                                          style={{
                                             whiteSpace: "nowrap",
                                             textOverflow: "ellipsis",
                                             overflow: "hidden",
                                          }}
                                          dangerouslySetInnerHTML={{ __html: jobData.how_to_apply }}
                                       />
                                    </div>
                                 </div>
                              </Col>
                           </Row>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default DetailJob;
