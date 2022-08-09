import { useRouter } from "next/router";
import React, { useContext } from "react";
import Layout from "../../components/Layout";
// import data from "../../utils/data";
import Link from "next/link";
import Image from "next/image";
import { Store } from "../../utils/Store";
import db from "../../utils/db";
import Product from "../../models/Product";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProductScreen({ product }) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  // Client Side Code
  // const { query } = useRouter();
  // const { slug } = query;
  // const product = data.products.find((x) => x.slug === slug);
  
  if (!product) {
    return (
      <Layout title="Product Not Found">
        <div className="bg-red-500 text-center p-5 rounded-full text-white text-xl">Product Not Found</div>
      </Layout>
    );
  }
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    // created an API to get Product from backend which send a res.send to the frontend
    const { data } = await axios.get(`/api/products/${product._id}`)
    console.log(data)
    if (data.countInStock < quantity) {
      toast.error("Product out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    toast.success("Product Added To Cart");
    setTimeout(() => {
      router.push("/cart");
    },3000)
  };
  return (
    <Layout title={product.slug}>
      <div className="py-2">
        <Link href="/">back to product</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In Stock" : "Unavailable"}</div>
            </div>
            <button
              className="w-full primary-button"
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect()
  const product = await Product.findOne({slug}).lean();
  
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}