import React from 'react';
import LoginForm from './login-form';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <LoginForm />
            <Footer />
        </div>
    );
}

export default LoginPage;
