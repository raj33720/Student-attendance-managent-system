import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { path } from '../../path';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../header/Header';

const axios = require('axios');

const btechDept = [
    ['CSE', 'Computer Science & Engineering'],
    ['ECE', 'Electronics & Communication Engineering'],
    ['EEE', 'Electrical & Electronics Engineering'],
    ['ME', 'Mechanical Engineering'],
    ['CE', 'Civil Engineering']
];

const mtechDept = [
    ['CSE', 'Computer Science & Engineering'],
    ['ECE', 'Electronics & Communication Engineering']
];

const SignupStudent = () => {
    const [name, setname] = useState('');
    const [roll, setroll] = useState('');
    const [email, setemail] = useState('');
    const [contact, setcontact] = useState('');
    const [course, setcourse] = useState('');
    const [dept, setdept] = useState('');
    const [sem, setsem] = useState('');
    const [year, setyear] = useState('');
    const [pwd, setpwd] = useState('');
    const [cpwd, setcpwd] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!(name && roll && course && dept && sem && year && email && contact && pwd && cpwd)) {
            toast.warn('Please fill all the details carefully!!');
            return;
        }

        if (pwd !== cpwd) {
            toast.warn('Password and confirm password do not match.');
            return;
        }

        axios.post(`${path}/registerStudent`, {
            roll: roll,
            name: name,
            email: email,
            contact: contact,
            course: course,
            year: year,
            branch: dept,
            semester: sem,
            password: pwd
        })
            .then(function (response) {
                if (response.status === 203) {
                    toast.error(response.data.msg);
                    return;
                }

                toast.success(response.data.msg);
                setTimeout(() => navigate('/'), 1000);
            })
            .catch(function (error) {
                const msg = error?.response?.data?.msg || 'Registration failed. Please try again.';
                toast.error(msg);
                console.log(error);
            });
    };

    const availableDepartments = course === 'mtech' ? mtechDept : btechDept;

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

            <div className="relative min-h-screen px-4 py-10">
                <div className="mx-auto w-full max-w-5xl glass-panel p-6 md:p-10 relative z-10">
                    <p className="uppercase tracking-[0.2em] text-xs text-blue-200 font-semibold">Student Registration</p>
                    <h3 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">Create Your Account</h3>
                    <p className="subtle-text mt-3 text-slate-600">Fill in your academic and contact details to get started.</p>

                    <form className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                        <input value={roll} onChange={(e) => setroll(e.target.value)} placeholder="Roll Number" className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/80 transition-all" />
                        <input value={name} onChange={(e) => setname(e.target.value)} placeholder="Full Name" className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/80 transition-all" />
                        <input value={email} onChange={(e) => setemail(e.target.value)} type="email" placeholder="Email Address" className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/80 transition-all" />
                        <input value={contact} onChange={(e) => setcontact(e.target.value)} placeholder="Contact Number" className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/80 transition-all" />

                        <select value={course} onChange={(e) => { setcourse(e.target.value); setdept(''); }} className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/80 transition-all">
                            <option value="">Select Course</option>
                            <option value="btech">B-tech</option>
                            <option value="mtech">M-tech</option>
                        </select>

                        <select value={dept} onChange={(e) => setdept(e.target.value)} className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/80 transition-all">
                            <option value="">Select Department</option>
                            {availableDepartments.map((department) => (
                                <option key={department[0]} value={department[0]}>{department[1]}</option>
                            ))}
                        </select>

                        <select value={year} onChange={(e) => setyear(e.target.value)} className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/80 transition-all">
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>

                        <select value={sem} onChange={(e) => setsem(e.target.value)} className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/80 transition-all">
                            <option value="">Select Semester</option>
                            <option value="1">1st Sem</option>
                            <option value="2">2nd Sem</option>
                            <option value="3">3rd Sem</option>
                            <option value="4">4th Sem</option>
                            <option value="5">5th Sem</option>
                            <option value="6">6th Sem</option>
                            <option value="7">7th Sem</option>
                            <option value="8">8th Sem</option>
                        </select>

                        <input value={pwd} onChange={(e) => setpwd(e.target.value)} type="password" placeholder="Password" className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/80 transition-all" />
                        <input value={cpwd} onChange={(e) => setcpwd(e.target.value)} type="password" placeholder="Confirm Password" className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/80 transition-all" />

                        <div className="md:col-span-2 mt-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                            <button className="primary-btn px-8 py-3 font-semibold text-lg" type="submit">
                                Register Account
                            </button>
                            <p className="text-gray-700">
                                Already have an account?{' '}
                                <Link to="/" className="text-emerald-600 font-bold hover:underline">
                                    Login now
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupStudent;
