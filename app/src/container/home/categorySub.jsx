import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function CategorySubPage() {
  const { id } = useParams()
  const [subCategories, setSubCategories] = useState([])
  const [categoryName, setCategoryName] = useState("")

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await fetch(`http://localhost:5050/categories`)
      const data = await response.json()

      const foundCategory = data.find((category) => category._id === id)
      if (foundCategory) {
        setSubCategories(foundCategory.sub_categories)
        setCategoryName(foundCategory.name)
      } else {
        console.error("Category not found")
      }
    }

    fetchCategory()
  }, [id])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{categoryName} Subcategories</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
                Explore the subcategories of this category.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {subCategories.map((subCategory, index) => (
              <Link key={index} to={`/product?category=${categoryName}&subCategory=${subCategory}`} className="group relative overflow-hidden rounded-lg h-60">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{subCategory}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}


