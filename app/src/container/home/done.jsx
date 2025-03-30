import React from "react"
import { Check } from "lucide-react"
import { useLocation } from 'react-router-dom'

export default function DoneOrder() {
    const location = useLocation()
    const { orderId, createdAt, totalItems, totalPrice } = location.state || {}

    // Format the date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-6 py-12">
                <div className="max-w-md w-full mx-auto text-center">
                    {/* Success Icon */}
                    <div className="relative mx-auto mb-6">
                        <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                            <Check className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-2xl font-bold mb-2">
                        Order Completed!
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Thank you for your order. We appreciate your business!
                    </p>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                        <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium">
                                    {formatDate(createdAt)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Items:</span>
                                <span className="font-medium">{totalItems}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-medium">${parseFloat(totalPrice).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 bg-white border border-gray-300 rounded-full px-6 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <span>Back to home</span>
                    </a>
                </div>
            </main>
        </div>
    )
}
