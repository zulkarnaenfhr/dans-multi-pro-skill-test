import React, { useState } from "react";
import styles from "./Login.module.css";
import { instance } from "../axiosInstance";
import { useNavigate } from "react-router-dom";

function Login() {
   const navigate = useNavigate();

   const [form, setForm] = useState({
      email: "zulkarnaenfhr",
      password: "123",
   });

   const handleFormChange = (event: any) => {
      setForm({ ...form, [event.target.name]: event.target.value });
   };

   const handleLoginSubmit = (e: any) => {
      e.preventDefault();

      instance
         .post("/login", { username: form.email, password: form.password })
         .then(function async(response) {
            navigate("/");
            console.log(response);
         })
         .catch(function (error) {
            console.error(error);
         });
   };

   return (
      <div className={styles["PageAuth-Container"]}>
         <div className={styles["PageAuth-Form-Container"]}>
            <p className={styles["PageAuth-Form-Title"]}>Login Kanban Board</p>
            <form className={styles["PageAuth-Form"]} onSubmit={handleLoginSubmit}>
               <label htmlFor="email">Email</label>
               <br />
               <input value={form.email} onChange={handleFormChange} type="text" name="email" id="email" />
               <label htmlFor="password">Password</label>
               <br />
               <input value={form.password} onChange={handleFormChange} type="text" name="password" id="password" />
               <button className={styles["PageAuth-Form-ButtonSubmit"]} type="submit">
                  Log In
               </button>
            </form>
         </div>
      </div>
   );
}

export default Login;
