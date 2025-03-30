import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import { useParams } from "react-router-dom"

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedColor, setSelectedColor] = useState("0")
  const [selectedSize, setSelectedSize] = useState("medium")
  const [currentImage, setCurrentImage] = useState(0)

  const fetchProduct = async () => {
    const response = await fetch(`http://localhost:5050/products`)
    const data = await response.json()
    
    const foundProduct = data.find((item) => item._id === id)
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      console.error("Product not found")
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  if (!product) return <div>Loading...</div>

  const images = [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ]

  const colors = [
    { id: "natural", name: "Natural", value: "bg-amber-100" },
    { id: "walnut", name: "Walnut", value: "bg-amber-800" },
    { id: "ebony", name: "Ebony", value: "bg-gray-900" },
  ]

  const sizes = [
    { id: "small", name: "Small" },
    { id: "medium", name: "Medium" },
    { id: "large", name: "Large" },
    { id: "xl", name: "XL" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header/>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-2">
        <div className="text-sm text-gray-500">
          <span className="hover:underline cursor-pointer">Furniture</span> &gt;{" "}
          <span className="hover:underline cursor-pointer">{product.category}</span> &gt;{" "}
          <span className="hover:underline cursor-pointer">{product.sub_category}</span>
        </div>
      </div>

      {/* Product Detail */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[currentImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-auto object-cover aspect-square"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`flex-shrink-0 border-2 rounded-md overflow-hidden ${currentImage === index ? "border-gray-800" : "border-gray-200"}`}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs">
                  FC
                </div>
                <span className="text-gray-500 text-sm">{product._id}</span>
              </div>
              <h1 className="text-2xl font-bold mt-2">{product.name}</h1>
            </div>

            <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-10 h-10 rounded-md`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800">
                Add to cart
              </button>
            </div>

            <div className="flex items-center text-sm text-gray-600 border-t border-gray-200 pt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              Free delivery on orders over $299
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Product Description</h2>
          <p className="text-gray-600">{product.description}</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-medium mb-2">Materials</h3>
              <p className="text-sm text-gray-600">{product.material}</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-medium mb-2">Dimensions</h3>
              <p className="text-sm text-gray-600">W: {product.dimensions.width}cm × D: {product.dimensions.depth}cm × H: {product.dimensions.height}cm</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="font-medium mb-2">Assembly</h3>
              <p className="text-sm text-gray-600">Minimal assembly required, tools included</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

