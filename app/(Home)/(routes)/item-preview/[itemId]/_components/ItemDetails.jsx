import React from 'react'

export default function ItemDetails({item}) {
  return (
    <div className='mt-5 p-5 rounded-md border'>

        <h2 className="text-[20px] font-medium">
            {item.title}
        </h2>
        <div>
            book <h2 className='text-[12px] text-gray-400'>{`${item.chapterSection.length()}`}</h2>
        </div>


    </div>
  )
}
