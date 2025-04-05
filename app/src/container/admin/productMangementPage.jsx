import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from './components/LeftSidebar';
import Header from './components/Header';

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5050/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error fetching products');
        } finally {
            setIsLoading(false);
        }
    };

    // Delete product
    const handleDelete = async (id) => {
        console.log("Deleting product with ID:", id);
        try {
            await axios.delete(`http://localhost:5050/products/${id}`);
            setProducts(products.filter(product => product._id !== id));
            toast.success('Product deleted successfully!');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Error deleting product');
        }
    };

    // Navigate to edit page
    const handleEdit = (id) => {
        navigate(`/admin/products/edit/${id}`);
    };

    // Navigate to add new product page
    const handleAdd = () => {
        navigate('/admin/products/add');
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-h-screen bg-background">
            <LeftSidebar navigate={navigate} />
            <div className="pl-64">
                <Header />
                <main className="px-6 mt-24">
                    <div className="p-6">
                        <ToastContainer />
                        <h1 className="text-2xl font-bold mb-4">Product Management</h1>
                        <Button onClick={handleAdd} className="mb-4">Add New Product</Button>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map(product => (
                                    <TableRow key={product._id}>
                                        <TableCell>{product._id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.status}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleEdit(product._id)}>Edit</Button>
                                            <Button onClick={() => handleDelete(product._id)} className="ml-2">Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProductManagementPage;