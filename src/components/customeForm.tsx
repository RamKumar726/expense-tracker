import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from "../config/firebase";
import { Pie } from "react-chartjs-2";
import Loading from './loading';
import ErrorPage from './error';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import AnalysisCard from './analysisCard';
Chart.register(ArcElement, Tooltip, Legend);


interface Budget {
    budget: number;
}

export interface Item {
    id: string;
    uid: string;
    money: number;
    category: string;
    username: string;
    transaction: string;
    currentdate: Date;
}

const YearMonthForm: React.FC = () => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [perioditems, setPeriodItemArray] = useState<Item[]>([]);
    const [user] = useAuthState(auth);
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [budgetData, setBudget] = useState<Budget>({ budget: 0 });
    const [moneyspent , setMoneyspent] = useState<number>(0)


    const fetchBudget = async (month: number, year: number)=> {
        if (user) {
            const budgetQuery = query(
                collection(db, "budget"),
                where("uid", "==", user.uid),
                where("month", "==", month),
                where("year", "==", year)
            );
            try {
                const querySnapshot = await getDocs(budgetQuery);
                querySnapshot.forEach((doc) => {
                    setBudget(doc.data() as Budget);
                });
                console.log(budgetData.budget);
            } catch (error) {
                console.error("Error fetching budget: ", error);
            }
        }
    };

 


    const years = Array.from({ length: 18 }, (_, i) => 2023 + i);
    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(event.target.value));
    };

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(Number(event.target.value));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetchItemsPeriod(selectedYear, selectedMonth);
        fetchBudget(selectedMonth,selectedYear);
        setShowForm(false);
        console.log("total moey: ",moneyspent)
    };

    useEffect(() => {
        const categoryTotals: { [key: string]: number } = {};
        perioditems.forEach(item => {
            if (categoryTotals[item.category]) {
                categoryTotals[item.category] += item.money;
            } else {
                categoryTotals[item.category] = item.money;
            }
        });

        const categories = Object.keys(categoryTotals);
        const values = Object.values(categoryTotals);

        setChartData({
            labels: categories,
            datasets: [{
                label: 'Money Spent',
                data: values,
                backgroundColor: [
                    '#3ABEF9', '#6295A2', '#C39898', '#850F8D', '#C65BCF', '#6C0345',
                    '#9B3922', '#401F71', '#F7418F', '#4F6F52', '#F4CE14', '#4477CE',
                    '#0B666A', '#EF6262'
                ],
                hoverBackgroundColor: [
                    '#A7E6FF', '#B3E2A7', '#DBB5B5', '#C738BD', '#F27BBD', '#DC6B19',
                    '#F2613F', '#824D74', '#FC819E', '#86A789', '#FFFB73', '#96B6C5',
                    '#071952', '#F3AA60'
                ]
            }]
        });
    }, [perioditems]);
    

    const fetchItemsPeriod = async (year: number, month: number) => {
        if (!user) {
            console.error("User is not authenticated");
            return;
        }

        setLoading(true);

        const itemRef = collection(db, 'items');
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        const q = query(
            itemRef,
            where("uid", "==", user.uid),
            where("currentdate", ">=", startDate),
            where("currentdate", "<", endDate)
        );

        try {
            const querySnapshot = await getDocs(q);
            const itemsArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as unknown as Item[];

            setPeriodItemArray(itemsArray);
            setLoading(false);
            console.log("2024", itemsArray);
            let Spent = 0;
            itemsArray.map((item:Item)=>{
                Spent = Spent+Number(item.money);
            })
            setMoneyspent(Spent)
            console.log("The spent: ",Spent)

            console.log("spent: ",moneyspent)

        } catch (error) {
            console.error("Error fetching items:", error);
            setLoading(false);
        }
    };

   
    return (
        <div className=' mb-20'>
            <h1>Cilck + to check Details</h1>
            
            <button
  className="group cursor-pointer outline-none hover:rotate-90 duration-300"
  title="Add New"
  onClick={() => setShowForm(!showForm)}
>
  <svg
    className="stroke-teal-500 fill-none group-hover:fill-teal-800 group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300"
    viewBox="0 0 24 24"
    height="50px"
    width="50px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-width="1.5"
      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
    ></path>
    <path stroke-width="1.5" d="M8 12H16"></path>
    <path stroke-width="1.5" d="M12 16V8"></path>
  </svg>
</button>






            {showForm && (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <label htmlFor="yearDropdown">Select Year:</label>
                    <select 
                    id="yearDropdown" 
                    value={selectedYear} 
                    onChange={handleYearChange}
                    className="  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="monthDropdown">Select Month:</label>
                    <select 
                    id="monthDropdown" 
                    value={selectedMonth} 
                    onChange={handleMonthChange}
                    className="  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        {months.map(month => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>

                    <button type="submit" onClick={()=>toast.done("Expenses of "+selectedMonth+" "+selectedYear)}  className='className=" mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"'>Submit</button>
                </form>
            )}


            <div >
                {loading ? (
                    <Loading />
                ) : chartData && perioditems.length > 0 ? (
                    <>
                        <Pie data={chartData} width={300} height={300} className="duration-200 delay-200" style={{ marginTop: 5, width: '300px', height: '300px', margin: '0 auto' }} />
                        <AnalysisCard moneyspent={moneyspent} budget={budgetData.budget} moneyremian={budgetData.budget-moneyspent} />
                    </>
                ) : (
                    <ErrorPage />
                )}
            </div>
            
            {
                chartData && perioditems.length>0 ?(
                    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="mx-auto max-w-5xl">
                        <div className="gap-4 sm:flex sm:items-center sm:justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">My Expenses</h2>
                        </div>
                        <div className="mt-6 flow-root sm:mt-8">
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {perioditems.map(item => (
                                    <div key={item.id} className="flex flex-wrap items-center gap-y-4 py-6 hover:bg-blue-200">
                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Money</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                                <a href="#" className="hover:underline">{item.money}</a>
                                            </dd>
                                        </dl>
                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Event</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{item.category}</dd>
                                        </dl>
                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Transaction</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{item.transaction}</dd>
                                        </dl>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

                ):(
                    <div></div>
                )
            }
                <ToastContainer />
            
                    </div>
    );
};

export default YearMonthForm;
