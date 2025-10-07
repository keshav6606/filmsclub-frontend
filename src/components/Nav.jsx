// import Cookies from "universal-cookie";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/black-and-white.css";

import { FiSearch } from "react-icons/fi";
import { VscClose } from "react-icons/vsc";
import { BiHomeAlt2, BiSolidMovie, BiStar } from "react-icons/bi";

import { BsTv } from "react-icons/bs";
import posterPlaceholder from "../assets/images/poster-placeholder.png";
// import UserInfoBtn from "./Logout";

export default function Nav() {
  const BASE = import.meta.env.VITE_BASE_URL; // Base Url for backend
  const SITENAME = import.meta.env.VITE_SITENAME;

  // Query State
  const [query, setQuery] = React.useState("");
  const [debouncedVal, setDebouncedVal] = React.useState("");
  const [searcResult, setSearchResult] = useState([]);

  const [isLoading, setIsLoading] = useState(true); 
  const [navStatus, setNavStatus] = useState("Home");
    // mobileMenuOpen state is kept for the traditional side menu fallback, 
    // but its usage for navigation is now replaced by BottomNav.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const location = useLocation(); 

    // New state for mobile search visibility
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Update navStatus based on the current path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setNavStatus("Home");
    } else if (path.startsWith("/mov") || path.startsWith("/Movies")) {
      setNavStatus("Movies");
    } else if (path.startsWith("/ser") || path.startsWith("/Series")) {
      setNavStatus("Series");
    } else if (path.startsWith("/search")) { // Add search status update
        setNavStatus("Search");
    }
  }, [location.pathname]);

  // Query Data Fetcher
  try {
    useEffect(() => {
      setIsLoading(true); 
      fetch(`${BASE}/api/search/?query=${debouncedVal}&page=1`)
        .then((search_res) => search_res.json())
        .then((search_data) => {
          setSearchResult(search_data.results);

          setIsLoading(false); 
        });
    }, [debouncedVal]);
  } catch (error) {
    <p className="main-search-result-container">{error}</p>;
  }

  // Debouncing Function
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVal(query);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [query, 1000]);

  let closeSearchResultsDropDown = useRef(); 
  useEffect(() => {
    let closeSearchResultsDropdownHandler = (event) => {
      if (
        closeSearchResultsDropDown.current &&
        !closeSearchResultsDropDown.current.contains(event.target)
      ) {
        // Clear query to close the dropdown
        setDebouncedVal("");
        setQuery(""); 
        setMobileSearchOpen(false); // Close mobile search overlay on outside click
      }
    };
    document.addEventListener("mousedown", closeSearchResultsDropdownHandler);
    return () => {
      document.removeEventListener(
        "mousedown",
        closeSearchResultsDropdownHandler
      );
    };
  }, []);

  // for Mobile Menu popup Closing (Kept for the hamburger icon on small screens)
  const closeMobileMenu = useRef(); 
  useEffect(() => {
    let closeMobileMenuHandler = (event) => {
      if (
        closeMobileMenu.current &&
        !closeMobileMenu.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMobileMenuHandler);
    document.addEventListener("scroll", closeMobileMenuHandler);
    return () => {
      document.removeEventListener("mousedown", closeMobileMenuHandler);
      document.removeEventListener("scroll", closeMobileMenuHandler);

    };
  }, []);

  return (
    <>
      
        {/* 1. TOP BAR CONTAINER (Always at top) */}
        <div className={`fixed flex items-center justify-between gap-3 z-20 bg-bgColor/60 backdrop-blur-md top-0 left-0 right-0 py-4 px-5 md:px-10  text-white ${mobileSearchOpen ? 'w-full' : ''}`}>
            
            {/* Logo/Sitename (Hidden on small screens when mobile search is open) */}
          <Link
            to="/"
            className={`items-center gap-2 uppercase text-otherColor font-extrabold text-2xl ${mobileSearchOpen ? 'hidden md:flex' : 'flex'}`}
          >
            <p>{SITENAME}</p>
          </Link>

          {/* Navigations Large Screen (Hidden on small screens)*/}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {[
                { icon: BiHomeAlt2, name: "Home" },
                { icon: BiSolidMovie, name: "Movies" },
                { icon: BsTv, name: "Series" },
              ].map((navItem, index) => {
                return (
                  <Link
                    key={index}
                    to={navItem.name === "Home" ? "/" : navItem.name}
                    className={
                      navStatus === navItem.name
                        ? "flex flex-col items-center transition-all duration-300 ease-in-out text-otherColor scale-105"
                        : "flex flex-col items-center transition-all duration-300 ease-in-out hover:text-otherColor hover:scale-105"
                    }
                    onClick={() => setNavStatus(navItem.name)}
                  >
                    <li className="text-2xl">
                      <navItem.icon />
                    </li>
                    <p className="text-sm text-secondaryTextColor">
                      {navItem.name}
                    </p>
                  </Link>
                );
              })}
            </ul>
          </nav>
          
          {/* Search Form (Shows on large screen and when mobileSearchOpen is true) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className={`relative items-center ${mobileSearchOpen ? 'flex w-full' : 'hidden md:flex md:w-1/2'}`}
            ref={closeSearchResultsDropDown}
          >
            <input
              type="text"
              name="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Search ... "
                // On mobile search, FiSearch should be on the left
              className="py-3 px-10 outline-0 text-sm bg-btnColor/70 rounded-md w-full sm:text-base"
            />
                {/* Search Icon: Left on mobile search, Right on desktop */}
            <FiSearch className={`absolute text-secondaryTextColor ${mobileSearchOpen ? 'left-3' : 'right-5'}`} />

            {/* Close Icon for Mobile Search */}
            {mobileSearchOpen && (
                <VscClose
                    className="absolute right-3 text-secondaryTextColor cursor-pointer text-xl"
                    onClick={() => {
                        setMobileSearchOpen(false);
                        setQuery("");
                    }}
                />
            )}
            
            {/* SEARCH RESULTS CONTAINER */}
            {debouncedVal && (
              <div 
                className={`absolute flex flex-col items-center py-8 z-20 bg-btnColor w-full max-h-[70dvh] justify-start overflow-y-scroll top-14 rounded-xl ${mobileSearchOpen ? 'left-0' : '-left-10 right-5 xs:left-0'}`}
                >
                {/* Results Found Element */}
                {searcResult.length > 0 && !isLoading
                  ? searcResult.map((result) => {
                      return (
                        <Link
                          className="flex items-center w-full gap-4 transition-all duration-300 ease-in-out hover:bg-bgColor hover:text-primaryTextColor py-1 px-2 md:py-2 md:px-5"
                          onClick={() => {
                            setQuery("");
                            setMobileSearchOpen(false); // Close mobile search after selection
                          }}
                          to={
                            result.media_type === "movie"
                              ? `/mov/${result.tmdb_id}`
                              : `/ser/${result.tmdb_id}`
                          }
                          style={{ textDecoration: "none" }}
                          key={result.tmdb_id}
                        >
                          <div className="flex items-center w-[3.5rem] sm:w-[4rem] aspect-[9/13.5] object-cover bg-bgColor shrink-0 rounded-lg">
                            {result.poster ? (
                              <LazyLoadImage
                                alt={result.title}
                                src={result.poster}
                                effect="black-and-white"
                                className="object-cover shrink-0 bg-bgColor rounded-lg"
                              />
                            ) : (
                              <LazyLoadImage
                                alt={result.title}
                                src={posterPlaceholder}
                                className="object-cover shrink-0 bg-bgColor rounded-lg"
                              />
                            )}
                          </div>

                          <div className="">
                            <p className=" line-clamp-1 text-sm lg:text-base">
                              {result.title}
                            </p>
                            <p className="line-clamp-1 w-10/12 text-secondaryTextColor text-xs lg:text-sm">
                              {result.description}
                            </p>
                            {/* Year/Rating/Type */}
                            <div className="flex items-center gap-2 mt-2 text-secondaryTextColor text-[0.7rem]">
                              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-bgColor text-otherColor ">
                                <BiStar className="mb-0.25 " />
                                {result.rating && (
                                  <p className="">{result.rating.toFixed(1)}</p>
                                )}
                              </div>
                              {result.release_year && (
                                <p className="">{result.release_year}</p>
                              )}
                              {result.media_type == "tv" ? (
                                <p className="uppercase ">tv</p>
                              ) : (
                                <p className="uppercase ">mov</p>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  : // No results found
                    !isLoading && (
                      <p className="p-5 text-sm sm:text-base">
                        No results found for "{debouncedVal}".
                      </p>
                    )}

                {/* Loading Indicator Element */}
                {isLoading && (
                  <div className="p-5 flex justify-center content-center items-center ">
                    <div className="loader-search"></div>
                  </div>
                )}

                {/* View more results button */}
                {searcResult.length > 5 && !isLoading && (
                  <Link
                    className="bg-otherColor py-2 px-6 rounded-md min-w-[70%] text-sm mt-4  text-center"
                    to={`/search/${debouncedVal}`}
                    style={{ textDecoration: "none", color: "black" }}
                    onClick={() => {
                        setQuery("");
                        setMobileSearchOpen(false);
                    }}
                  >
                    <p>See More Results</p>
                  </Link>
                )}
              </div>
            )}
          </form>
          
          {/* navigation Small Screen (Original Hamburger menu is now removed or repurposed) */}
            {/* The old Hamburger menu is replaced by the Bottom Nav for better mobile UX */}
        </div>

        {/* 2. BOTTOM NAVIGATION BAR - Visible only on Small Screens (md:hidden) */}
        {mobileSearchOpen ? null : ( // Hide bottom nav when mobile search is active
            <nav className="fixed bottom-0 left-0 right-0 z-20 bg-bgColor/90 backdrop-blur-md py-2 text-white flex items-center justify-around md:hidden border-t border-gray-700">
                {[
                    { icon: BiHomeAlt2, name: "Home", path: "/" },
                    { icon: BiSolidMovie, name: "Movies", path: "/Movies" },
                    { icon: BsTv, name: "Series", path: "/Series" },
                    { icon: FiSearch, name: "Search", path: "#" }, 
                ].map((navItem, index) => {
                    const isActive = navStatus === navItem.name;
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                setNavStatus(navItem.name);
                                if (navItem.name === "Search") {
                                    setMobileSearchOpen(true); // Open search input on click
                                }
                            }}
                        >
                            <Link
                                to={navItem.path === '#' ? location.pathname : navItem.path} // Prevent actual navigation if it's Search button
                                className={
                                    isActive
                                        ? "flex flex-col items-center transition-all duration-300 ease-in-out text-otherColor scale-110"
                                        : "flex flex-col items-center transition-all duration-300 ease-in-out text-secondaryTextColor hover:text-otherColor"
                                }
                                style={{ pointerEvents: navItem.name === "Search" ? 'none' : 'auto', textDecoration: 'none' }}
                            >
                                <li className="text-3xl list-none">
                                    <navItem.icon />
                                </li>
                                <p className="text-xs">
                                    {navItem.name}
                                </p>
                            </Link>
                        </div>
                    )})}
            </nav>
        )}
        
    </>
  );
}
