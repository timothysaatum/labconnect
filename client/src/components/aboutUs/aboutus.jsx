import React from 'react';

export default function AboutUs(){
    
    return(
    <div class="bg-gray-50 min-h-screen flex items-center justify-center px-16">
  <div class="relative w-full max-w-lg">
    <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
    <div class="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    <div class="m-8 relative space-y-4">
      <div class="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
        <div class="flex-1">
          <div class="h-6 w-30 bg-gray-300 rounded-lg"></div>
        </div>
        <p>About us</p>
        <div>
          <div class="w-24 h-6 rounded-lg bg-purple-300"></div>
        </div>
      </div>
      <div className='flex items-center space-x-4 p-4'>
         <img src="/images/lab1.png" alt="Placeholder" className="w-30 h-50 object-cover" />
      </div>

      <div className=' space-x-4 p-4'>
        <h2 className='text-center'>LAB CONNECT</h2>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores voluptas possimus molestias dolores voluptatibus iusto error tenetur. Id omnis error, natus quaerat quam eius atque accusantium modi doloribus praesentium commodi!</p>
      </div>
      
</div>
  </div>
</div>
    )
}