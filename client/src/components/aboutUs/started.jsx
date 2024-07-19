import React from 'react';

export default function Started() {
  return (
    <div className=' bg-gray-50 flex justify-around p-20'>
      <div className='flex-1 pb-2'>
        <h3 className='text-xs text-[#8d75e6] mb-5'>
          HOW IT STARTED
        </h3>
        <span className='text-[#8d75e6] text-[2rem]'>
            Fuelled by passsion and vision, <br />we launched to revolutionize Lab referrals.
        </span>
        <p className='mt-5 text-base'>
        Before LabConnect, the founder, <span className='text-[#8d75e6]'>Dr. David Zeyeh,</span> <br/> spent over a decade  navigating the complexities of<br/> laboratory referrals. He encountered common challenges: <br/> overwhelming paperwork, delays in results, and inefficient <br/> communication. Realizing the need for a streamlined solution,<br/> He launched LabConnect in 2024 to revolutionize the lab <br/>referral process and improve patient care.
        </p>
      </div>
      <div className='h-[57.4%] w-[50.6%] border-2 rounded-md bg-[#DEC6FA] flex-shrink-0 p-5'>
       <h4 className='pl-5'>OUR MISSION</h4>
       <p className='mt-5 p-5 text-2xl text-[#3b0764] text-bold'>
        TO POWER THE <br/>
        THE WORLD'S MOST <br/>
        IMPORTANT <br/>
        REFERRAL SYSTEM
       </p>
       <img src='/images/microscop.gif' alt='a rotating microscope' className="w-32 h-32 object-contain rounded-full mt-10"/>
      </div>
    </div>
  );
}
