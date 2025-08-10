import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

export default function Contact() {
  return (
    <div>
      <div className='p-10 pb-5'>
        <Title text1={"CONTACT"} text2={"US"}/>
        <div className='px-50 py-10 flex text-gray-500'>
          <div className='w-[50%]'>
            <img src={assets.contact_img} alt="" className='w-[100%]' />

          </div>
          <div className='px-10 py-20 flex flex-col '>
            <div className='font-semibold mb-5  text-black'>
              Our Store
            </div>
            <div className=''>
              90-8987 SM Street
            </div>
            <div className='mb-5'>
              Raipur Chhattisgarh
            </div>
            <div className=''>
              Lorem ipsum dolor sit amet.
            </div>
            <div className='mb-5'>
              Lorem ipsum dolor sit.
            </div>
            <div className='mb-5 font-semibold text-black'>
             Carrer at forever
            </div>
            <div className='mb-5'>
              Lorem ipsum dolor sit amet.
            </div>
            <div className='border w-fit px-6 py-4 hover:bg-black hover:text-white transition-all duration-500'>
              Explore Jobs
            </div>

          </div>
        </div>
        <NewsletterBox/>


      </div>
    </div>
  )
}