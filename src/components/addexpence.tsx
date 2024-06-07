import { useEffect, useState } from "react";
import { collection , addDoc, query, where ,getDocs , deleteDoc, doc  } from "firebase/firestore";
import { db , auth } from "../config/firebase"
import {useAuthState} from 'react-firebase-hooks/auth'
import Loading from "./loading";
import ErrorPage from "./error";
import ProfileCard from "./profileCard";
import Budget from "./budeget";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'primeicons/primeicons.css';
        
        


export interface Item{
    id: string;
    uid: string,
    money: number,
    category: string,
    username: string,
    transaction: string,
    currentdate: Date,
}


export default function Addexpense() {

    const [user] = useAuthState(auth);
    const [items , setItemArray] = useState<Item[]>([])
    const [moneyspent , setMoneyspent] = useState<number>(0)
    const itemRef  = collection(db , "items" )
    const [loading, setLoading] = useState<boolean>(false);
    const [isBudget , setIsBudget] = useState<Boolean>(false)
    const [filter, setFilter] = useState<any>({ filtertype: 'All' });





    const [formData, setFormData] = useState<any>({
        money: 0,
        category: "",
        transaction: "",
    });

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async(event: any) => {
        event.preventDefault();
        await addDoc(itemRef,{
            money: formData.money,
            category : formData.category,
            transaction: formData.transaction,
            username: user?.displayName,
            uid: user?.uid,
            currentdate :   new Date(),

        })
        setFormData({
        money: 0,
        category: "",
        transaction: "",
          
        })   
        fetchItems();     
    };


    const fetchItems = async (transactionType: "all" | "Cash" | "UPI" | "Card" = "all") => {
        if (!user) {
            console.error("User is not authenticated");
            return;
        }
        setLoading(true);
        const itemRef = collection(db, 'items');
        
        let q;
        if (transactionType === "all") {
            q = query(
                itemRef,
                where("uid", "==", user.uid)
            );
        } else {
            q = query(
                itemRef,
                where("uid", "==", user.uid),
                where("transaction", "==", transactionType)
            );
        }
    
        try {
            const querySnapshot = await getDocs(q);
            const itemsArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as unknown as Item[];
    
            setItemArray(itemsArray);
            console.log(itemsArray)
            setLoading(false);
        } catch (error) {
            console.error("Error fetching items:", error);
            setLoading(false);
        }
    };
        
    const totalMoney = () =>{
        let sumMoney = 0;
        items.forEach((item: Item) => {
            sumMoney = sumMoney + Number(item.money);
        });
        setMoneyspent(sumMoney);
    }



    useEffect(() => {
        if (user && !items.length) {
            fetchItems('all');
        }
    }, [user, fetchItems, items]);
    
    useEffect(() => {
        totalMoney();
    }, [items, totalMoney]);
    
    
    
   
    const deleteItem = async(itemId:string) =>{
        await deleteDoc(doc(db , 'items' , itemId) );
        setItemArray(items.filter((item)=>item.id !== itemId));
        toast.warning("Deleted SuccessFully")

    }

    const handleFilterChange = (event: { target: { name: string; value: string; }; }) => {
        const { name, value } = event.target;
        setFilter((prevFilter: any) => ({
            ...prevFilter,
            [name]: value,
        }));
    };
    const handleFilterSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Selected filter type:', filter.filtertype);
        fetchItems(filter.filtertype);
    };



   
   


    return (
        <div className=" mb-20">

        
        <ProfileCard name={user?.displayName|| ""} phtoturl={user?.photoURL || "" } userMoney={moneyspent || 0} />
        <button onClick={()=>setIsBudget(!isBudget)} className=" mt-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Budget to This Month
        </button>   

        {
            isBudget && <Budget />
        }

        <div>
        <h1 className=" mt-9 mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-2xl dark:text-white">Add Your Expenses</h1>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-5 group">
        
            <input 
            type="number"
            name="money"
            value={formData.money}
            placeholder="Enter Money.."
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
            required />
        </div>
        <select 
            id="countries" 
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="Select Category" selected>
                                Select Category
                </option>
                <option value="Food">Food</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Fee">Fee</option>
                <option value="Shopping">Shopping</option>
                <option value="Travelling">Travelling</option>
                <option value="Entertainement">Entertainement</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Taxes">Taxes</option>
                <option value="Bills & Utilities">Bills & Utilities</option>
                <option value="Investments">Investments</option>
                <option value="Rent">Rent</option>
                <option value="Insurance">Insurance</option>
                <option value="Gifts">Gifts</option>
                <option value="Donation">Donation</option>
                <option value="other">other</option>
        </select>
        <br />
        <select 
            id="countries" 
            name="transaction"
            value={formData.transaction}
            onChange={handleChange}
            required
            className="  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="Select Type of Transaction" selected>
                    Select Type of Transaction
                </option>
    
                <option value="Card"> Card</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
        </select>
        <br/>
        <button type="submit"  
        onClick={()=>toast.success("Sucess")} 
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            Submit
        </button>
        </form>

        </div>



        <section className=" -mt-4 bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
<div className="mx-auto max-w-5xl">
<div className=" mt-24 gap-4 sm:flex sm:items-center sm:justify-between">
<h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">My Expenses</h2>

<div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
<form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <select 
                id="countries" 
                name="filtertype"
                value={filter.filtertype}
                onChange={handleFilterChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                <option value="all" >
                    All
                </option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
            </select>
            <button 
                type="submit"
                onClick={()=>toast.success("Filter Applied SucessFully")} 
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Filter
            </button>
            <ToastContainer  />

        </form>
  
</div>
</div>
</div>
</div>
</section>






   

        <div>
        {loading ? (
    <Loading />
) : items && items.length > 0 ? (
    <div>
    <section className=" bg-white py-8 antialiased dark:bg-gray-900 md:py-16" style={{marginTop: -120}}>
<div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
<div className="mx-auto max-w-5xl">


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
    <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                <button type="button" onClick={(e) => deleteItem(item.id)} className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto"> <i className="pi pi-trash" style={{ fontSize: '1rem' }}></i></button>
            </div>
  </div>

  ))}
          </div>
</div>


</div>
</div>
</section>
      
    </div>

) : (
  <ErrorPage />

)}

          
    </div>

      
        </div>
    );
}


