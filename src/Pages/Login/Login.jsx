import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    id: "",
  });

  const [error, setError] = useState("");

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = { email, password };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(user);

      const res = await axios.post(
        "http://elaj-env.eba-2mybvpfj.eu-west-3.elasticbeanstalk.com/api/account/login",
        body,
        config
      );
      handleLogin(res.data.token, user.email, res.data.id, res.data.t);
      // console.log(UserContext);
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="box-form login-page">
        <div className="left">
          <div className="overlay">
            <h1>Dear Pharmacist</h1>
            <p>
              Welcome! Please make sure to keep your inventory updated! If you
              are experiencing any issues, please contact Filan 0912345678
            </p>
            {/* <span>
              <p>login with social media</p>
              <a href="#">
                <i className="fa fa-facebook" aria-hidden="true"></i>
              </a>
              <a href="#">
                <i className="fa fa-twitter" aria-hidden="true"></i> Login with
                Twitter
              </a>
            </span> */}
          </div>
        </div>

        <div className="right">
          <h5>Login</h5>
          <p>
            Don't have an account? <a href="https://elajsd.com">Contact ELAJ</a>{" "}
            to enroll, it takes less than a minute
          </p>
          {/* <div className="inputs">
          <input type="text" placeholder="user name" />
          <br />
          <input type="password" placeholder="password" />
        </div>
        <br />
        <br />
        <div className="remember-me--forget-password">
          <label>
            <input type="checkbox" name="item" checked />
            <span className="text-checkbox">Remember me</span>
          </label>
          <p>forget password?</p>
        </div> */}
          <form onSubmit={(e) => onSubmit(e)}>
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
            {error && <p>{error}</p>}
            <input className="submit-btn" type="submit" value="Login" />
          </form>

          {/* <br />
        <button>Login</button> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
