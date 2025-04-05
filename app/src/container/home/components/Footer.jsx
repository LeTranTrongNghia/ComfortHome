import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full border-t py-6 md:py-0">
            <div className="container flex flex-col md:flex-row justify-between gap-4 md:gap-8 px-4 md:px-6">
                <div className="flex flex-col gap-2 md:py-8">
                    <a href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold">ComfortHome</span>
                    </a>
                    <p className="text-sm text-gray-500">
                        Quality furniture for every home, designed with comfort and style in mind.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12 md:py-8">
                    <div className="space-y-2">
                        <h4 className="font-medium">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Living Room
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Bedroom
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Dining
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Office
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Press
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Shipping
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Returns
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Terms
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900">
                                    Cookies
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4 border-t py-4 md:py-6 px-4 md:px-6">
                <p className="text-xs text-gray-500">© 2024 ComfortHome. All rights reserved.</p>
                <div className="flex gap-4">
                    <a href="#" className="text-gray-500 hover:text-gray-900">
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
                            className="h-5 w-5"
                        >
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                        <span className="sr-only">Facebook</span>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900">
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
                            className="h-5 w-5"
                        >
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                        <span className="sr-only">Instagram</span>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900">
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
                            className="h-5 w-5"
                        >
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                        <span className="sr-only">Twitter</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
export default Footer;