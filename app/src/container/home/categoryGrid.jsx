import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('http://localhost:5050/categories');
            const data = await response.json();
            setCategories(data);
        };

        const fetchProducts = async () => {
            const response = await fetch('http://localhost:5050/products');
            const data = await response.json();
            // Randomly select 2 products for featured products
            const randomProducts = data.sort(() => 0.5 - Math.random()).slice(0, 2);
            setFeaturedProducts(randomProducts);
        };

        fetchCategories();
        fetchProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Hero Section */}
                    <div className="mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            FURNITURE FESTIVAL in every corner of your home
                        </h1>

                        {/* Category Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {categories.map((category) => (
                                <Link key={category._id} to={`/categorySub/${category._id}`} className={`relative rounded-lg overflow-hidden h-80 group cursor-pointer`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img
                                            src={category.image || "/placeholder.svg"}
                                            alt={category.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                        <span className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium shadow-md">
                                            {category.name}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-12"></div>

                    {/* Content Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            An organized space helps you focus... on marathoning without interruptions.
                        </h2>
                        <p className="text-gray-700 mb-8 max-w-3xl">
                            A well-organized space gives you the freedom to enjoy yourself without worry. Find TV furniture that keeps
                            everything in its place and keeps your entertainment flowing without interruption.
                        </p>

                        {/* Featured Products */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {featuredProducts.map((product) => (
                                <div key={product._id} className="group cursor-pointer">
                                    <div className="rounded-lg overflow-hidden mb-4">
                                        <img
                                            src={product.images[0] || "/placeholder.svg"}
                                            alt={product.name}
                                            className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <h3 className="font-medium text-lg">{product.name}</h3>
                                    <p className="text-gray-900 font-bold">${product.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* News Section */}
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">It's time to renovate yourself.</h2>
                                <p className="flex items-center">
                                    Discover the <span className="text-orange-500 mx-1 font-medium">news</span> we have prepared for you.
                                </p>
                                <p className="text-gray-600 max-w-3xl mt-2">
                                    Collections that will become trending, items that are here to stay, products that reinvent themselves and
                                    a lot of inspiration designed so you can decorate your home as good as new.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="col-span-1 lg:col-span-2 rounded-lg overflow-hidden h-96">
                                <img
                                    src="https://ikeasaigon.com/wp-content/uploads/2015/11/ikea-furniture-vietnam.jpg"
                                    alt="Outdoor furniture"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="col-span-2 lg:col-span-1 rounded-lg overflow-hidden h-96">
                                <img
                                    src="https://www.ikea.com/images/a-colorful-living-room-with-a-sofa-and-a-chaise-lounge-in-or-00751d1b036ac33f4730ffbc32c08cc9.jpg?f=xl"
                                    alt="Outdoor furniture"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CategoryPage;