"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PieChart from '@/components/PieComponent/PieComponent';
import FranchiseRevenue from '@/components/FranchiseRevenue/FranchiseRevenue';
import { IoMdClose } from "react-icons/io";
import { MdDone } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import { useSession } from 'next-auth/react';
import axios from 'axios';

const DashboardFRPage = () => {

    const router = useRouter();
    const { data: session, status } = useSession();
    const [data, setData] = useState([]);
    const [mycompanies, setMycompanies] = useState([]);
    const [myData, setMyData] = useState({});
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");
    const isMobile = useMediaQuery({ maxWidth: 768 });


    useEffect(() => {
        if (status !== "loading" && !session) {
            router.push("/login")
        }
        else {
            setLoading(false);
        }
    }, [session, status, router]);

    const getCompanies = async () => {
        try {
            // setLoading(true);

            const url = `${process.env.NEXTAUTH_URL}/api/company`
            const res = await axios({
                method: "GET",
                url
            })

            // console.log("res:", res);
            if (res.status === 201 || res.status === 200) {
                const companies = res.data;
                // console.log("all companies:", companies);

                const myassignedcompanies = companies.filter((company) => company.franchisename === session?.user?.username && company.status === "in progress");

                // console.log("myassignedcompanies:", myassignedcompanies);

                setData(myassignedcompanies);

                const myacceptedcompanies = companies.filter((company) => company.franchisename === session?.user?.username && company.status === "assigned");
                // console.log("myacceptedcompanies:", myacceptedcompanies);

                setMycompanies(myacceptedcompanies);
                setError("")
                // setLoading(false);
            }
            else {
                setError("please wait");
                // setLoading(false);
            }
        }
        catch (err) {
            setError("no data found");
            // setLoading(false);
            // console.log("error in getting my companies:", err);
        }
    }

    const getMyData = async () => {
        try {
            // setLoading(true);

            const url = `${process.env.NEXTAUTH_URL}/api/user`;
            const res = await axios({
                method: "GET",
                url
            })
            // console.log("res:", res);
            if (res.status === 201 || res.status === 200) {
                const allusers = res.data;

                const mydata = allusers.filter((u) => u.username === session?.user?.username);
                // console.log("mydata:", mydata)
                // console.log("myData before:", myData);
                setMyData(mydata[0]);
                // console.log("myData after computing:", myData);
                setError("")
                // setLoading(false);
            }
            else {
                setError("please wait");
                // setLoading(false);
            }
        }
        catch (err) {
            setError("no data found");
            // setLoading(false);
            // console.log("error in getting my companies:", err);
        }
    }
    useEffect(() => {
        setLoading(true);
        // console.log("before getMyData")
        getMyData();
        // console.log("after getMyData")
        getCompanies();
        // console.log("after getCompanies")
        setLoading(false);
    }, [status]);


    const handleNotInterested = async (id, companyname) => {
        setLoading(true);
        // console.log("company rejected: ", id);
        // console.log("rejected Company name: ", companyname);

        const updatedFields = {
            companyId: id, //this is to change Company model with this company id only
            // updates in Company model
            franchisename: "unassigned", //set
            franchise: null, //set
            rejectedFranchiseName: session?.user?.username, //push
            rejectedFranchise: session?.user?.id, //push

            userId: session?.user?.id, // this is to change user model with this user id only
            //updated in User model
            companiesRejected: id, //push
            companiesRejectedName: companyname, //push

        }
        // console.log("companyId: ", companyId);
        // console.log("updatedFields", updatedFields);

        // RejectFr(updatedFields);
        try {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/rejectfr`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFields),
            })
            // console.log("res of rejcectfr:", res);
            if (!res) {
                setLoading(false);
                // console.log(res.json());
            }

            const data = await res.json();
            // console.log("data.upuser", data.upuser);
            setMyData(data.upuser);
            // console.log("mydata before:", myData);
            // await getMyData();
            // console.log("myData after:", myData);
            await getCompanies();
            setLoading(false);
            // console.log(data);
        }
        catch (err) {
            setLoading(false);
            // console.log("error while rejected company:", err);
        }
        setLoading(false);
    }

    const handleInterested = async (id, companyname) => {
        setLoading(true);
        // console.log("company rejected: ", id);
        // console.log("rejected Company name: ", companyname);

        const updatedFields = {
            companyId: id, //this is to change Company model with this company id only
            // updates in Company model
            status: "assigned",

            userId: session?.user?.id, // this is to change user model with this user id only
            //updated in User model
            companiesAccepted: id, //push
            companiesAcceptedName: companyname, //push

        }
        // console.log("companyId: ", companyId);
        // console.log("updatedFields", updatedFields);

        // AcceptFr(updatedFields);
        try {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/acceptfr`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFields),
            })
            // console.log("res of acceptfr:", res);
            if (!res) {
                setLoading(false);
                // console.log(res.json());
            }

            const data = await res.json();
            // console.log("data", data);
            // console.log("upuser:", data.upuser);
            setMyData(data.upuser);

            // console.log("handleinterestedbeforegetMyData")
            // await getMyData();
            await getCompanies();
            // console.log("handleinterestedaftergetCompanies")

            setLoading(false);
            // console.log(data);
        }
        catch (err) {
            setLoading(false);
            // console.log("error while accepting company:", err);
        }

        setLoading(false);
    }

    const handleReallocate = async (id, companyname) => {

        setLoading(true);

        const updatedFields = {

            companyId: id,
            status: "reallocated",
            franchise: null,
            franchisename: "unassigned",
            reallocatedFranchise: session?.user?.id,
            reallocatedFranchisename: session?.user?.username,

            userId: session?.user?.id,
            companiesReallocated: id, //push
            companiesReallocatedName: companyname, //push
        }
        // console.log("updatedfields:", updatedFields);


        try {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/reallocatefr`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFields),
            })
            // console.log("res of reallocatefr:", res.json());
            if (!res) {
                setLoading(false);
                // console.log(res.json());
            }

            const data = await res.json();
            // console.log("data:", data);
            setMyData(data.updateduser);
            // await getMyData();
            await getCompanies();
            setLoading(false);
            // console.log(data);
        }
        catch (err) {
            setLoading(false);
            // console.log("error while accepting company:", err);
        }

        setLoading(false);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Calculate total pages
    const totalPages = Math.ceil(mycompanies.length / rowsPerPage);

    // Calculate the indices for slicing
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Get the current rows
    const currentCompanies = mycompanies.slice(startIndex, endIndex);

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return (
        <>
            {error && <div className="text-red-400 min-h-screen">{error}</div>}
            {loading && <div className="text-white min-h-screen">Loading...</div>}
            {!loading && myData && data &&
                <div className="min-h-screen flex flex-col justify-center items-center w-full px-24 py-12 lg:py-4 lg:px-2 gap-4">

                    <div className="top flex  justify-center items-center w-full gap-4  overflow-hidden lg:flex-col lg:px-0">


                        <div className="w-1/2 lg:w-full h-[450px] lg:h-auto bg-white userdetailstext flex flex-col justify-between  items-center rounded p-4 ">

                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Username</label>
                                <div className="w-3/5 py-1 overflow-x-auto">{myData?.username || "loading..."}</div>
                            </div>

                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Email</label>
                                <div className="w-3/5 py-1 overflow-x-auto">{myData?.email || "loading..."}</div>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Team Leader</label>
                                <div className="w-3/5 py-1 overflow-x-auto">{myData?.teamleadername || "loading"}</div>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Spreadsheet</label>
                                <a href={myData?.spreadsheet} className="text-blue-500 hover:underline cursor-pointer    w-3/5">Click here</a>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Companies Accepted</label>
                                <div className="w-3/5 py-1">{myData?.companiesAccepted?.length || "0"}</div>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Companies Rejected</label>
                                <div className="w-3/5 py-1">{myData?.companiesRejected?.length || "0"}</div>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Companies Reallocated</label>
                                <div className="w-3/5 py-1">{myData?.companiesReallocated?.length || "0"}</div>
                            </div>
                            <div className="row flex justiy-start items-center w-full gap-4 lg:text-[10px]">
                                <label className="w-2/5 py-1 font-bold">Reminders</label>
                                <div className="w-3/5 py-1">{myData?.reminders || 0}</div>
                            </div>

                            <FranchiseRevenue username={session?.user?.username} teamleadername={session?.user?.teamleadername} />
                        </div>

                        <div className="w-1/2 flex justify-center items-center h-[450px] lg:h-auto bg-white py-4 rounded lg:w-full">
                            <PieChart username={session?.user?.username} teamleadername={session?.user?.teamleadername} />
                        </div>
                    </div>


                    {data?.length === 0 ? <h1 className="text-pink-300 text-3xl lg:text-xl mt-9 text-center">No companies assigned</h1> :
                        (
                            <>

                                <h1 className="text-pink-300 text-3xl lg:text-xl mt-8">New companies</h1>
                                <div className="Table w-full h-full  flex flex-col items-center justify-center border-gray-400 border-[1px] bg-white rounded whitespace-nowrap lg:overflow-x-auto ">
                                    <div className="w-full flex" >
                                        <div className="w-1/2  whitespace-nowrap text-center font-bold inline-block  border-gray-400 border-y-[1px] py-2 lg:py-1">Company</div>
                                        <div className="w-1/2  whitespace-nowrap text-center font-bold inline-block  border-gray-400 border-y-[1px] py-2 lg:py-1">Status</div>
                                    </div>

                                    <div className="w-full">

                                        {data &&

                                            data?.map((d) => (
                                                <div key={d._id} className="w-full flex">
                                                    <div className="w-1/2  whitespace-nowrap  text-center inline-block  border-gray-400 border-y-[1px] py-2 lg:py-1">{d.companyname}</div>
                                                    {d.status === "in progress" &&
                                                        <div className="buttons flex items-center w-1/2 whitespace-nowrap text-center border-gray-400 border-y-[1px] py-2 lg:py-1">

                                                            {isMobile ? (
                                                                <>
                                                                    <button className="w-1/2 flex justify-center items-center">
                                                                        <MdDone onClick={() => handleInterested(d._id, d.companyname)} size={20} color="white" className="rounded-full bg-green-500" />
                                                                    </button>
                                                                    <button className="w-1/2 flex justify-center items-center">
                                                                        <IoMdClose onClick={() => handleNotInterested(d._id, d.companyname)} size={20} color="white" className="rounded-full bg-red-500" />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => handleInterested(d._id, d.companyname)} className="w-1/2 flex items-center justify-center bg-green-500 rounded-xl text-white mx-2">
                                                                        <MdDone size={20} color="white" className="rounded-full bg-green-500" />
                                                                        Interested
                                                                    </button>
                                                                    <button onClick={() => handleNotInterested(d._id, d.companyname)} className="w-1/2 flex items-center justify-center bg-red-500 rounded-xl text-white mx-2">
                                                                        <IoMdClose size={20} color="white" className="rounded-full bg-red-500" />
                                                                        Not Interested
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </>
                        )}


                    {mycompanies?.length === 0 ? <h1 className="text-pink-300 text-3xl lg:text-xl mt-9 text-center">No companies accepted/working</h1> :
                        (
                            <>
                                <h1 className="text-pink-300 text-3xl lg:text-xl mt-8">My assigned companies</h1>
                                <div className="Table w-full h-full  flex flex-col items-center justify-center border-gray-400 border-[1px] bg-white rounded whitespace-nowrap lg:overflow-x-auto ">
                                    <div className="w-full flex" >
                                        <div className="w-1/2  whitespace-nowrap text-center font-bold inline-block  border-gray-400 border-y-[1px] py-2 lg:py-1">Company</div>

                                        <div className="w-1/2  whitespace-nowrap text-center font-bold inline-block  border-gray-400 border-y-[1px] py-2 lg:py-1">Reallocate</div>
                                    </div>

                                    <div className="w-full">

                                        {mycompanies &&

                                            mycompanies?.map((company) => (
                                                <div key={company._id} className="w-full flex">
                                                    <div className="w-1/2 whitespace-nowrap  text-center inline-block  border-gray-400 border-y-[1px] py-2 lg:py-1">{company.companyname}</div>
                                                    <div className="w-1/2  whitespace-nowrap flex justify-center border-gray-400 border-y-[1px] py-2 lg:py-1">
                                                        <button onClick={() => handleReallocate(company._id, company.companyname)} className=" flex items-center justify-center bg-red-500 text-white rounded-xl px-2">
                                                            Reallocate
                                                        </button>
                                                    </div>


                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>


                                <div className="w-full flex justify-center gap-2 mb-4 lg:text-[12px]">
                                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded">Prev</button>
                                    <span className="px-4 py-2 bg-gray-200 rounded">Page {currentPage} of {totalPages}</span>
                                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded">Next</button>
                                </div>
                            </>
                        )}


                </div>
            }
        </>
    )
}

export default DashboardFRPage