import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { currency, products ,addToCart} = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size,setSize] = useState('');

  const fetchProductData = async () => {
    products.forEach((item) => {
      if (item._id === productId) {
        setProductData(item);
        // console.log(item);
        setImage(item.image[0]);
      }
    });
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex flex-col sm:flex-row gap-12">
        
        {/* Product Images Section */}
        <div className="flex flex-1 sm:flex-row gap-4">
          
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2 sm:w-[80px] w-full">
            {productData.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                src={item}
                className={`w-[80px] h-[80px] object-cover rounded cursor-pointer border ${
                  image === item ? 'border-black' : 'border-gray-300'
                }`}
                alt=""
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src={image}
              className="w-full max-w-[500px] h-auto object-contain"
              alt=""
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-4" />
            <img src={assets.star_icon} alt="" className="w-4" />
            <img src={assets.star_icon} alt="" className="w-4" />
            <img src={assets.star_icon} alt="" className="w-4" />
            <img src={assets.star_dull_icon} alt="" className="w-4" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item,index)=>(
                <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 cursor-pointer ${item===size?'border-orange-500':''}`} key={index}>{item}</button>
              ))}
            </div>
          </div>
          <button onClick={()=>addToCart(productData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700' >ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5'/>
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Product</p>
            <p>Cash on Delivery is available for this product</p>
            <p>Easy return and exchange policy within 7 days/</p>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className='mt-20'>
              <div className='flex'>
                <b className='border px-5 py-3 text-sm'>Description</b>
                <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
              </div>
              <div className='flex flex-col ggap-4 border px-6 py-6 text-sm text-gray-500'>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, veniam? Ipsa recusandae nulla mollitia quia sapiente. Quia exercitationem, nobis nesciunt eius rerum nihil fugiat tempora provident nisi rem debitis necessitatibus.</p>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque adipisci, similique est totam doloribus, ducimus quae beatae blanditiis corporis labore aperiam ullam placeat non facilis sunt numquam officiis, quod quisquam!</p>
                
              </div>
      </div>
      {/*related*/}
      <div><RelatedProducts category={productData.category} subCategory={productData.subCategory} /></div>
    </div>
  ) : <div className="opacity-0"></div>
}

export default Product
