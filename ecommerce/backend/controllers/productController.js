import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';

// function 4 add product

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category || !subCategory || !sizes) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: name, description, price, category, subCategory, sizes"
            });
        }

        // Parse sizes safely
        let sizesArray;
        try {
            sizesArray = JSON.parse(sizes.replace(/'/g, '"')); // allow single quotes too
            if (!Array.isArray(sizesArray)) {
                throw new Error("Sizes must be an array");
            }
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON format for sizes. Use: [\"S\",\"M\",\"L\"]"
            });
        }

        // Get uploaded images from multer (using upload.fields)
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter(Boolean);

        if (images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one product image"
            });
        }

        // Upload to Cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        // Build product object
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true",
            sizes: sizesArray,
            image: imagesUrl,
            date: Date.now()
        };

        // Save to DB
        const product = new productModel(productData);
        await product.save();

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

// function 4 list product

const listProduct = async(req,res)=>{
    
}

// function 4 remove product

const removeProduct = async(req,res)=>{
    
}

// function 4 single product info

const singleProduct = async(req,res)=>{
    
}

export {listProduct,addProduct,singleProduct,removeProduct}