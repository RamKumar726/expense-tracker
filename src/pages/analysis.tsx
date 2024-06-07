import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Pie } from "react-chartjs-2";
import{ Link } from 'react-router-dom'

import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Loading from "../components/loading";
import ErrorPage from "../components/error";
import AnalysisCard from "../components/analysisCard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Chart.register(ArcElement, Tooltip, Legend);

export interface Item {
    id: string;
    uid: string;
    money: number;
    category: string;
    username: string;
    transaction: string;
    currentdate: Date;
}


interface Budget {
    budget: number;
}

export default function Analysis() {
    const [chartData, setChartData] = useState<any>(null);
    const [user] = useAuthState(auth);
    const [items, setItemArray] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [budgetData, setBudget] = useState<Budget>({ budget: 0 });
    const [moneyspent , setMoneyspent] = useState<number>(0)



    const fetchItems = async (timeFrame: "daily" | "weekly" | "monthly" = "monthly") => {
        if (!user) {
            console.error("User is not authenticated");
            return;
        }
        setLoading(true);
        const itemRef = collection(db, 'items');
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        let startDate: Date;
        let endDate: Date = new Date(currentYear, currentMonth + 1, 1);

        switch (timeFrame) {
            case "daily":
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                endDate = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
                console.log("strat",startDate)
                break;
            case "weekly":
                const firstDayOfWeek = currentDate.getDate() - currentDate.getDay();
                startDate = new Date(currentYear, currentMonth, firstDayOfWeek);
            endDate = new Date(currentYear, currentMonth, firstDayOfWeek + 7);
                break;
            case "monthly":
            default:
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                break;
        }

        console.log("Start Date:", startDate);

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

            setItemArray(itemsArray);
            setLoading(false);
            console.log("Fetched Items:", itemsArray);
            if(timeFrame ==='monthly'){
                let spent = 0;
                itemsArray.forEach((item: Item) => {
                    spent += Number(item.money);
                });
                setMoneyspent(spent);

            }
        } catch (error) {
            console.error("Error fetching items:", error);
            setLoading(false);
        }
    };






    useEffect(() => {
        const categoryTotals: { [key: string]: number } = {};
        items.forEach(item => {
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
                    

                    '#3ABEF9',
                    '#6295A2',
                    '#C39898',
                    '#850F8D',
                    '#C65BCF',
                    '#6C0345',
                    '#9B3922',
                    '#401F71',
                    '#F7418F',
                    '#4F6F52',
                    '#F4CE14',
                    '#4477CE',
                    '#0B666A',
                    '#EF6262',       
                ],
                hoverBackgroundColor: [
                    
                    '#A7E6FF',
                    '#B3E2A7',
                    '#DBB5B5',
                    '#C738BD',
                    '#F27BBD',
                    '#DC6B19',
                    '#F2613F',
                    '#824D74',
                    '#FC819E',
                    '#86A789',
                    '#FFFB73',
                    '#96B6C5',
                    '#071952',
                    '#F3AA60',     
                ]
            }]
        });
    }, [items , budgetData.budget]);

    useEffect(()=>{
        fetchItems();
    } , [user])


    const handleDaily = () =>{
        fetchItems('daily')
        toast("Displaying Toady Expenses")
        
    }
    const handleWeekly = () =>{
        fetchItems('monthly')
        toast("Displaying This Week Expenses")

    }
    const handleMonthly = () =>{
        fetchItems('weekly')
        toast("Displaying This Month Expenses")


    }

    const fetchBudget = async () => {
    
        if (user) {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();
    
            const budgetQuery = query(
                collection(db, "budget"),
                where("uid", "==", user.uid),
                where("month", "==", currentMonth),
                where("year", "==", currentYear)
            );
    
            try {
                const querySnapshot = await getDocs(budgetQuery);
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        setBudget(doc.data() as Budget);
                    });
                } else {
                }
            } catch (error) {
                console.error("Error fetching budget: ", error);
            }
        }
    };
    
    useEffect(() => {
        fetchBudget();
        
    }, [user]);








    return (
        <div className=' mb-20'>
           
            <h1>Your Analysis</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
    <button onClick={handleDaily} className="relative px-4 py-2 text-sm rounded-md bg-white isolation-auto z-10 border-2 border-lime-500
        before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-lime-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">
        Daily
    </button>
    <button onClick={handleWeekly} className="relative px-4 py-2 text-sm rounded-md bg-white isolation-auto z-10 border-2 border-lime-500
        before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-lime-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">
        Weekly
    </button>
    <button onClick={handleMonthly} className="relative px-4 py-2 text-sm rounded-md bg-white isolation-auto z-10 border-2 border-lime-500
        before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-lime-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">
        Monthly
    </button>
    <button  className="relative px-4 py-2 text-sm rounded-md bg-white isolation-auto z-10 border-2 border-lime-500
        before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-lime-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">
        <Link to="/coustom">Custom</Link>
    </button>

    <ToastContainer />
</div>
            
            <div >
            {loading ? (
                    <Loading />
                ) : chartData && items.length> 0 ?  (
                    <><Pie data={chartData} width={300} height={300} className="duration-200 delay-200" style={{ width: '300px', height: '300px', margin: '0 auto'  }}/>
                    <AnalysisCard moneyspent={moneyspent} budget={budgetData.budget} moneyremian={budgetData.budget-moneyspent} />
                    </>

                )
                : (
                    <ErrorPage />
                )
            }
            </div>

            <div>


            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
  <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
    <div className="mx-auto max-w-5xl">
      <div className="gap-4 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">My Expenses</h2>

        <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
          

          
        </div>
      </div>

      <div className="mt-6 flow-root sm:mt-8">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          
          {items.map(item =>(
            <div className="flex flex-wrap items-center gap-y-4 py-6 hover:bg-blue-200">
            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Money </dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                <p  className="hover:underline">{item.money}</p>
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
              
            </div>
        </div>
    );
}
