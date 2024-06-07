 export default function Footer(){
    return(
        

<footer className=" mt-10 fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">Expense-Tracker-App™</a>. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <h1 className="hover:underline me-4 md:me-6">Contact us: </h1>
        </li>
        <li>
            <a href="https://wa.me/+916302568264?text=Hi...! Mr.YuvaRaj I Recently  visited your website.." className="hover:underline me-4 md:me-6">Yuvaraj</a>
        </li>
        <li>
            <a href="https://wa.me/+917702123692?text=Hi...! Mr.Ram kumar I Recently  visited your website.." className="hover:underline me-4 md:me-6">Ram</a>
        </li>
       
    </ul>
</footer>

    )
}