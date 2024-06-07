import { useEffect, useState } from "react";
import { Timestamp, addDoc, collection   , getDocs, query, updateDoc, where} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import {useAuthState} from 'react-firebase-hooks/auth'
import { useNavigate } from "react-router-dom";
import { startOfMonth, endOfMonth } from 'date-fns';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Budget {
    budget: number;
}


export interface Item{
    id: string;
    uid: string,
    money: number,
    category: string,
    username: string,
    transaction: string,
    currentdate: Date,
}




export default function BudgetForm(){
    const navigate  = useNavigate();
    const [budgetData, setBudget] = useState<Budget>({ budget: 0 });
    const budgetRef = collection(db, "budget");
    const [user] = useAuthState(auth)



    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBudget({
            ...budgetData,
            [name]: parseInt(value, 10),
        });
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();
            
            const budgetQuery = query(
                collection(db, "budget"),
                where("uid", "==", user?.uid),
                where("month", "==", currentMonth),
                where("year", "==", currentYear)
            );
    
            const querySnapshot = await getDocs(budgetQuery);
    
            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    const docRef = doc.ref;
                    await updateDoc(docRef, {
                        budget: budgetData.budget,
                        updatedate: new Date(),
                    });
                });
            } else {
                await addDoc(budgetRef, {
                    budget: budgetData.budget,
                    createdate: new Date(),
                    updatedate: new Date(),
                    month: currentMonth,
                    year: currentYear,
                    uid: user?.uid,
                    username: user?.displayName
                });
            }
            setBudget({
                budget: 0,
            });
            navigate('/');
        } catch (error) {
            console.error("Error adding/updating document: ", error);
        }
    };
    
   
    


    useEffect(() => {  
        const fetchBudget = async () => {
            if (user) {
                const budgetQuery = query(
                    collection(db, "budget"),
                    where("uid", "==", user.uid)
                );
                try {
                    const querySnapshot = await getDocs(budgetQuery);
                    querySnapshot.forEach((doc) => {
                        setBudget(doc.data() as Budget);
                    });
                    console.log(budgetData.budget)
                } catch (error) {
                    console.error("Error fetching budget: ", error);
                }
            }
        };
    
        fetchBudget();
    }, [user]);
    

    const handleEdit = async () => {
        try {
            const now = new Date();
            const start = startOfMonth(now);
            const end = endOfMonth(now);
    
            // Convert to Firestore Timestamp
            const startTimestamp = Timestamp.fromDate(start);
            const endTimestamp = Timestamp.fromDate(end);
    
            const budgetQuery = query(
                collection(db, "budget"),
                where("uid", "==", user?.uid),
                where("date", ">=", startTimestamp),
                where("date", "<=", endTimestamp)
            );
    
            const querySnapshot = await getDocs(budgetQuery);
            querySnapshot.forEach((doc) => {
                setBudget(doc.data() as Budget);
            });
        } catch (error) {
            console.error("Error fetching budget data: ", error);
        }
    };



    return(
        <div className=" mt-12">
             <form onSubmit={handleSubmit}>
                        <input
                            id="budget"
                            value={budgetData.budget}
                            name="budget"
                            type="number"
                            placeholder="Enter Your Budget"
                            className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                            onChange={handleOnChange}
                        />
                        <br />
                        <br />
                        <br />
                        <button
                            type="submit"
                            onClick={()=>toast.info("Your Budget Updated Successfully.. ")}
                            className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200 text-gray-50 font-bold leading-loose transition duration-200"
                            
                        >
                            Submit
                        </button>
                        
                        <button
                                type="button"
                                className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-[#7aeec9] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200 text-gray-50 font-bold leading-loose transition duration-200"
                                onClick={handleEdit}
                            >
                                Edit
                        </button>

                   
                    </form>
        </div>

    )
}