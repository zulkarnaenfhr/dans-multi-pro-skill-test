import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { instance } from "../Auth/axiosInstance";
import jwtDecode from "jwt-decode";
import axios from "axios";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import styles from "./HomePage.module.css";
import { Row, Col } from "react-bootstrap";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

interface CheckboxChangeEvent {
   target: {
      checked: boolean;
   };
}

function HomePage() {
   const navigate = useNavigate();

   let useEffectCall = 0;
   const [token, setToken] = useState("");
   const [expire, setExpire] = useState("");
   const [jobData, setJobData] = useState<any>({});
   const [loading, setLoading] = useState(true);

   const [queryParams, setQueryParams] = useState({
      description: "",
      location: "",
      full_time: true,
      page: 1,
   });

   const logout = () => {
      try {
         instance
            .delete("/logout", { withCredentials: true })
            .then(async (response) => {
               navigate("/login");
               return;
            })
            .catch(async (error) => {
               navigate("/login");
               return;
            });
      } catch (error) {
         navigate("/login");
         return;
      }
   };

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
               navigate("/login");
               return;
            });
      } catch (error) {
         Swal.fire({
            title: `Session Login Telah Habis, Silahkan Login Kembali!`,
            timer: 3000,
            timerProgressBar: true,
            icon: "error",
            iconColor: "#002145",
         }).then((result) => {
            navigate("/login");
            return;
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
         // return Promise.reject(error);
         navigate("/login");
         return;
      }
   );

   const getJobs = async () => {
      try {
         const responseData = await axiosJWT.get(`http://localhost:5000/api/jobs`, { params: queryParams });

         setJobData(responseData.data);
         setLoading(false);
      } catch (error) {
         navigate("/login");
         return;
      }
   };

   const handleCheckboxChange = (event: CheckboxChangeEvent) => {
      setQueryParams((prevParams) => ({
         ...prevParams,
         full_time: event.target.checked,
      }));
   };

   const handlePageChange = async () => {
      await setQueryParams((prevParams) => ({
         ...prevParams,
         page: queryParams.page + 1,
      }));
   };

   useEffect(() => {
      getJobs();
   }, [queryParams]);

   const handleFormChange = (event: any) => {
      setQueryParams((prevParams) => ({
         ...prevParams,
         [event.target.name]: event.target.value,
      }));
   };

   const dateFormatter = (apiDate: string) => {
      const date = new Date(apiDate);

      const formattedDate = formatDistanceToNow(date, { addSuffix: true });

      return formattedDate.slice(5, formattedDate.length);
   };

   return (
      <div>
         <CustomNavbar />
         <div className={styles["Homepage-Container"]}>
            <Row
               className={styles["Homepage-SubNavbar"]}
               style={{
                  paddingTop: "20px",
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
                     </Col>
                  </Row>
               </Col>
            </Row>

            <div className={styles["Homepage-JobList-Parent-Container"]}>
               <div className={styles["Homepage-JobList-Container"]}>
                  <div className={styles["Homepage-JobList-Content-Container"]}>
                     <h1 className={styles["Homepage-JobList-Title"]}>Job List</h1>
                     {loading ? (
                        <p>Loading...</p>
                     ) : (
                        <div>
                           {jobData.data.map((data: any) => (
                              <Row className={styles["jobsData-line"]}>
                                 <Col
                                    md={10}
                                    style={{
                                       display: "flex",
                                       alignItems: "center",
                                    }}
                                 >
                                    <div>
                                       <p
                                          onClick={() => {
                                             navigate(`/${data.id}`);
                                          }}
                                          className={styles["jobsData-line-title"]}
                                       >
                                          {data.title}
                                       </p>
                                       <p
                                          style={{
                                             marginBottom: "unset",
                                          }}
                                       >
                                          <span className={styles["jobsData-line-company"]}>{data.company} -</span> <span className={styles["jobsData-line-type"]}>{data.type}</span>
                                       </p>
                                    </div>
                                 </Col>
                                 <Col
                                    md={2}
                                    style={{
                                       display: "flex",
                                       alignItems: "center",
                                       justifyContent: "right",
                                    }}
                                 >
                                    <div>
                                       <p className={styles["jobData-line-location"]}>{data.location}</p>
                                       <p className={styles["jobData-line-date"]}>{dateFormatter(data.created_at)}</p>
                                    </div>
                                 </Col>
                              </Row>
                           ))}
                        </div>
                     )}
                     {queryParams.page != jobData?.jumlahPage ? (
                        <button
                           onClick={() => {
                              handlePageChange();
                           }}
                           className={styles["jobData-line-addMore"]}
                        >
                           More Jobs
                        </button>
                     ) : (
                        ""
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default HomePage;
