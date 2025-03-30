import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Link } from 'react-router-dom'; // Import Link for navigation

const IndexPage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]); // State to hold users

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('http://localhost:5050/products');
            const data = await response.json();
            setFeaturedProducts(data);
        };

        const fetchCategories = async () => {
            const response = await fetch('http://localhost:5050/categories');
            const data = await response.json();
            setCategories(data);
        };

        const fetchUsers = async () => {
            const userResponse = await fetch('http://localhost:5050/users'); // Fetch all users
            const data = await userResponse.json();
            setUsers(data);
        };

        fetchProducts();
        fetchCategories();
        fetchUsers(); // Fetch users
    }, []);

    const randomProducts = featuredProducts.sort(() => 0.5 - Math.random()).slice(0, 4); // Select 4 random products

    const handleAddToCart = async (productId) => {
        try {
            const userId = JSON.parse(localStorage.getItem('user'))._id; // Get current user's ID
            const userResponse = await fetch('http://localhost:5050/users'); // Fetch all users
            const users = await userResponse.json(); // Get users data
            const currentUser = users.find(u => u._id === userId); // Find the current user

            if (!currentUser) {
                throw new Error('User not found');
            }

            // Prepare the body to send as an array
            const response = await fetch(`http://localhost:5050/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productsCart: [productId] // Send productId as an array
                }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Get error details from response
                throw new Error(`Failed to add product to cart: ${errorData.error || 'Unknown error'}`);
            }

            console.log('Product added to cart successfully');
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                            <div className="space-y-4">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Elevate Your Living Space
                                </h1>
                                <p className="text-gray-500 md:text-xl">
                                    Discover furniture that combines comfort, style, and quality craftsmanship for every room in your
                                    home.
                                </p>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link to="/product" className="px-6 py-3 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800">
                                        Shop Now
                                    </Link>
                                    <button className="px-6 py-3 text-sm font-medium text-gray-900 border border-gray-200 rounded-md hover:bg-gray-50">
                                        View Collections
                                    </button>
                                </div>
                            </div>
                            <div className="mx-auto w-full max-w-[500px] overflow-hidden rounded-xl">
                                <img
                                    src="https://www.iksaigon.com/wp-content/uploads/2018/11/ikea-vietnam-tphcm.jpg"
                                    alt="Modern living room with stylish furniture"
                                    className="aspect-[4/3] object-cover w-full"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="w-full py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured Products</h2>
                                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
                                    Our most popular pieces, loved by customers for their design and comfort.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                            {randomProducts.map((product) => (
                                <div key={product._id} className="group relative overflow-hidden rounded-lg border">
                                    <div className="aspect-square overflow-hidden">
                                        <Link to={`/productDetail/${product._id}`}>
                                            <img
                                                src={product.images[0] || "/placeholder.svg"}
                                                alt={product.name}
                                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                            />
                                        </Link>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold">{product.name}</h3>
                                        <p className="text-sm text-gray-500">{product.category}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-medium">${product.price}</span>
                                            <button 
                                                onClick={() => handleAddToCart(product._id)} // Call the function on click
                                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                                            >
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
                                                    className="h-4 w-4"
                                                >
                                                    <circle cx="8" cy="21" r="1" />
                                                    <circle cx="19" cy="21" r="1" />
                                                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                                                </svg>
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-10">
                            <Link to="/product" className="flex items-center gap-1 px-6 py-3 text-sm font-medium text-gray-900 border border-gray-200 rounded-md hover:bg-gray-50">
                                View All Products
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
                                    className="h-4 w-4"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="w-full py-12 md:py-24 bg-gray-50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Shop by Room</h2>
                                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
                                    Find the perfect pieces for every space in your home.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {categories.map((category) => (
                                <Link key={category._id} to={`/categorySub/${category._id}`} className="group relative overflow-hidden rounded-lg h-60">
                                    <img
                                        src={category.image || "/placeholder.svg"}
                                        alt={category.name}
                                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="flex justify-center mt-10">
                            <button onClick={() => window.location.href='/category'} className="flex items-center gap-1 px-6 py-3 text-sm font-medium text-gray-900 border border-gray-200 rounded-md hover:bg-gray-50">
                                View All Category
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
                                    className="h-4 w-4"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="w-full py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Our Customers Say</h2>
                                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
                                    Don't just take our word for it — hear from our satisfied customers.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="rounded-lg border p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="rounded-full bg-gray-100 p-1">
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
                                                className="text-gray-600"
                                            >
                                                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                                                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500">{testimonial.location}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-500">{testimonial.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

// Sample data
const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        location: "New York, NY",
        text: "The quality of my new sofa exceeded my expectations. The customer service team was also incredibly helpful throughout the delivery process.",
    },
    {
        id: 2,
        name: "Michael Chen",
        location: "San Francisco, CA",
        text: "I furnished my entire apartment with ComfortHome pieces. Everything arrived on time and the assembly was straightforward.",
    },
    {
        id: 3,
        name: "Emma Williams",
        location: "Chicago, IL",
        text: "The dining table I purchased is not only beautiful but incredibly sturdy. It's become the centerpiece of our family gatherings.",
    },
];

export default IndexPage;