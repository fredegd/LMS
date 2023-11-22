import React from 'react'

export default function CoverPage({data}) {

  return (
    <div>
        <h2 className='text-gray-400 mb-3'>Preview:</h2>
        <img src={data} alt={item.title} />
    </div>
  )
}
