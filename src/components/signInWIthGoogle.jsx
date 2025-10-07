import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button"; // NextUI Button component
import { FcGoogle } from "react-icons/fc"; // Google icon

function SignInwithGoogle() {
   const navigate = useNavigate();
   const { setIsAuthenticated } = useAuth(); // Get setIsAuthenticated from context

   async function googleLogin() {
     const provider = new GoogleAuthProvider();
     try {
       const result = await signInWithPopup(auth, provider);
       const user = result.user;

       if (user) {
         // Create/update user document in Firestore
         await setDoc(
           doc(db, "Users", user.uid),
           {
             email: user.email,
             firstName: user.displayName, // Use Google display name as firstName
             lastName: "",
           },
           { merge: true } // Use merge to avoid overwriting existing fields
         );

         toast.success("User logged in successfully! Redirecting...");

         setIsAuthenticated(true); // Update authentication state
         navigate("/"); // Redirect to home/profile page
       }
     } catch (error) {
       console.error("Login Error: ", error.message);
       // Handle common auth/popup errors gracefully
       let errorMessage = "Failed to log in. Please try again.";
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = "Google login window closed. Please try again.";
        }
       toast.error(errorMessage, {
         position: "top-center",
       });
     }
   }

   return (
     <div className="flex flex-col items-center justify-center w-full">
       
        {/* Or continue with Divider */}
       <div className="flex items-center justify-center my-4 w-full">
         <Divider className="flex-grow bg-gray-600" />
         <p className="mx-4 text-center whitespace-nowrap text-secondaryTextColor text-sm">
           Or continue with
         </p>
         <Divider className="flex-grow bg-gray-600" />
       </div>

        {/* Google Sign-in Button */}
       <Button
         startContent={<FcGoogle className="text-xl" />} // Use Google Icon
         className="w-full sm:w-3/4 max-w-sm py-6 bg-white text-black font-semibold shadow-md hover:bg-gray-100 transition-all duration-200"
         onClick={googleLogin}
       >
         Sign in with Google
       </Button>
     </div>
   );
}

export default SignInwithGoogle;
