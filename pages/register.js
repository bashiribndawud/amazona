import React from "react";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { getError } from "../utils/error";
import { useRouter } from "next/router";

export default function RegisterScreen() {
  const router = useRouter()
  const {redirect} = router.query
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
      router.push('/')
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Register">
      <form
        className="mx-auto max-w-screen-md mt-5"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Create Account</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter your name here",
            })}
          />
          {errors.name && (
            <div className="text-red-600">{errors.name.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="w-full"
            autoFocus
            {...register("email", {
              required: "Please enter you email address",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <div className="text-red-600">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="w-full"
            autoFocus
            {...register("password", {
              required: "Please enter your password",
              minLength: { value: 6, message: "password is more than 5 char" },
            })}
          />
          {errors.password && (
            <div className="text-red-600">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            type="password"
            id="confirmpassword"
            className="w-full"
            {...register("confirmpassword", {
              required: "Please enter confirm password",
              validate: (value) => value === getValues("password"),
              minLength: { value: 6, message: "password is more than 5 char" },
            })}
          />
          {errors.confirmpassword && (
            <div className="text-red-600">{errors.confirmpassword.message}</div>
          )}
          {errors.confirmpassword &&
            errors.confirmpassword.type === "validate" && (
              <div className="text-red-600">Password do not match</div>
            )}
        </div>
        <div className="mb-4">
          <button type="submit" className="primary-button">
            Register
          </button>
        </div>
        <div className="mb-4">
          Already have an account&#x3F;
          <Link href={`/login?redirect=${redirect || "/"}`}> Login</Link>
        </div>
      </form>
    </Layout>
  );
}
