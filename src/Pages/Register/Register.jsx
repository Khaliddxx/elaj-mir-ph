// This code defines a new Register component that renders a form with fields for the user's
// email and password. The form data is stored in the formData state using the useState hook.
// The onChange function updates the state when the user types in the fields,
// and the onSubmit function sends a post request to the server with the email and password
// when the form is submitted.

import React, { useState, useContext } from "react";
import axios from "axios";

import "./Register.scss";
import { UserContext } from "../../Context/UserContext";
import { backend } from "../../Context/Backend";

const Register = () => {
  const Auth = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    type: "pharmacy",
    approved: false,
  });
  const [loading, setLoading] = useState(false);
  const { email, password, name } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        email,
        password,
        name,
        type: "pharmacy",
        approved: false,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(newUser);

      const res = await axios.post(
        `${backend}api/account/register`,
        body,
        config
      );
      console.log(res);
      setLoading(true);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <>
      {/* {Auth.user.isAuthenticated && Auth.user.type === "deliveryManager" ? ( */}
      <div className="register-page">
        {!loading ? (
          <div class="box-form">
            <div class="left">
              <div class="overlay">
                <h1>Add a Pharmacy</h1>
                <p>
                  Register a pharmacy here. Once done, the pharmacy can login
                  the{" "}
                  <a style={{ color: "white" }} href="https://store.elajsd.com">
                    pharmacy portal
                  </a>{" "}
                  and access all their benefits. In order for the pharmacy to
                  get validated and appear in the market, contact Elaj's CTO
                </p>
                {/* <span>
                <p>login with social media</p>
                <a href="#">
                  <i class="fa fa-facebook" aria-hidden="true"></i>
                </a>
                <a href="#">
                  <i class="fa fa-twitter" aria-hidden="true"></i> Login with
                  Twitter
                </a>
              </span> */}
              </div>
            </div>

            <div class="right">
              <h5>Register</h5>
              <p style={{ color: "transparent" }}>
                Don't have an account?
                <a style={{ color: "transparent" }} href="#">
                  Creat Your Account
                </a>
                it takes less than a minute
              </p>
              <form onSubmit={(e) => onSubmit(e)}>
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={(e) => onChange(e)}
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => onChange(e)}
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => onChange(e)}
                    minLength="6"
                  />
                </div>
                <input className="submit-btn" type="submit" value="Register" />
              </form>

              {/* <div class="remember-me--forget-password">
              <label>
                <input type="checkbox" name="item" checked />
                <span class="text-checkbox">Remember me</span>
              </label>
              <p>forget password?</p>
            </div> */}

              <br />
            </div>
          </div>
        ) : (
          <h4 style={{ textAlign: "center", width: "80%", margin: "auto" }}>
            Submitted! please inform the CTO to approve a pharmacy after adding
            a 100 products!
          </h4>
        )}
      </div>
      {/* ) : (
        <h1 className="loginpls">
          Delivery or Delivery manager <br /> Please log in 🔐
        </h1>
      )} */}
    </>
  );
};

export default Register;
