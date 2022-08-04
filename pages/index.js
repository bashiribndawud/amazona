import Image from 'next/image'
import Layout from '../components/Layout'
import ProductList from '../components/ProductList'
import data from '../utils/data'
export default function Home() {
  return (
    <div>
      <Layout title="Home Page">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 ">
          {data.products?.map((product) => (
            <ProductList key={product.slug} product={product} />
          ))}
        </div>
      </Layout>
    </div>
  );
}
