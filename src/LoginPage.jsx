import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { API } from "../global";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const formValidationSchema = yup.object({
  email: yup.string().email().required("Email address is required"),
  password: yup.string().required("password required").min(8),
});

export const LoginPage = () => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const navigate = useNavigate();
  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: formValidationSchema,
      onSubmit: async (values) => {
        const data = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(values),
        });

        if (data.status === 401) {
          setOpen(true);
        } else {
          setOpen(true);
          setSeverity(false);
          const result = await data.json();
          localStorage.setItem("token", result.token);

          navigate("/urlshortener");
        }
      },
    });

  const togglePassword = () => {
    setShow(!show);
  };

  return (
    <div className="main-container">
      <div className="animation-words">
        <h1>
          <span>Shorten Your Link Here!</span>
        </h1>
      </div>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <form onSubmit={handleSubmit}>
          <Card className="login-container">
            <h4>Welcome !!</h4>
            <CardContent className="card-content">
              <TextField
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Email"
                variant="outlined"
                error={touched.email && errors.email}
                helperText={touched.email && errors.email ? errors.email : null}
              />
              <TextField
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                label="password"
                type={show ? "text" : "password"}
                variant="outlined"
                error={touched.password && errors.password}
                helperText={
                  touched.password && errors.password ? errors.password : null
                }
              />
              <span className="showpassword">
                <Checkbox onClick={togglePassword} aria-label="Checkbox demo" />
                <span>Show password</span>
              </span>

              <Button type="submit" variant="contained">
                Login
              </Button>
              <small
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login/forgetpassword")}
              >
                forget password?
                <hr style={{ opacity: 0.5, width: "70%" }} />
              </small>

              <Button
                style={{ width: "50%", margin: "0px auto" }}
                onClick={() => navigate("/signup")}
                variant="contained"
                color="success"
              >
                Create Account
              </Button>
            </CardContent>
          </Card>
        </form>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {severity ? "Invalid credentials" : "login successfully"}
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
};
