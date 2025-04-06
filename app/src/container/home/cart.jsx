import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import Footer from "./components/Footer"
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartPage = () => {
    const navigate = useNavigate()
    const [selectedShipping, setSelectedShipping] = useState("fedex")
    const [user, setUser] = useState(null)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [quantities, setQuantities] = useState({}); // State to track quantities

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch('http://localhost:5050/users')
                const users = await userResponse.json()
                const currentUser = users.find(u => u._id === JSON.parse(localStorage.getItem('user'))._id)
                setUser(currentUser)

                const productResponse = await fetch('http://localhost:5050/products')
                const allProducts = await productResponse.json()
                setProducts(allProducts)

                const userCartItems = currentUser.productsCart.map(productId => allProducts.find(product => product._id === productId)).filter(Boolean)
                setCartItems(userCartItems)

                // Initialize quantities for each item in the cart
                const initialQuantities = {};
                userCartItems.forEach(item => {
                    initialQuantities[item._id] = 1; // Default quantity to 1
                });
                setQuantities(initialQuantities);
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        fetchData()
    }, [])

    // Calculate total price of cart items
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * (quantities[item._id] || 1)), 0).toFixed(2); // Sum prices and format to 2 decimal places

    const handleQuantityChange = (itemId, change) => {
        setQuantities(prev => {
            const newQuantity = (prev[itemId] || 1) + change;
            return {
                ...prev,
                [itemId]: Math.max(newQuantity, 1) // Ensure quantity doesn't go below 1
            };
        });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault()
        
        // Check if there are items in the cart
        if (cartItems.length === 0) {
            toast.error("You need to add products before placing an order."); // Show toast notification
            return; // Exit the function early
        }

        try {
            // Create order items array
            const items = cartItems.map(item => ({
                productId: item._id,
                quantity: quantities[item._id] || 1, // Use the specified quantity
                price: item.price
            }));

            // Calculate total price as a number
            const totalPrice = parseFloat(cartItems.reduce((total, item) => total + (item.price * (quantities[item._id] || 1)), 0)).toFixed(2); // Ensure totalPrice is a number

            const orderData = {
                userId: user._id,
                status: "Pending",
                totalPrice: totalPrice, // Pass totalPrice as a string formatted to 2 decimal places
                paymentMethod: "Cash on Delivery",
                createdAt: new Date().toISOString(),
                items: items
            }

            // Create order
            const orderResponse = await fetch('http://localhost:5050/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            })

            const newOrder = await orderResponse.json()

            // Clear user's cart in backend
            const updateUserResponse = await fetch(`http://localhost:5050/users/${user._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productsCart: []
                })
            })

            if (!updateUserResponse.ok) {
                const errorResponse = await updateUserResponse.json();
                console.error('Failed to clear cart:', errorResponse);
                throw new Error('Failed to clear cart');
            }

            // Update local user state
            setUser(prev => ({
                ...prev,
                productsCart: []
            }))

            // Clear cart items
            setCartItems([])

            // Update localStorage
            const localUser = JSON.parse(localStorage.getItem('user'))
            localStorage.setItem('user', JSON.stringify({
                ...localUser,
                productsCart: []
            }))

            // Navigate to done page
            navigate('/done', { 
                state: { 
                    orderId: newOrder._id,
                    createdAt: newOrder.createdAt,
                    totalItems: items.length,
                    totalPrice: totalPrice // Pass totalPrice as a string
                } 
            })

        } catch (error) {
            console.error("Error creating order:", error)
            alert("Failed to place order. Please try again.")
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <ToastContainer />

            {/* Navigation Button to go back to IndexPage */}
            <div className="p-4">
                <Link to="/" className="inline-block px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-700">
                    Back to Home
                </Link>
            </div>

            {/* Main Content */}
            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Order Summary */}
                        <div className="w-full lg:w-1/2 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                                <p className="text-gray-500">Check your items.</p>
                            </div>

                            {/* Cart Items */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                {cartItems.map(item => (
                                    <div key={item._id} className="p-6 border-b border-gray-200">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                <p className="text-gray-500">W: {item.dimensions.width}cm × D: {item.dimensions.depth}cm × H: {item.dimensions.height}cm</p>
                                                <p className="text-lg font-bold mt-2">${item.price}</p>
                                                <div className="flex items-center mt-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(item._id, -1)}
                                                        className="px-2 py-1 border border-gray-300 rounded-md"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2">{quantities[item._id] || 1}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item._id, 1)}
                                                        className="px-2 py-1 border border-gray-300 rounded-md"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Payment Details */}
                        <div className="w-full lg:w-1/2 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                                <p className="text-gray-500">Complete your order by providing your payment details.</p>
                            </div>

                            <form onSubmit={handlePlaceOrder} className="space-y-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            value={user ? user.email : ''}
                                            readOnly
                                            className="block w-full rounded-md border border-gray-300 py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                        />
                                    </div>
                                </div>

                                {/* Customer */}
                                <div className="space-y-2">
                                    <label htmlFor="cardHolder" className="block font-medium text-gray-700">Customer</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="cardHolder"
                                            value={user ? user.fullName : ''}
                                            readOnly
                                            className="block w-full rounded-md border border-gray-300 py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                        />
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div className="space-y-2">
                                    <label htmlFor="address" className="block font-medium text-gray-700">
                                        Billing Address
                                    </label>
                                    <div className="grid gap-4">
                                        <div className="col-span-3 relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="address"
                                                value={user ? user.deliveryAddress : ''}
                                                placeholder="Street Address"
                                                className="pl-10 block w-full rounded-md border border-gray-300 py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="pt-6 border-t border-gray-200">
                                    <div className="flex justify-between py-4 text-lg font-bold">
                                        <span>Total</span>
                                        <span>${totalPrice}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gray-900 text-white py-4 px-6 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Place Order
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer/>
        </div>
    )
}

export default CartPage;