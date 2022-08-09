import { useContext } from "react";
import Layout from "../components/Layout";
import ProductList from "../components/ProductList";
import Product from "../models/Product";
import axios from "axios";
// import data from '../utils/data'
import db from "../utils/db";
import { Store } from "../utils/Store";
import { toast } from "react-toastify";
export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    // created an API to get Product from backend which send a res.send to the frontend
    const { data } = await axios.get(`/api/products/${product._id}`);
    
    if (data.countInStock < quantity) {
      toast.error("Product out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    toast.success('Product Added To Cart')
  };
  return (
    <div>
      <Layout title="Home Page">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 ">
          {products?.map((product) => (
            <ProductList
              key={product.slug}
              product={product}
              addToCartHandler={addToCartHandler}
            />
          ))}
        </div>
      </Layout>
    </div>
  );
}
// SSR Server side render
// getServerSideProps = this function runs before rendering the
// component and provide data for the component

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
