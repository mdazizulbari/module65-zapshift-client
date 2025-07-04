import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";

const Register = () => {
  const { createUser } = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            {...register("email")}
            placeholder="Email"
          />

          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="input"
            placeholder="Password"
          />
          {errors.password?.type === "minLength" && (
            <p className="text-red-500">
              Password must be 6 characters or longer
            </p>
          )}
          {errors.password?.type === "required" && (
            <p className="text-red-500">Password is required</p>
          )}

          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button className="btn btn-primary text-black w-fit btn-neutral mt-4">
            Register
          </button>
        </fieldset>
        <p>
          <small>
            Already have an account?{" "}
            <Link to={"/login"} className="text-primary">
              Login
            </Link>
          </small>
        </p>
      </form>
    </div>
  );
};

export default Register;
