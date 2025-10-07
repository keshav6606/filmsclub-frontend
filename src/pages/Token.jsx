import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SEO from "../components/SEO";

import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // onAuthStateChanged import किया गया

import { Spinner } from "@nextui-org/spinner";
import { v4 as uuidv4 } from "uuid";
import Lottie from "lottie-react";

import happy from "../assets/lotte/happy.json";
import sad from "../assets/lotte/sad.json";

export default function Token() {
   const [loading, setLoading] = useState(true);
   const [tokenCreationStatus, setTokenCreationStatus] = useState(null);
   const [countdown, setCountdown] = useState(10);
   const SHORTNER_TIME_HOURS = parseInt(import.meta.env.VITE_SHORTNER_TIME || '2', 10); // Parse as integer, default 2 hours
   const SITENAME = import.meta.env.VITE_SITENAME;

   const { tokenID } = useParams();
   const auth = getAuth();

   // 1. Token Logic functions

   // Fetch the user's token from Firestore
   const fetchUserToken = async (userId) => {
     try {
       const userTokenDoc = await getDoc(doc(db, "tokens", userId));
       if (userTokenDoc.exists()) {
         const { token } = userTokenDoc.data();
         return token || false;
       }
       return false;
     } catch (error) {
       console.error("Error verifying token:", error);
       return false;
     }
   };

   // Create and store the token with an expiration timestamp
   const createAndStoreToken = async (userId) => {
     const existingToken = await fetchUserToken(userId);
     
     // Check if the existing token matches the token from URL
     if (existingToken === tokenID) {
       // Calculate expiration time in milliseconds
       const expiresAt = Date.now() + SHORTNER_TIME_HOURS * 60 * 60 * 1000; 

       try {
         const generateToken = () => uuidv4();
         const newtoken = generateToken();
         await setDoc(doc(db, "tokens", userId), { token: newtoken, expiresAt });
         setTokenCreationStatus(true);
         console.log("Token successfully stored.");
       } catch (error) {
         console.error("Error storing token:", error);
         setTokenCreationStatus(false);
       }
     } else {
       setTokenCreationStatus(false);
     }
     setLoading(false);
   };

   // 2. Auth State Listener and Token Creation Trigger
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       if (user) {
         // User is signed in, proceed with token logic
         if (tokenID) {
           createAndStoreToken(user.uid);
         } else {
           // No token in URL but user is logged in
           setTokenCreationStatus(false); 
           setLoading(false);
         }
       } else {
         // User is not signed in
         console.log("User is not logged in.");
         setTokenCreationStatus(false);
         setLoading(false);
       }
     });

     return () => unsubscribe();
   }, [tokenID]); // Depend only on tokenID, auth listener handles user state

   // 3. Countdown and Window Close Logic
   useEffect(() => {
     if (tokenCreationStatus !== null) {
       // Start countdown only after token creation attempt is complete
       const countdownInterval = setInterval(() => {
         setCountdown((prevCountdown) => {
           if (prevCountdown <= 1) {
             clearInterval(countdownInterval);
             // Close the window after countdown is done
             if (window.opener) {
               window.close();
             }
             return 0;
           }
           return prevCountdown - 1;
         });
       }, 1000);

       return () => clearInterval(countdownInterval);
     }
   }, [tokenCreationStatus]); // Trigger when tokenCreationStatus is set

   return (
     <div className="text-primaryTextColor flex items-center justify-center min-h-screen">
       <SEO
         title={`Token Verification | ${SITENAME}`}
         // ... (Rest of SEO props)
       />
       
       {/* Loading State */}
       {loading && (
         <Spinner
           label="Verifying User & Token..."
           labelColor="warning"
           color="warning"
           className="min-h-screen flex items-center justify-center" // Better centering
         />
       )}

       {/* Success State */}
       {!loading && tokenCreationStatus === true && (
         <div className="flex flex-col justify-center gap-5 items-center p-8 text-center max-w-lg">
           <Lottie
             animationData={happy}
             className="w-full max-w-xs" // Adjusted Lottie size class
             loop={true}
             autoplay={true}
           />
           <div className="flex flex-col gap-1 items-center justify-center">
             <h1 className="text-2xl font-bold">
               Done! Now enjoy the echo without limit for {SHORTNER_TIME_HOURS} hr.
             </h1>
             <h2 className="text-lg mt-2">Closing in: <span className="text-otherColor font-bold">{countdown}</span> seconds</h2>
           </div>
         </div>
       )}

       {/* Failure State */}
       {!loading && tokenCreationStatus === false && (
         <div className="flex flex-col justify-center gap-5 items-center p-8 text-center max-w-lg">
           <Lottie
             animationData={sad}
             loop={true}
             autoplay={true}
             className="w-full max-w-xs" // Adjusted Lottie size class
           />
           <div className="flex flex-col gap-1 items-center justify-center">
             <h1 className="text-2xl font-bold">Sorry, there was an issue with the token.</h1>
             <p className="text-sm text-secondaryTextColor">Please ensure you are logged in and try again from the source link.</p>
             <h2 className="text-lg mt-2">Closing in: <span className="text-otherColor font-bold">{countdown}</span> seconds</h2>
           </div>
         </div>
       )}
     </div>
   );
}
