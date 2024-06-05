'use client'


import { useState, useEffect, useContext } from 'react';
import { CgProfile } from "react-icons/cg";
import { MdLockOutline } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuFileSpreadsheet } from "react-icons/lu";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';

const ADForm = ({ method, userdetails, setSelectedRole, session, setSelectedAD, users, setUsers }) => {
    const router = useRouter();

    const [info, setInfo] = useState({
        username: userdetails.username,
        email: userdetails.email,
        password: '',
        role: userdetails.role,
        teamleadername: userdetails.teamleadername,
        spreadsheet: userdetails.spreadsheet,
        level: userdetails.level,
        preference: userdetails.preference,
        companiesCompleted: userdetails.companiesCompleted,
        companiesRejected: userdetails.companiesRejected,
        companiesWorking: userdetails.companiesWorking,
        companiesAccepted: userdetails.companiesAccepted,
        companiesCompletedName: userdetails.companiesCompletedName,
        companiesRejectedName: userdetails.companiesRejectedName,
        companiesWorkingName: userdetails.companiesWorkingName,
        companiesAcceptedName: userdetails.companiesAcceptedName,
        deployedlink: userdetails.deployedlink,
        revenueapi: userdetails.revenueapi,
        reminders: userdetails.reminders || 0,

    });

    const [newpassword, setNewPassword] = useState("");
    const [changePassword, setChangePassword] = useState(false);
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const handleInput = (e) => {
        setInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            role: "ad",
            level: "junior",
        }));
        setError("");
    }

    useEffect(() => {
        setError("");

        if (changePassword) {
            setInfo((prev) => ({
                ...prev,
                password: newpassword
            }));
            setError("");
        }
    }, [newpassword, changePassword]);

    const checkErrors = () => {
        const { username, email, password, deployedlink } = info;
        // console.log("changePassword:", changePassword);

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email");
            return;
        }

        if (changePassword) {
            setInfo((prev) => ({
                ...prev,
                password: newpassword
            }))
            setError("");
        }
        // console.log("info:", info);
        // console.log("newpassword:", newpassword);


        //method is post i.e. registering new admin
        if (method !== "put") {
            // console.log("info:", info);
            if (!username || !email || !password || !deployedlink) {
                setError("Must provide all credentials");
            }
        }
        //method is put i.e. editing details of existing admin
        else {
            //edit with password
            if (changePassword) {
                // console.log("new password:", newpassword);
                setInfo((prev) => ({
                    ...prev,
                    password: newpassword
                }))
                setError("");
                // console.log("password:", password);
                if (!username || !email || !password || !deployedlink) {
                    setError("Must provide all credentials");
                }
            }
            //edit without password
            else {
                // console.log("info:", info);
                if (!username || !email || !deployedlink) {
                    setError("Must provide all credentials");
                }
            }
        }
    }

    async function handleSubmit(e) {
        // console.log("error:", error);
        e.preventDefault();

        const { username, email, password, deployedlink } = info;
        // console.log("info:", info);

        //method is post 
        if (method !== "put") {
            //check all fields
            if (!username || !email || !password || !deployedlink) {
                setError("Must provide all credentials");
            }
            else {
                //all credentials , then post 
                try {
                    setPending(true);

                    const url = "/api/register";
                    const res = await axios({
                        method: "POST",
                        url,
                        data: info,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    // console.log("res:", res);

                    if (res.status === 201 || res.status === 200) {
                        // console.log("res:", res);

                        const data = res.data;
                        // console.log("data:", data);

                        setUsers(data.allusers);
                        // console.log("users.len in adform:", users?.length);

                        //set userdetails to default values
                        setInfo({
                            username: "",
                            password: "",
                            email: "",
                            role: "",
                            level: "",
                            teamleadername: "",
                            companiesCompleted: [],
                            companiesRejected: [],
                            companiesWorking: [],
                            companiesAccepted: [],
                            companiesCompletedName: [],
                            companiesRejectedName: [],
                            companiesWorkingName: [],
                            companiesAcceptedName: [],
                            spreadsheet: "",
                            deployedlink: "",
                            revenueapi: "",
                            preference: "",
                            reminders: 0,
                        });

                        // console.log("userdetails after submission:", userdetails);
                        toast.success('AD added successfully', {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        setPending(false);
                        router.refresh("/edit")
                        // console.log("User registered successfully");
                    }
                    else {
                        const errorData = res.data;
                        setError(errorData.message);
                        setPending(false);
                    }
                }
                catch (err) {
                    setError(err.message);
                    setPending(false);
                }
            }
        }
        //method is put
        else {
            //check if user wants to change the password 
            if (changePassword) {

                setInfo((prev) => ({
                    ...prev,
                    password: newpassword
                }));
                setError("");

                //check all fields
                if (!username || !email || !password || !deployedlink) {
                    setError("Must provide all credentials");
                }
                else {
                    try {
                        setPending(true);

                        const url = "/api/register";
                        const res = await axios({
                            method: "PUT",
                            url,
                            data: info,
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        // console.log("res:", res);
                        if (res.status === 200 || res.status === 201) {
                            const data = res.data;
                            // console.log("data:", data);

                            setUsers(data.allusers);
                            // console.log("users.len in adform:", users?.length);

                            // /set userdetails to default values
                            setInfo({
                                username: "",
                                password: "",
                                email: "",
                                role: "",
                                level: "",
                                teamleadername: "",
                                companiesCompleted: [],
                                companiesRejected: [],
                                companiesWorking: [],
                                companiesAccepted: [],
                                companiesCompletedName: [],
                                companiesRejectedName: [],
                                companiesWorkingName: [],
                                companiesAcceptedName: [],
                                spreadsheet: "",
                                deployedlink: "",
                                revenueapi: "",
                                preference: "",
                                reminders: 0,

                            });

                            toast.success('AD updated successfully', {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                            setSelectedAD("");
                            setPending(false);
                            router.refresh("/edit")

                            // console.log("Teamleader updated successfully");
                        }
                        else {
                            const errorData = res.data;
                            setError(errorData.message);
                            setPending(false);
                        }
                    }
                    catch (err) {
                        setError(err.message);
                        setPending(false);
                    }
                }
            }

            else {
                //check everything except password
                // console.log("password:", password);
                if (!username || !email || !deployedlink) {
                    setError("Must provide all credentials");
                }
                else {
                    try {
                        setPending(true);

                        const url = "/api/register";
                        const res = await axios({
                            method: "PUT",
                            url,
                            data: info,
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        // console.log("res:", res);

                        if (res.status === 200 || res.status === 201) {
                            const data = res.data;
                            // console.log("data:", data);

                            setUsers(data.allusers);
                            // console.log("users.len in adform:", users?.length);

                            // /set userdetails to default values
                            setInfo({
                                username: "",
                                password: "",
                                email: "",
                                role: "",
                                level: "",
                                teamleadername: "",
                                companiesCompleted: [],
                                companiesRejected: [],
                                companiesWorking: [],
                                companiesAccepted: [],
                                companiesCompletedName: [],
                                companiesRejectedName: [],
                                companiesWorkingName: [],
                                companiesAcceptedName: [],
                                spreadsheet: "",
                                deployedlink: "",
                                revenueapi: "",
                                preference: "",
                                reminders: 0,

                            });

                            toast.success('AD updated successfully', {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                            setSelectedAD("");
                            setPending(false);
                            router.refresh("/edit")
                            // const form = e.target;
                            // form.reset();
                            // console.log("Teamleader updated successfully");
                        }
                        else {
                            const errorData = res.data;
                            setError(errorData.message);
                            setPending(false);
                        }
                    }
                    catch (err) {
                        setError(err.message);
                        setPending(false);
                    }
                }
            }
        }
    }

    const handleDeleteUser = async (e) => {
        e.preventDefault();

        try {
            setPending(true);
            const username = info.username;
            // console.log("username to delete:", username);

            const url = `/api/register/${username}`
            const res = await axios({
                method: "DELETE",
                url,
            })
            // console.log("res:", res);

            if (res.status === 201 || res.status === 200) {
                const data = res.data;
                // console.log("data:", data);

                setUsers(data.allusers);
                // console.log("users.len in adform:", users?.length);

                //set userdetails to default values
                setInfo({
                    username: "",
                    password: "",
                    email: "",
                    role: "",
                    level: "",
                    teamleadername: "",
                    companiesCompleted: [],
                    companiesRejected: [],
                    companiesWorking: [],
                    companiesAccepted: [],
                    companiesCompletedName: [],
                    companiesRejectedName: [],
                    companiesWorkingName: [],
                    companiesAcceptedName: [],
                    spreadsheet: "",
                    deployedlink: "",
                    revenueapi: "",
                    preference: "",
                    reminders: 0,

                });

                toast.success('AD deleted successfully', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                // console.log("user deleted successfully");
                setSelectedAD("");
                setSelectedRole("");
                setPending(false);
                router.refresh("/edit")


            }
            else {
                const errorData = res.data;
                setError(errorData.message);
                setPending(false);
            }
        }
        catch (err) {
            // console.log("Error while deleting BD in page.jsx:", err);
            setError("Error deleting bd");
            setPending(false);
        }
    }

    const handleToastClose = () => {
        // Execute the next line of code here
        setSelectedRole("");
    }

    const checkSameUser = () => {
        if (session?.user?.username === userdetails?.username) {
            setError("Other admins can delete your accounts.\nYou cannot delete your account while you are logged in")
        }
    }

    return (
        <div className="ADFORM h-auto w-full overflow-hidden flex justify-center items-center lg:text-[12px] mt-8">

            <div className="w-[500px] m-auto p-12 border-gray-400 border-[1px] rounded-lg flex flex-col justify-center items-center bg-white gap-4 sm:w-full sm:p-4 sm:m-0 sm:gap-0 ">

                <h1 className="text-4xl font-bold lg:text-3xl text-lightpurple">{method === "put" ? "Update AD" : "Add AD"}</h1>
                <p className="text-gray-600 text-lg sm:text-xs">{method === "put" ? "Note: Username cannot be edited" : "Enter details below"}</p>

                <form className="w-full flex flex-col justify-center items-center gap-4 sm:my-4 sm:gap-2" onSubmit={handleSubmit}>

                    <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0">
                        {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Username:</h1> : <CgProfile className="size-8 lg:size-6" color='purple' />}
                        <input
                            type="text" name="username" placeholder="Username" className="p-2  pl-4  rounded-xl w-full sm:py-1 border-none outline-none text-black" onChange={(e) => handleInput(e)}
                            value={info.username}
                            disabled={method === "put"}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>

                    <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0">
                        {method == "put" ? <h1 className="lg:text-[10px] text-gray-700">Email:</h1> : <MdOutlineMailOutline className="size-8 lg:size-6" color='purple' />}
                        <input
                            type="email" name="email" placeholder="example@gmail.com"
                            className="p-2  pl-4  rounded-xl w-full sm:py-1 border-none outline-none text-black" onChange={(e) => handleInput(e)}
                            value={info.email}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>

                    {(method === "post" || method !== "put") &&
                        <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
                            <MdLockOutline className="size-8 lg:size-6" color='purple' />
                            <input
                                type="text"
                                name="password"
                                placeholder="Password"
                                className="p-2 pl-4 rounded w-full sm:py-1 border-none outline-none text-black "
                                onChange={handleInput}
                                value={info.password}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </div>
                    }

                    {(method === "put" && changePassword) &&
                        <div className="w-full flex flex-col items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0 ">
                            <div className="flex items-center">
                                <h1 className="lg:text-[10px] text-gray-700">Password:</h1>
                                <input
                                    type="text"
                                    name="password"
                                    placeholder="Password"
                                    className="p-2 pl-4 rounded w-full sm:py-1  text-black border-none outline-none"
                                    onChange={(e) => setNewPassword(e.target.value)} value={newpassword}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setChangePassword(!changePassword)} className="bg-darkpurple rounded px-2 py-1 text-sm text-white">No</button>
                            </div>
                        </div>
                    }


                    {!changePassword && method === "put" &&
                        <div className="w-full flex justify-between items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0">
                            <div className="rounded text-purple">Change Password?</div>
                            <button onClick={() => setChangePassword(!changePassword)} className="bg-darkpurple rounded-xl px-2 py-1 text-sm text-white">Yes</button>
                        </div>
                    }


                    <div className="w-full flex items-center gap-4 border-2 border-gray-400 py-2 px-4 rounded-2xl shadow-lg lg:py-1 lg:gap-0">
                        <LuFileSpreadsheet className="size-8 lg:size-6" color='purple' />
                        <input type="text" name="deployedlink" placeholder="deployedlink" className="p-2  pl-4 rounded-xl w-full sm:py-1 border-none outline-none text-black"
                            onChange={(e) => handleInput(e)}
                            value={info.deployedlink}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>

                    {error && <span className="text-red-500 font-medium">{error}</span>}

                    {method === "put" ?
                        <div className="flex justify-center items-center gap-4">

                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <div onClick={checkErrors}
                                        className="w-auto rounded-xl py-4 px-8 text-2xl lg:text-xl text-white bg-purple hover:bg-lightpurple lg:py-2 lg:px-4 mt-2" disabled={pending ? true : false}>
                                        Update
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="flex flex-col">
                                            {error && <span className="text-red-500 font-semibold">{error}</span>}

                                            This action cannot be undone. This will permanently update the user details.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                                        <AlertDialogAction type="submit" onClick={handleSubmit} disabled={(error !== "") || !info.username}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>



                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <div onClick={checkSameUser}
                                        className="w-auto rounded-xl py-4 px-8 text-2xl lg:text-xl text-white bg-purple hover:bg-lightpurple lg:py-2 lg:px-4 mt-2" disabled={pending ? true : false}>
                                        Delete
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="flex flex-col">
                                            {error && <span className="text-red-500 font-semibold">{error}</span>}

                                            This action cannot be undone. This will permanently delete the user and user details.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteUser} disabled={(error !== "") || !info.username}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        :

                        //method is post
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <div onClick={checkErrors}
                                    className="w-auto rounded-xl py-4 px-8 text-2xl lg:text-xl text-white bg-purple hover:bg-lightpurple lg:py-2 lg:px-4 mt-2" disabled={pending ? true : false}>
                                    Add
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="flex flex-col">
                                        {error && <span className="text-red-500 font-semibold">{error}</span>}

                                        This action cannot be undone. This will permanently add a new user.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter onClick={() => setError("")}>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction type="submit" onClick={handleSubmit} disabled={(error !== "") || !info.username}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    }

                    <ToastContainer onClose={handleToastClose} />
                </form>
            </div>
        </div>
    )
}
export default ADForm