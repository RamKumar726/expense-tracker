export default function ContactPage(){
    return(
        <section className="bg-white dark:bg-gray-900 mb-20">
    <div className="container px-6 py-12 mx-auto">
        <div className="text-center ">
            <p className="font-medium text-blue-500 dark:text-blue-400">Contact us</p>

            <h1 className="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl dark:text-white">We’d love to hear from you</h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400">Chat to our friendly team.</p>
        </div>

        <img className="object-cover w-full h-64 mt-10 rounded-lg lg:h-96" src="https://images.unsplash.com/photo-1568992688065-536aad8a12f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=100" alt="" />
        
        <div className="grid grid-cols-1 gap-12 mt-10 lg:grid-cols-3 sm:grid-cols-2 ">
            <div className="p-4 rounded-lg bg-blue-50 md:p-6 dark:bg-gray-800">
                <span className="inline-block p-3 text-blue-500 rounded-lg bg-blue-100/80 dark:bg-gray-700">
            <a href="https://wa.me/+916302568264?text=Hi...! Mr.YuvaRaj I Recently  visited your website.." className="text-green-700 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"><img src={`${process.env.PUBLIC_URL}/images/IMG_20240211_134014.jpg`} alt="Yuvaraj" style={{width: 150 , height: 180 , borderRadius: 5}} /></a>

                </span>
                <h2 className="mt-2 text-base font-medium text-gray-800 dark:text-white">Yuvaraj Chitikela</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Speak to our friendly team.</p>
                <p className="mt-2 text-sm text-blue-500 dark:text-blue-400">yuvarajuchitikela000@gmail.com</p>
                <a href="https://wa.me/+916302568264?text=Hi...! Mr.YuvaRaj I Recently  visited your website.." className="text-green-700 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">6302568264</a>

            </div>

            <div className="p-4 rounded-lg bg-blue-50 md:p-6 dark:bg-gray-800">
                <span className="inline-block p-3 text-blue-500 rounded-lg bg-blue-100/80 dark:bg-gray-700">
            <a href="https://wa.me/+917702123692?text=Hi...! Mr.Ram kumar I Recently  visited your website.." className="text-green-700 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"><img src={`${process.env.PUBLIC_URL}/images/ram.jpg`} alt="Ram Kumar" style={{width: 150 , height: 180 , borderRadius: 5}} /></a>

                </span>
                <h2 className="mt-2 text-base font-medium text-gray-800 dark:text-white">Ram Kumar Kota</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Speak to our friendly team.</p>
                <p className="mt-2 text-sm text-blue-500 dark:text-blue-400">ramkumarvalli143@gmail.com</p>
                <a href="https://wa.me/+917702123692?text=Hi...! Mr.Ram kumar I Recently  visited your website.." className="text-green-700 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">7702123692</a>
                
            </div>

            
        </div>
    </div>



            
</section>

    )
}