import React, { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../header/Header';
import { path } from '../../path';

const axios = require('axios');

const Login = () => {
    const [value, setValue] = useState('1');
    const [roll, setRoll] = useState('');
    const [email, setEmail] = useState('');
    const [studentPwd, setStudentPwd] = useState('');
    const [teacherPwd, setTeacherPwd] = useState('');

    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleStudentLogin = (e) => {
        e.preventDefault();

        if (roll.length && studentPwd.length) {
            axios
                .post(`${path}/loginStudent`, {
                    roll: roll,
                    password: studentPwd,
                })
                .then((response) => {
                    if (response.status === 203) {
                        toast.error(response.data.msg);
                    } else {
                        toast.success(response.data.msg);
                        localStorage.setItem('token', response.data.data);
                        localStorage.setItem('type', 'student');
                        setTimeout(() => navigate('/student'), 900);
                    }
                })
                .catch((error) => {
                    const msg =
                        error?.response?.data?.msg ||
                        'Login failed. Please try again.';
                    toast.error(msg);
                    console.log(error);
                });
        } else {
            toast.warn('Please fill all the details carefully!!');
        }
    };

    const handleTeacherLogin = (e) => {
        e.preventDefault();

        if (email.length && teacherPwd.length) {
            axios
                .post(`${path}/loginTeacher`, {
                    email: email,
                    password: teacherPwd,
                })
                .then((response) => {
                    if (response.status === 203) {
                        toast.error(response.data.msg);
                    } else {
                        toast.success(response.data.msg);
                        localStorage.setItem('token', response.data.data);
                        localStorage.setItem('type', 'teacher');
                        setTimeout(() => navigate('/teacher'), 900);
                    }
                })
                .catch((error) => {
                    const msg =
                        error?.response?.data?.msg ||
                        'Login failed. Please try again.';
                    toast.error(msg);
                    console.log(error);
                });
        } else {
            toast.warn('Please fill all the details carefully!!');
        }
    };

    return (
        <div>
            <Header />

            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} pauseOnHover />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
                    <div className="text-center mb-6">
                        <p className="uppercase tracking-[0.2em] text-xs text-gray-500 font-semibold">Welcome Back</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">Sign In</h2>
                        <p className="text-sm text-gray-600 mt-2">Access your dashboard to track attendance.</p>
                    </div>

                    <TabContext value={value}>
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: 'transparent',
                                marginBottom: 2,
                                '& .MuiTabs-indicator': { backgroundColor: '#10b981' },
                                '& .MuiTab-root': {
                                    color: 'rgba(0,0,0,0.6)',
                                    '&.Mui-selected': { color: '#000' },
                                },
                            }}
                        >
                            <TabList onChange={handleChange} centered>
                                <Tab label="Student" value="1" />
                                <Tab label="Teacher" value="2" />
                            </TabList>
                        </Box>

                        <TabPanel value="1">
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Roll Number"
                                    value={roll}
                                    onChange={(e) => setRoll(e.target.value)}
                                    className="w-full rounded-md px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={studentPwd}
                                    onChange={(e) => setStudentPwd(e.target.value)}
                                    className="w-full rounded-md px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                                />

                                <button className="w-full bg-emerald-500 text-white py-3 rounded-md font-semibold" onClick={handleStudentLogin}>
                                    <LockIcon fontSize="small" /> Sign in
                                </button>

                                <p className="text-center text-gray-600">
                                    Don&apos;t have an account?{' '}
                                    <Link component={RouterLink} to="/registerStudent" sx={{ color: '#059669', fontWeight: 'bold' }}>
                                        Register Now
                                    </Link>
                                </p>
                            </form>
                        </TabPanel>

                        <TabPanel value="2">
                            <form className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-md px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={teacherPwd}
                                    onChange={(e) => setTeacherPwd(e.target.value)}
                                    className="w-full rounded-md px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                                />

                                <button className="w-full bg-emerald-500 text-white py-3 rounded-md font-semibold" onClick={handleTeacherLogin}>
                                    <LockIcon fontSize="small" /> Sign in
                                </button>

                                <p className="text-center text-gray-600">
                                    Don&apos;t have an account?{' '}
                                    <Link component={RouterLink} to="/registerTeacher">
                                        Register Now
                                    </Link>
                                </p>
                            </form>
                        </TabPanel>
                    </TabContext>

                    <div className="mt-4 text-center text-sm">
                        <Link component={RouterLink} to="/adminLogin" className="text-emerald-600 font-semibold hover:underline">
                            Sign in as Admin
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;   
