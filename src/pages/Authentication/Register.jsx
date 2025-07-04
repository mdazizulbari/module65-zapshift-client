import React from "react";
import { useForm } from "react-hook-form";

const Register = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
          <button className="btn w-fit btn-neutral mt-4">Register</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Register;
