import { addDoc, collection  , getDoc , getDocs, query, updateDoc, where} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import {useAuthState} from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react';

interface Props{
    name: string,
    phtoturl: string,
    userMoney: number,


}

interface Budget {
    budget: number;
}







export default function ProfileCard({name="" , phtoturl="" , userMoney=0}){
    const [budgetData, setBudget] = useState<Budget>({ budget: 0 });
    const [isEditMode, setIsEditMode] = useState(false);
    const[user] = useAuthState(auth)
    const fetchBudget = async () => {
        if (user) {
            const currentMonth = new Date().getMonth() + 1; 
            const currentYear = new Date().getFullYear();
    
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
                    setIsEditMode(true); 
                } else {
                    setBudget({ budget: 0 });
                    setIsEditMode(false); 
                }
            } catch (error) {
                console.error("Error fetching budget: ", error);
            }
        }
    };

    useEffect(()=>{
        fetchBudget()
    }, [user])
    
    return(
        <div
    className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6" style={{marginTop: 100}}>
    <img className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0" src={phtoturl} alt="Profile" />
    <div className="text-center space-y-2 sm:text-left">
        <div className="space-y-0.5">
            <p className="text-lg text-black font-semibold">
                {name}
            </p>
        </div>
        <button className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Total Money Spent: {userMoney}</button>
    </div>
</div>
    )
}