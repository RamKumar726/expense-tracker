import { useAuthState } from 'react-firebase-hooks/auth'
import {auth} from '../config/firebase'
import { Link , useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import {useEffect} from 'react'

import 'primeicons/primeicons.css';
        
 

export default function Navbar(){
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    const signuserOut = async() =>{
        await signOut(auth);
        navigate('/')
    }


    useEffect(() => {
        const handleBurgerClick = () => {
          const menu = document.querySelector('.navbar-menu');
          if (menu) {
            menu.classList.toggle('hidden');
          }
        };
    
        const handleMenuClose = () => {
          const menu = document.querySelector('.navbar-menu');
          if (menu) {
            menu.classList.add('hidden');
          }
        };
    
        const burger = document.querySelectorAll('.navbar-burger');
        if (burger.length) {
          burger.forEach((item) => {
            item.addEventListener('click', handleBurgerClick);
          });
        }
    
        const close = document.querySelectorAll('.navbar-close');
        if (close.length) {
          close.forEach((item) => {
            item.addEventListener('click', handleMenuClose);
          });
        }
    
        const backdrop = document.querySelectorAll('.navbar-backdrop');
        if (backdrop.length) {
          backdrop.forEach((item) => {
            item.addEventListener('click', handleMenuClose);
          });
        }
    
        return () => {
          if (burger.length) {
            burger.forEach((item) => {
              item.removeEventListener('click', handleBurgerClick);
            });
          }
    
          if (close.length) {
            close.forEach((item) => {
              item.removeEventListener('click', handleMenuClose);
            });
          }
    
          if (backdrop.length) {
            backdrop.forEach((item) => {
              item.removeEventListener('click', handleMenuClose);
            });
          }
        };
      }, []);

    return(
        <div>
            <body className="bg-blue-500">
	        <nav className="relative px-4 py-4 flex justify-between items-center bg-slate-200 border-x-slate-400">
		<a className="text-3xl font-bold leading-none" href="/">
			<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvwSo_IDWBaLemSkxPL7o142JAUYhO0guthg&s' alt='logo' width="40px" height="40px" style={{borderRadius: "50%"}}></img>
		</a>
		<div className="lg:hidden">
			<button className="navbar-burger flex items-center text-blue-600 p-3">
				<svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
					<title>Mobile menu</title>
					<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
				</svg>
			</button>
		</div>
		<ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:flex lg:items-center lg:w-auto lg:space-x-6">
			{user &&
        <li><Link className="text-sm text-gray-400 hover:text-gray-500" to="/">Home</Link></li>
      }
      {user &&
			
        <li><Link className="text-sm text-blue-600 font-bold" to="/analysis">Analysis</Link></li>
      }
			
			
      <li><Link className="text-sm text-blue-600 font-bold" to="/contact">Contact Us</Link></li>
    
			
			{/* <li className="text-gray-300">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
				</svg>
			</li> */}
		</ul>
    <div className="hidden lg:flex lg:items-center">
        {user && (
          <>
            <span className="mr-4 text-sm text-gray-700"><strong>{user.displayName}</strong></span>
            <img className="h-10 w-10 rounded-full" src={user.photoURL || ""} alt="Profile" />
          </>
        )}
        {user ? (
          <Link onClick={signuserOut} className="ml-3 py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200" to="/login">Logout<i className="pi  pi-sign-in" style={{marginLeft: 5}}></i></Link>
        ) : (
          <Link className="ml-3 py-2 px-6 bg-blue-400 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200" to="/login">Log In</Link>
        )}
      </div>
	</nav>
	<div className="navbar-menu relative z-50 hidden">
		<div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
		<nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
			<div className="flex items-center mb-8">
				<a className="mr-auto text-3xl font-bold leading-none" href="/">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvwSo_IDWBaLemSkxPL7o142JAUYhO0guthg&s" alt="Logo" width="40px" height="40px" />
				</a>
				<button className="navbar-close">
					<svg className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
			<div>
				<ul>
        {user && (
          <div className="flex items-center mb-4">
            <img className="h-10 w-10 rounded-full" src={user.photoURL||""} alt="Profile" />
            <span className="ml-2 text-sm text-gray-700"><strong>{user.displayName}</strong></span>
          </div>
    )}
					{user &&
            <><li className="mb-1">
                      <Link className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" to="/">Home</Link>
                    </li><li className="mb-1">
                        <Link className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" to="/analysis">Analysis</Link>
                      </li></>
          }
					<li className="mb-1">
						<Link className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" to="/contact">Contact Us</Link>
					</li>
				</ul>
			</div>
			<div className="mt-auto">
				<div className="pt-6">
          {/* {user && <img src={user.photoURL || ""} width={50} height={50} className='rounded' style={{marginLeft:}}/> */}
					{!user && <Link className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-blue-500 hover:bg-gray-100 rounded-xl" to="/login">Log in</Link>}
					{user && <Link onClick={signuserOut} className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700  rounded-xl" to="/login">Log Out</Link>}
				</div>
				<p className="my-4 text-xs text-center text-gray-400">
					<span>Copyright © 2024</span>
				</p>
			</div>
		</nav>
	</div>
</body>
       </div>

    )
}