'use client'
import Image from 'next/image'
import React, { useState } from 'react'

// const images = [
//   {
//     id: 1,
//     url: 'https://images.pexels.com/photos/6804595/pexels-photo-6804595.jpeg?auto=compress&cs=tinysrgb&w=600',
//   },
//   {
//     id: 2,
//     url: 'https://images.pexels.com/photos/4385547/pexels-photo-4385547.jpeg?auto=compress&cs=tinysrgb&w=600',
//   },
//   {
//     id: 3,
//     url: 'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=600',
//   },
//   {
//     id: 4,
//     url: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600',
//   },
// ]

const ProductImages = ({ items }: { items: any }) => {
  const [index, setIndex] = useState(0)

  return (
    <div className="">
      <div className="h-[500px] relative">
        <div className="">
          <Image
            src={items[index].image?.url}
            alt=""
            fill
            className="object-cover rounded-md"
            sizes="30vw"
          />
        </div>
      </div>
      <div className="flex justify-between gap-4 mt-8 ">
        {items.map((item: any, i: number) => (
          <div
            key={item._id}
            className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer"
            onClick={() => setIndex(i)}
          >
            <Image
              src={item.image?.url}
              alt=""
              fill
              className="object-cover rounded-md"
              sizes="30vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
