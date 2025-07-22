import React from 'react';


const ReviewCard = ({ review }) => {
  return (
    <div className="max-w-sm text-center p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <img className="w-20 h-20 rounded-full mx-auto mb-4" src={review.userImage || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} alt="User Avatar" />
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {review.userName}
      </h5>
      <div className="flex justify-center mb-2">
        {/* Star rating - basic representation */}
        {[...Array(review.rating)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
        ))}
      </div>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        "{review.message}"
      </p>
    </div>
  );
};

export default ReviewCard;
