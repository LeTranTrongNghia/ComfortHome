'use client'

import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { CalendarIcon, X, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import LeftSidebar from './LeftSidebar'
import Header from './Header'

export default function EditOrderPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [userData, setUserData] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:5050/orders/${id}`)
                const orderData = response.data
                setOrder(orderData)
                fetchUserData(orderData.userId); // Fetch user data based on userId
            } catch (error) {
                console.error('Error fetching order:', error)
                navigate('/admin')
            }
        }

        const fetchUserData = async (userId) => {
            if (!userId) return; // Check if userId is valid
            try {
                const response = await axios.get('http://localhost:5050/users')
                const users = response.data;
                const user = users.find(u => u._id === userId); // Find user by ID
                console.log('Fetched Users:', users);
                console.log('User ID:', userId);
                console.log('Found User:', user);
                setUserData(user); // Set user data
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        }

        fetchOrder()
    }, [id, navigate])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Assuming you want to save changes to the order
            await axios.patch(`http://localhost:5050/orders/${id}`, order)
            toast.success('Changes saved successfully!');
            navigate('/admin/orders')
        } catch (error) {
            console.error('Error updating order:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (!order) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex mt-6">
            <LeftSidebar activeView="edit" setActiveView={() => { }} navigate={navigate} />
            <div className="flex-1 pl-64">
                <Header />
                <Card className="max-w-[90%] mx-2 my-8 border-none bg-background">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex flex-col">
                                <Button className="w-[160px] mb-8" onClick={() => window.location.href = '/admin/orders'}>
                                    <ArrowLeft />Back to Admin
                                </Button>
                                Edit Order
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="orderId">Order ID</Label>
                            <Textarea
                                id="orderId"
                                value={order._id}
                                readOnly
                                className="min-h-[40px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="userId">User Information</Label>
                            {/* <Textarea
                                id="userId"
                                value={order.userId}
                                readOnly
                                className="min-h-[40px]"
                            /> */}
                            {userData && (
                                <div className="space-y-2">
                                    <div className="flex flex-col">
                                        <span><strong>Name:</strong> {userData.fullName}</span>
                                        <span><strong>Email:</strong> {userData.email}</span>
                                        <span><strong>Phone:</strong> {userData.phoneNumber}</span>
                                        <span><strong>Phone:</strong> {userData.deliveryAddress}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <RadioGroup value={order.status} onValueChange={(value) => setOrder({ ...order, status: value })} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Pending" id="pending" />
                                    <Label htmlFor="pending">Pending</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Ongoing" id="ongoing" />
                                    <Label htmlFor="ongoing">Ongoing</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Done" id="done" />
                                    <Label htmlFor="done">Done</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Cancel" id="cancel" />
                                    <Label htmlFor="cancel">Cancel</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="totalPrice">Total Price</Label>
                            <Textarea
                                id="totalPrice"
                                value={order.totalPrice}
                                readOnly
                                className="min-h-[40px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Payment Method</Label>
                            <Textarea
                                id="paymentMethod"
                                value={order.paymentMethod}
                                readOnly
                                className="min-h-[40px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="createdAt">Creation Date</Label>
                            <Textarea
                                id="createdAt"
                                value={format(new Date(order.createdAt), "PPP", { locale: vi })}
                                readOnly
                                className="min-h-[40px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Items</Label>
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <Label>Product ID:</Label>
                                    <span>{item.productId}</span>
                                    <Label>Quantity:</Label>
                                    <span>{item.quantity}</span>
                                    <Label>Price:</Label>
                                    <span>{item.price}$</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <ToastContainer />
                            <Button
                                className="mb-8"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <div style={{ height: '100px' }} />
            </div>
        </div>
    )
}

