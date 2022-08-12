import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'

export default function ShippingScreen() {
  const router = useRouter()
  const {state, dispatch} = useContext(Store)
  const { cart } = state;
  const { shippingAddress } = cart;
  const {register, handleSubmit, setValue, formState: {errors}} =useForm();

  // when component loads fill input boxes with data from the context
  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city)
    setValue("postalCode", shippingAddress.postalCode);
    setValue('country', shippingAddress.country)
  },[setValue, shippingAddress])

  const submitHandler = ({address, fullName, postalCode, city, country}) => {
    // update address in the context
    dispatch({type: 'SAVE_SHIPPING_ADDRESS',
              payload: {address, fullName, postalCode, city, country}
            })
    // save address in the cookies
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );
    router.push('/payment')
  }
  return (
    <Layout title="Shipping address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full"
            id="fullName"
            name="fullName"
            {...register("address", {
              required: "Please enter address",
              minLength: { value: 3, message: "Address is more than 2 char" },
            })}
          />
          {errors.address && (
            <div className="text-red-600">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Adress</label>
          <input
            id="address"
            className="w-full"
            {...register("address", {
              required: "Please enter address",
              minLength: { value: 3, message: "Address is more than 2 chars" },
            })}
          />
          {errors.address && (
            <div className="text-red-600">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            id="city"
            className="w-full"
            {...register("city", {
              required: "Please enter city",
            })}
          />
          {errors.city && (
            <div className="text-red-600">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            id="postalcode"
            className="w-full"
            {...register("postalcode", {
              required: "Please enter your postal code",
            })}
          />
          {errors.postalcode && (
            <div className="text-red-600">{errors.postalcode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            className="w-full"
            {...register("country", {
              required: "Please enter your country",
            })}
          />
          {errors.country && (
            <div className="text-red-600">{errors.message.country}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}


ShippingScreen.auth = true;