import { useState } from "react"

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
  })
  const [toastMessage, setToastMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        if (isLogin) {
            // Fetch all users to check login credentials
            const response = await fetch('http://localhost:5050/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const users = await response.json();
            const user = users.find(u => u.email === formData.email && u.password === formData.password);
            if (user) {
                // Store user info in local storage
                localStorage.setItem('user', JSON.stringify(user)); // Store user data
                setToastMessage(`Welcome ${user.fullName}`);
                setTimeout(() => {
                    window.location.reload(); // Refresh the page after 5 seconds
                }, 5000);
            } else {
                // Handle login error
                console.error("Invalid email or password");
            }
        } else {
            // Create account logic
            const response = await fetch('http://localhost:5050/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    role: 'customer', // Default role
                    productsCart: [], // Empty cart
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // Handle successful account creation
                setToastMessage("Account created successfully!");
                setTimeout(() => {
                    window.location.reload(); // Refresh the page after 5 seconds
                }, 5000);
            } else {
                // Handle account creation error
                console.error(data.error);
            }
        }
    } catch (error) {
        console.error("Error during submission:", error);
    }
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      {toastMessage && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">
          {toastMessage}
        </div>
      )}
      <h1 className="text-2xl font-medium text-gray-800 mb-6">
        {isLogin ? "Login to Your Account" : "Create an Account"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label htmlFor="fullName" className="block text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">
                Delivery Address
              </label>
              <input
                type="tel"
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                placeholder="123 Main St, Apt 4B, City, State, Country"
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-700 transition duration-300"
        >
          {isLogin ? "Login" : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={toggleForm} className="ml-1 text-black font-bold hover:underline">
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  )
}

