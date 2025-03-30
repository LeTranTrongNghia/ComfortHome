import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Star } from "lucide-react";
import { Link } from 'react-router-dom';

const ProductPage = () => {
    const [products, setProducts] = useState([]); // State to hold products
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const [sortOrder, setSortOrder] = useState("lowToHigh"); // State for sorting
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const productsPerPage = 6; // Number of products per page
    const [categories, setCategories] = useState([]); // State for categories
    const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
    const [selectedSubCategory, setSelectedSubCategory] = useState(""); // State for selected sub-category

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('http://localhost:5050/products');
            const data = await response.json();
            setProducts(data);
        };

        const fetchCategories = async () => {
            const response = await fetch('http://localhost:5050/categories'); // Adjust the endpoint as necessary
            const data = await response.json();
            setCategories(data);
        };

        fetchProducts();
        fetchCategories();
    }, []);

    // Function to handle sorting and filtering
    const sortedProducts = () => {
        return products
            .filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedCategory ? product.category === selectedCategory : true) &&
                (selectedSubCategory ? product.sub_category === selectedSubCategory : true)
            )
            .sort((a, b) => {
                if (sortOrder === "lowToHigh") {
                    return a.price - b.price;
                } else {
                    return b.price - a.price;
                }
            });
    };

    // Calculate the products to display for the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts().slice(indexOfFirstProduct, indexOfLastProduct);

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate total pages
    const totalPages = Math.ceil(sortedProducts().length / productsPerPage);

    const handleAddToCart = async (productId) => {
        try {
            const userId = JSON.parse(localStorage.getItem('user'))._id; // Get current user's ID
            const response = await fetch(`http://localhost:5050/users/${userId}`, {
                method: 'PATCH', // Use PATCH to update the user's productsCart
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    $addToSet: { productsCart: productId } // Add productId to productsCart
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add product to cart');
            }

            // Optionally, you can fetch the updated user data here if needed
            console.log('Product added to cart successfully');
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col md:flex-row flex-grow">

                {/* Main Content */}
                <main className="flex-grow">
                    {/* Hero Banner */}
                    <div
                        className="relative w-full h-[calc(40vw*9/16)] max-h-screen bg-[url('https://fusionmineralpaint.com/wp-content/uploads/slider/cache/4b1d3b2cfa6f7ba6926acdd6fb1dbbe0/Untitled-design-2025-03-26T085842.874.png')] bg-cover bg-center bg-no-repeat"
                    >
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-black bg-opacity-50">
                            <h2 className="text-sm uppercase tracking-wider text-white mb-2">NEW STYLE 2025</h2>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Products</h1>
                            <p className="max-w-md text-sm text-gray-300">
                                A stunning collection of minimalist furniture designed to enhance your living space with elegance and simplicity.
                            </p>
                        </div>
                    </div>

                    {/* Product Filters */}
                    <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                            />
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                            >
                                <option value="lowToHigh">Price: Low to High</option>
                                <option value="highToLow">Price: High to Low</option>
                            </select>
                        </div>
                        <div className="text-sm text-gray-500">SHOWING {currentProducts.length} OF {sortedProducts().length} RESULTS</div>
                    </div>

                    <div className='flex'>
                        <aside className="hidden md:block w-64 border-r border-gray-200 p-4">
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 uppercase text-sm">Categories</h3>
                                <ul className="space-y-2">
                                    {categories.map(category => (
                                        <li key={category._id}>
                                            <button 
                                                onClick={() => {
                                                    setSelectedCategory(category.name);
                                                    setSelectedSubCategory(""); // Reset sub-category when category changes
                                                }}
                                                className={`hover:text-gray-500 ${selectedCategory === category.name ? 'font-bold' : ''}`}
                                            >
                                                {category.name}
                                            </button>
                                            {selectedCategory === category.name && (
                                                <ul className="pl-4">
                                                    {category.sub_categories.map(sub => (
                                                        <li key={sub}>
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedSubCategory(sub);
                                                                }}
                                                                className={`hover:text-gray-400 ${selectedSubCategory === sub ? 'font-bold' : ''}`}
                                                            >
                                                                {sub}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                            {currentProducts.map((product) => (
                                <Link to={`/productDetail/${product._id}`} key={product._id} className="group relative overflow-hidden rounded-lg border">
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={product.images[0] || "/placeholder.svg"}
                                            alt={product.name}
                                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold">{product.name}</h3>
                                        <p className="text-sm text-gray-500">{product.category}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-medium">${product.price}</span>
                                            <button 
                                                onClick={() => handleAddToCart(product._id)}
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
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center p-6 border-t border-gray-200">
                        <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`w-8 h-8 flex items-center justify-center border border-gray-300 ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default ProductPage;