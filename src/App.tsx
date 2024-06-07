import './App.css';
import { BrowserRouter as Router , Routes  ,Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Navbar from './components/navbar';
import Footer from './components/footer';
import Analysis from './pages/analysis';
import { useAuthState } from 'react-firebase-hooks/auth'
import {auth} from './config/firebase'
import LandingPage from './pages/landingPage';
import YearMonthForm from './components/customeForm';
import ContactPage from './pages/contact';

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
        {user &&  <Route path='/' element={ <Home /> }/>}
        {!user && <Route path='/' element ={<LandingPage />} />}
         <Route path='/login' element={ <Login /> } />
          <Route path='/analysis' element={ <Analysis />} />
          <Route path='/coustom' element={ <YearMonthForm />} />
          <Route path='/contact' element={<ContactPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
