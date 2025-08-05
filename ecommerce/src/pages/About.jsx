import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

export default function About() {
  return (
    <div className='p-7'>
      <div>
        <Title text1="ABOUT" text2="US"/>
      </div>
      <div className='flex p-7'>
        <div className='p-10'>
          <img src={assets.about_img} alt="" className='w-[1000px]'/>
        </div>
        <div className='flex flex-col gap-8 p-10 text-gray-500'>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, quod. Atque mollitia veniam vitae quam natus beatae dolore eaque omnis vel eligendi harum, et exercitationem quis molestiae iusto maiores in deserunt sit voluptas delectus libero.
          </div>
          <div>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione, magni dolorum. Nisi excepturi beatae repellendus officia autem magni repudiandae velit. Nesciunt aliquid modi obcaecati quam magni ab possimus iste autem incidunt, quae qui cumque tempora!
          </div>
          <div className='font-bold text-black'>
            Our Mission
          </div>
          <div>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut error enim quam magnam labore eaque animi quisquam ab cumque facilis quas assumenda saepe sed dicta, exercitationem sapiente, perferendis, praesentium minus aliquam nisi in nulla totam! Aspernatur placeat numquam explicabo tempora.
          </div>
        </div>
      </div>
      <div>
        <div id='T' className=' pb-5'> 
            <div className=' h-[40px] flex gap-2 items-center text-[20px] relative pb-0 mb-0 '>
        <div className='text-gray-500'>
            WHY

        </div>
        <div>
            CHOOSE US

        </div>
        <div className='flex items-center justify-start '>

        <div className='w-[40px] h-[2px] bg-black mt-0'>
        </div>

        </div>

    </div>

        </div>
        <div className='flex mb-10'>
          <div className='w-[30%] flex flex-col gap-5 text-gray-500 text-[13px] border border-gray-200 p-20'>
            <div className='font-bold text-black'>
              QUALITY ASSURED
            </div>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, cumque nulla! Enim et ad similique nisi saepe! Ipsum, blanditiis possimus.
            </div>

          </div>
          <div className='w-[30%] flex flex-col gap-5 text-gray-500 text-[13px] border border-gray-200 p-20'>
            <div className='font-bold text-black'>
              QUALITY ASSURED
            </div>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, cumque nulla! Enim et ad similique nisi saepe! Ipsum, blanditiis possimus.
            </div>

          </div>
          <div className='w-[30%] flex flex-col gap-5 text-gray-500 text-[13px] border border-gray-200 p-20'>
            <div className='font-bold text-black'>
              QUALITY ASSURED
            </div>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, cumque nulla! Enim et ad similique nisi saepe! Ipsum, blanditiis possimus.
            </div>

          </div>
          
        </div>

      </div>
      <NewsletterBox/>


    </div>
  )
}