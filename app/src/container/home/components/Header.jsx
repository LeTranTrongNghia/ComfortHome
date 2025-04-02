import React, { useState, useEffect } from 'react';

const Header = () => {
    const [user, setUser] = useState(null); // State to hold user info

    // Example function to simulate user login state
    const checkUserLogin = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Set user state if found
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear user data from local storage
        setUser(null); // Update user state
        console.log("User logged out");
    };

    const handleCartClick = () => {
        if (user) {
            window.location.href = '/cart'; // Navigate to cart if user is logged in
        } else {
            window.location.href = '/login'; // Navigate to login if user is not logged in
        }
    };

    useEffect(() => {
        checkUserLogin(); // Initial check for user login
    }, []); // Run only once on mount

    useEffect(() => {
        const interval = setInterval(() => {
            checkUserLogin(); // Refetch user data every 5 seconds
        }, 5000); // Changed back to 5000 for 5 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []); // Run only once on mount

    useEffect(() => {
        console.log("Cart length:", user ? user.productsCart.length : 0); // Log cart length whenever user changes
    }, [user]); // Log whenever user state changes

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container flex items-center justify-between h-16 px-4 md:px-6">
                <a href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold">ComfortHome</span>
                </a>
                {/* <nav className="hidden md:flex items-center gap-6 text-sm">
                    <a href="#" className="font-medium transition-colors hover:text-gray-900">
                        Category
                    </a>
                    <a href="#" className="font-medium transition-colors hover:text-gray-900">
                        Product
                    </a>
                </nav> */}
                <div className="flex items-center gap-4">
                    <button onClick={handleCartClick} className="relative p-2 hover:bg-gray-100 rounded-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <circle cx="8" cy="21" r="1" />
                            <circle cx="19" cy="21" r="1" />
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
                            {user ? user.productsCart.length : 0}
                        </span>
                    </button>
                    {user ? (
                        <>
                            <span className="text-black font-bold">Welcome {user.fullName}</span>
                            <button onClick={handleLogout} className="hidden md:flex px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-800">
                                Logout
                            </button>
                        </>
                    ) : (
                        <button onClick={() => window.location.href = '/login'} className="hidden md:flex px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800">
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
export default Header;