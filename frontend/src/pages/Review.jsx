import { useContext, useState} from "react";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// const RatingsAndReviews = () => {
//   const{backendUrl,token}=useContext(AppContext)
//     // { docInfo, backendUrl, token, Id, getDoctors }
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const navigate = useNavigate();

//   const submitReview = async () => {
//     if (!token) {
//       toast.warn("Login to submit a review");
//       return navigate("/login");
//     }

//     if (!rating || !comment.trim()) {
//       toast.error("Please provide a rating and a comment.");
//       return;
//     }

//     try {
//       const response = await fetch(`${backendUrl}/api/user/submit-review`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           // docId: Id,
//           rating,
//           comment,
//         }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         toast.success("Review submitted successfully!");
//         // getDoctors(); // Refresh reviews
//         setRating(0);
//         setComment("");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to submit review.");
//     }
//   };

//   return (
//     <div className="mt-4 p-4 border rounded-lg shadow-md bg-white w-full md:w-3/4 lg:w-1/2 mx-auto">
//       <p className="text-lg font-semibold text-gray-900">Ratings & Reviews</p>
      
//       {/* <div className="mt-2">
//         {docInfo.reviews && docInfo.reviews.length > 0 ? (
//           docInfo.reviews.map((review, index) => (
//             <div key={index} className="border border-gray-300 rounded-lg p-3 mb-2">
//               <p className="text-sm font-semibold">{review.user}</p>
//               <p className="text-xs text-gray-500">Rating: ⭐{review.rating}/5</p>
//               <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
//             </div>
//           ))
//         ) : (
//           <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
//         )}
//       </div> */}
      
//       <div className="mt-4">
//         <p className="text-sm font-semibold">Leave a Review</p>
        
//         <div className="flex gap-1 text-yellow-500 text-xl mt-2">
//           {[...Array(5)].map((_, i) => (
//             <span
//               key={i}
//               className={`cursor-pointer ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
//               onClick={() => setRating(i + 1)}
//             >
//               ★
//             </span>
//           ))}
//         </div>

//         <textarea
//           rows="3"
//           placeholder="Write a comment..."
//           className="border border-gray-300 rounded-md p-2 w-full mt-2"
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//         ></textarea>
        
//         <button
//           onClick={submitReview}
//           className="bg-primary text-white text-sm font-light px-5 py-2 rounded-full mt-2 w-full"
//         >
//           Submit Review
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RatingsAndReviews;



// import { useEffect} from "react";
// import { useLocation} from "react-router-dom";
// import {jwtDecode} from "jwt-decode";


import {  useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";
// import { AppContext } from "../context/AppContext";

const ReviewPage = () => {
  const { backendUrl } = useContext(AppContext);
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // Extract token from URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    // console.log("Extracted Token:", token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        // console.log("Decoded Token:", decoded);

        // Extract userId and doctorId correctly
        const extractedUserId = decoded.userId?._id || decoded.userId?.userId;
        const extractedDoctorId = decoded.docId || decoded.doctorId;

        if (!extractedUserId || !extractedDoctorId) {
          throw new Error("Invalid token structure.");
        }

        setUserId(extractedUserId);
        setDoctorId(extractedDoctorId);
        // console.log("User ID:", extractedUserId);
        // console.log("Doctor ID:", extractedDoctorId);
      } catch (error) {
        console.error("Invalid Token:", error);
        toast.error("Invalid or expired review link.");
      }
    } else {
      toast.error("No token provided in URL.");
    }
  }, [location]);

  const submitReview = async () => {
    if (!userId || !doctorId) {
      toast.error("Invalid session. Please use the email link.");
      return;
    }

    if (!rating || !comment) {
      toast.error("Please provide a rating and a comment.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/user/submit-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, doctorId, rating, comment }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Review submitted successfully!");
        setRating(0);
        setComment("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Review Submission Failed:", error);
      toast.error("Failed to submit review.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold">Leave a Review</h2>
      {userId && doctorId ? (
        <>
          <div className="flex gap-1 text-yellow-500 text-xl mt-2">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`cursor-pointer ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
                onClick={() => setRating(i + 1)} 
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            rows="3"
            placeholder="Write a comment..."
            className="border rounded-md p-2 w-full mt-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={submitReview}
            className="bg-blue-500 text-white px-5 py-2 rounded mt-2"
          >
            Submit Review
          </button>
        </>
      ) : (
        <p className="text-red-500">Invalid or expired review link.</p>
      )}
    </div>
  );
};

export default ReviewPage;
