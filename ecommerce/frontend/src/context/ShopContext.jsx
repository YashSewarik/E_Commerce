import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props)=>{

        const currency = '$';
        const delivery_fee = 10;
        // const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const backendUrlRaw = import.meta.env.VITE_BACKEND_URL;
        const backendUrl = backendUrlRaw ? backendUrlRaw.replace(/(^'|'$)/g, '') : 'http://localhost:4000';
        const [search,setSearch] = useState('');
        const [showSearch,setShowSearch] = useState(false);
        const [cartItems,setCartItems] = useState({});
        const [products,setProducts] = useState([]);
        const [token,setToken] = useState('');
        const navigate = useNavigate();

        const addToCart = async (itemId,size) => {
            if(!size){
                toast.error('Select Product Size');
                return;
            }
            let cartData = structuredClone(cartItems);
            if (cartData[itemId]) {
                if (cartData[itemId][size]) {
                    cartData[itemId][size]+=1;
                }
                else{
                    cartData[itemId][size] = 1;
                }
            }
            else{
                cartData[itemId] = {};
                cartData[itemId][size] = 1;
            }
            setCartItems(cartData);

            // log attempt
            console.log('ShopContext.addToCart -> local update', { itemId, size, cartData });

            if (token) {
                try {
                    console.log('ShopContext.addToCart -> sending request to backend', { url: `${backendUrl}/api/cart/add`, payload: { itemId, size } });
                    const res = await axios.post(
                        `${backendUrl}/api/cart/add`,
                        { itemId, size },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log('ShopContext.addToCart -> backend response', res?.data);
                    // refresh server cart into local state if server returned cartData (optional)
                    // await getUserCart();
                } catch (error) {
                    console.error('addToCart error', error?.response ?? error);
                    toast.error(error?.response?.data?.message || error.message);
                }
            }
        }

        const getCartCount = () => {
            let totalCount = 0;
            for(const items in cartItems){
                for(const item in cartItems[items]){
                    try {
                        if (cartItems[items][item]>0) {
                            totalCount+=cartItems[items][item];
                        }
                    } catch (error) {
                        
                    }
                }
            }
            return totalCount;
        }

        const updateQuantity = async (itemId,size,quantity) =>{
            let cartData = structuredClone(cartItems);
            if (!cartData[itemId]) cartData[itemId] = {};
            cartData[itemId][size] = quantity;
            // remove item-size when quantity is 0 to keep shape consistent
            if (quantity === 0) {
              delete cartData[itemId][size];
              if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
            }
            setCartItems(cartData);

            console.log('ShopContext.updateQuantity -> local update', { itemId, size, quantity, cartData });

            // persist update to backend if logged in
            if (token) {
                try {
                    console.log('ShopContext.updateQuantity -> sending update to backend', { url: `${backendUrl}/api/cart/update`, payload: { itemId, size, quantity } });
                    const res = await axios.post(
                        `${backendUrl}/api/cart/update`,
                        { itemId, size, quantity },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log('ShopContext.updateQuantity -> backend response', res?.data);
                    // sync server cart if desired
                    // await getUserCart();
                } catch (error) {
                    console.error('updateQuantity error', error?.response ?? error);
                    toast.error(error?.response?.data?.message || error.message);
                }
            }
        }

        // fetch cart from backend and sync locally
        const getUserCart = async () => {
            if (!token) return;
            try {
                console.log('ShopContext.getUserCart -> requesting /api/cart/get', { url: `${backendUrl}/api/cart/get` });
                const res = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { Authorization: `Bearer ${token}` } });
                console.log('ShopContext.getUserCart -> response', res?.data);
                if (res?.data?.success) {
                    setCartItems(res.data.cartData || {});
                }
            } catch (error) {
                console.error('getUserCart error', error?.response ?? error);
            }
        }

        const getCartAmount =  () => {
            let totalAmount = 0;
            for(const items in cartItems){
                let itemInfo = products.find((product)=>product._id=== items);
                for(const item in cartItems[items]){
                    try {
                        if(cartItems[items][item]>0){
                            totalAmount+= itemInfo.price * cartItems[items][item];
                        }
                    } catch (error) {
                        
                    }
                }
            }
            return totalAmount;
        }
        useEffect(()=>{
            // console.log(cartItems);
        },[cartItems])

        // when token becomes available, sync server cart
        useEffect(() => {
            if (token) {
              console.log('ShopContext token available, syncing cart from server');
                getUserCart();
            }
        }, [token])

        const getProductsData = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/product/list`);
                // console.log(res.data);
                
                if (res?.data?.success) {
                    setProducts(res.data.products || []);
                    
                } else {
                    toast.error(res.data.message);
                    console.error('Failed fetching products:', res?.data);
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error(error.message);
                setProducts([]);
            }
        }

        useEffect(()=>{
            getProductsData();
        },[])

        useEffect(()=>{
            if(!token && localStorage.getItem('token')){
                setToken(localStorage.getItem('token'))
            }
        },[])

        const value = {
            products,currency,delivery_fee,search,setSearch,showSearch,setShowSearch,cartItems,addToCart,getCartCount,updateQuantity,getCartAmount,navigate,backendUrl,setToken,token,setCartItems
        }


        return(
            <ShopContext.Provider value={value}>
                {props.children}
            </ShopContext.Provider>
        )

}

export default ShopContextProvider;