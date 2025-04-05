import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LeftSidebar from './LeftSidebar';
import Header from './Header';

const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: '',
        category: '',
        sub_category: '',
        price: 0,
        stock: 0,
        status: 'In Stock',
        description: '',
        images: [],
        colors: [],
        dimensions: { width: 0, depth: 0, height: 0 },
        material: '',
        tags: [],
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5050/products');
                if (id) {
                    const foundProduct = response.data.find(product => product._id === id);
                    if (foundProduct) {
                        setProduct(foundProduct);
                        setIsEditing(true);
                    } else {
                        toast.error('Product not found');
                    }
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error fetching products');
            }
        };
        fetchProducts();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await axios.patch(`http://localhost:5050/products/${id}`, product);
                toast.success('Product updated successfully!');
            } else {
                await axios.post('http://localhost:5050/products', product);
                toast.success('Product added successfully!');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Error saving product');
        }
    };

    return (
        <div className="max-h-screen bg-background">
            <LeftSidebar navigate={navigate} />
            <div className="pl-64">
                <Header />
                <main className="px-6 mt-24">
                    <Card className="max-w-[90%] mx-auto my-8 border-none bg-background shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ToastContainer />
                            <div className="flex flex-col">
                                <label className="font-medium">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium">Category:</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={product.category}
                                    onChange={handleChange}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium">Sub Category:</label>
                                <input
                                    type="text"
                                    name="sub_category"
                                    value={product.sub_category}
                                    onChange={handleChange}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium">Price:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium">Stock:</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={product.stock}
                                    onChange={handleChange}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium">Status:</label>
                                <select
                                    name="status"
                                    value={product.status}
                                    onChange={handleChange}
                                    className="border rounded p-2"
                                >
                                    <option value="In Stock">In Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium">Description:</label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium">Images (comma-separated URLs):</label>
                                <input
                                    type="text"
                                    name="images"
                                    value={product.images.join(', ')}
                                    onChange={(e) => handleChange({ target: { name: 'images', value: e.target.value.split(', ') } })}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium">Colors (JSON format):</label>
                                <textarea
                                    name="colors"
                                    value={JSON.stringify(product.colors, null, 2)}
                                    onChange={(e) => handleChange({ target: { name: 'colors', value: JSON.parse(e.target.value) } })}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium">Dimensions (JSON format):</label>
                                <textarea
                                    name="dimensions"
                                    value={JSON.stringify(product.dimensions, null, 2)}
                                    onChange={(e) => handleChange({ target: { name: 'dimensions', value: JSON.parse(e.target.value) } })}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium">Material:</label>
                                <input
                                    type="text"
                                    name="material"
                                    value={product.material}
                                    onChange={handleChange}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium">Tags (comma-separated):</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={product.tags.join(', ')}
                                    onChange={(e) => handleChange({ target: { name: 'tags', value: e.target.value.split(', ') } })}
                                    className="border rounded p-2"
                                />
                            </div>
                            <Button onClick={handleSave} className="mt-4 bg-black text-white hover:bg-gray-700">
                                {isEditing ? 'Update Product' : 'Add Product'}
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default EditProductPage; 