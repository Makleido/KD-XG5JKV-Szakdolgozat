import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import Button from "../components/common/Button";
import CustomForm from "../components/common/form/CustomForm";
import { CustomInput } from "../components/common/form/CustomInput";
import Loading from "../components/common/Loading";
import PageTitle from "../components/common/PageTitle";
import Container from "../components/Container";
import { useDarkMode } from "../hooks/useDarkMode";
import { registrationValidation } from "../validations";

function SignUp() {
  const { darkMode } = useDarkMode();

  const [loading, setLoading] = useState(false);

  const initialValues = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmation: "",
  };

  const submit = async (values: any) => {
    setLoading(true);
    await axios
      .post(`http://localhost:8000/user/register`, values)
      .then((res) => {
        values.username = "";
        values.first_name = "";
        values.last_name = "";
        values.email = "";
        values.password = "";
        values.confirmation = "";
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container relative">
      <Container type={darkMode ? "dark" : "light"}>
        <>
          <PageTitle type={darkMode ? "dark" : "light"} title="Register" />
          <Formik
            initialValues={initialValues}
            validationSchema={registrationValidation}
            onSubmit={(values) => submit(values)}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              values,
              setFieldValue,
              setFieldTouched,
              touched,
            }) => {
              return (
                <CustomForm className="container grid grid-cols-6 grid-rows-5 gap-9">
                  <div className="col-span-2 row-start-1">
                    <CustomInput
                      label="Username"
                      value={values?.username}
                      onChange={handleChange("username")}
                      touched
                      error={errors?.username}
                      minLength={5}
                      maxLength={16}
                    />
                  </div>
                  <div className="col-span-4 row-start-1">
                    <CustomInput
                      label="Email"
                      value={values?.email}
                      onChange={handleChange("email")}
                      touched
                      error={errors?.email}
                    />
                  </div>
                  <div className="col-span-3 row-start-2">
                    <CustomInput
                      label="First name"
                      value={values?.first_name}
                      onChange={handleChange("first_name")}
                      touched
                      error={errors?.first_name}
                    />
                  </div>
                  <div className="col-span-3 row-start-2">
                    <CustomInput
                      label="Last name"
                      value={values?.last_name}
                      onChange={handleChange("last_name")}
                      touched
                      error={errors?.last_name}
                    />
                  </div>
                  <div className="col-span-3 row-start-3">
                    <CustomInput
                      label="Password"
                      value={values?.password}
                      onChange={handleChange("password")}
                      touched
                      error={errors?.password}
                      type={"password"}
                    />
                  </div>
                  <div className="col-span-3 row-start-4">
                    <CustomInput
                      label="Password Confirmation"
                      value={values?.confirmation}
                      onChange={handleChange("confirmation")}
                      touched
                      error={errors?.confirmation}
                      type={"password"}
                    />
                  </div>
                  <div className="col-span-3 row-start-3 row-span-2">
                    {/* ReCaptCHa */}
                  </div>
                  <div className="col-span-3 mx-auto">
                    <Button
                      label="Register"
                      clickHandler={() => handleSubmit()}
                      type={darkMode ? "dark" : "light"}
                      clickType="submit"
                      loading={loading}
                    />
                  </div>
                </CustomForm>
              );
            }}
          </Formik>
        </>
      </Container>
      <Loading loading={loading} />
    </div>
  );
}

export default SignUp;