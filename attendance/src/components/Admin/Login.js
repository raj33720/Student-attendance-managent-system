import React, { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import { Link, useNavigate } from 'react-router-dom';
import { path } from '../../path';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../header/Header';

const axios = require('axios');

const AdminLogin = () => {
    const [userName, setuserName] = useState('');
    const [pwd, setPwd] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (!(userName.length && pwd.length)) {
            toast.warn('Please fill all the details carefully!!');
            return;
        }

        axios.post(`${path}/loginAdmin`, {
            username: userName,
            password: pwd
        })
            .then(function (response) {
                if (response.status === 203) {
                    toast.error(response.data.msg);
                    return;
                }

                toast.success(response.data.msg);
                localStorage.setItem('token', response.data.data);
                localStorage.setItem('type', 'admin');
                setTimeout(() => navigate('/admin'), 900);
            })
            .catch(function (error) {
                const msg = error?.response?.data?.msg || 'Login failed. Please try again.';
                toast.error(msg);
                console.log(error);
            });
    };

    return (
        <div>
            <Header />
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="px-[5%] py-14">
                <div className="mx-auto w-full max-w-lg glass-panel p-8 md:p-10">
                    <p className="accent-badge">Admin Portal</p>
                    <h2 className="mt-4 text-3xl font-semibold text-slate-900">Secure Sign In</h2>
                    <p className="subtle-text mt-2">
                        Log in with admin credentials to manage complete attendance records.
                    </p>

                    <form className="mt-8 space-y-4" onSubmit={handleLogin} autoComplete="off">
                        <input
                            name="username"
                            type="text"
                            value={userName}
                            onChange={(e) => setuserName(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white/90 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                            placeholder="Admin Username"
                        />
                        <input
                            name="password"
                            type="password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-white/90 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                            placeholder="Password"
                        />
                        <button type="submit" className="w-full primary-btn">
                            <LockIcon fontSize="small" /> Sign in
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-slate-600">
                        Not an admin? <Link to="/" className="text-cyan-700 font-medium hover:underline">Back to main login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
