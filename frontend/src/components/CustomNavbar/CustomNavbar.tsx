import React from "react";
import styles from "./CustomNavbar.module.css";
import { Row, Col } from "react-bootstrap";
import { instance } from "../../containers/Auth/axiosInstance";
import { useNavigate } from "react-router-dom";

function CustomNavbar() {
   const navigate = useNavigate();

   const logout = () => {
      try {
         instance
            .delete("/logout", { withCredentials: true })
            .then(async (response) => {
               navigate("/login");
            })
            .catch(async (error) => {
               navigate("/login");
            });
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <Row id={styles["CustomNavbar"]}>
         <Col>
            <h1 className={styles["CustomNavbar-title"]}>
               <b>Github</b> Jobs
            </h1>
         </Col>
         <Col
            style={{
               display: "flex",
               justifyContent: "right",
            }}
         >
            <button onClick={logout} className={styles["CustomNavbar-button"]}>
               Log Out
            </button>
         </Col>
      </Row>
   );
}

export default CustomNavbar;
