import React, { useContext, useEffect, useState, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import { products as localProducts } from '../assets/assets'; // fallback

const BestSeller = () => {

    const { products } = useContext(ShopContext);

    // derive best sellers from backend products, fallback to local assets if empty
    // If no explicit best-seller flags are found, fall back to recent/top products.
    const bestSeller = useMemo(() => {
        const src = Array.isArray(products) && products.length ? products : localProducts;

        const flagged = src.filter((item) => {
            const flag = item?.bestSeller ?? item?.bestseller;
            return (
                flag === true ||
                flag === "true" ||
                flag === "True" ||
                flag === 1 ||
                flag === "1"
            );
        });

        if (flagged.length) return flagged.slice(0, 5);

        // fallback: prefer newest by date/createdAt if present, otherwise first items
        const sortedByDate = src
            .slice()
            .sort((a, b) => {
                const ta = new Date(a?.date ?? a?.createdAt ?? 0).getTime();
                const tb = new Date(b?.date ?? b?.createdAt ?? 0).getTime();
                return tb - ta;
            });

        return sortedByDate.slice(0, 5);
    }, [products]);

  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            
            <Title text1={'BEST'}text2={'SELLERS'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus magnam alias obcaecati sequi ratione soluta laboriosam, molestias voluptates amet, error consectetur cupiditate temporibus non? Doloribus non exercitationem alias distinctio accusantium!
            </p>
 
        </div>
 
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                bestSeller.map((item, index) => (
                    <ProductItem
                        key={item._id ?? index}
                        id={item._id}
                        image={Array.isArray(item.image) && item.image.length ? item.image : [item.image || '']}
                        name={item.name}
                        price={item.price}
                    />
                ))
            }
        </div>
 
    </div>
  )
}
 
export default BestSeller