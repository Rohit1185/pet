import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { useState } from 'react';

import Registerform from './Components/Registerform';
import Login from './Components/Login';


// import Nav from './Components/Nav';
import Notfound from './Components/Notfound';
import Home from './Components/Home';
import Profile from './Components/Profile';
import Updatepass from './Components/Updatepass';
import UpdateProfile from './Components/UpdateProfile'
import AdoptionForm from './Components/AdoptionForm';
import Footer from './Components/Footer';
import AdopionReq from './Components/AdoptionReq'
import Feedback from './Components/Feedback'
import ShelterFeebackReview from './Components/Shelter/Shelter-Feedback_review'
import ShelterReport from './Components/Shelter/Shelter-report'
// Shelter Imports 
import ShelterDashboard from './Components/ShelterDashboard';
import ShelterProfile from './Components/Shelter/Shelter-profile';
import ShelterFoundPage from './Components/Shelter/Shelter-foundpet'
import ShelterHealth from './Components/Shelter/Shelter-health';
import ShelterTraining from './Components/Shelter/Shelter-training';
import ShelterFood from './Components/Shelter/Shelter-food';
import ShelterDonation from './Components/Shelter/Shelter-donation';
import ShelterEvent from './Components/Shelter/Shelter-events';
import ShelterAdopt from './Components/Shelter/Shelter-Adopt';
import ShelterAddDonation from './Components/Shelter/Shelete-add-donation';

//Context Imports 
import userContext from './Context/userContext';
import userProfile from './Context/userProfile'
import MasterNav from './Components/MasterNav';
import AddEvent from './Components/Shelter/Shelter-events';
import ViewEvents from './Components/ViewEvents';
import ViewEventDetails from './Components/ViewEventDetails';
import Mypet from './Components/Mypet';
import MyEvent from './Components/MyEvent';
import MyAdoption from './Components/MyAdoption';
import AdminDashboard from './Components/Admin/Admin_nav';
import MyEventParticipation from './Components/MyEventparticipation';
import Reports from './Components/Reports'
import MyReports from './Components/MyReport'
import ForgotPassword from './Components/ForgotPass';
import ViewApplication from './Components/ViewApplication';
function App() {
  const[isloggedinstate,setisloggeedinstate]= useState(false);
  const[userdetails,setuserdetails] = useState({isShelter:"No"});

  return (
    <>
  
    <userContext.Provider value={{isloggedin:isloggedinstate,setloggedin:  setisloggeedinstate}}>
      <userProfile.Provider value={{userdetails:userdetails,setuserdetails:setuserdetails}}>
      <BrowserRouter>
<MasterNav></MasterNav>
        <Routes>
          <Route path='/' element={<Home/>}></Route> 
          <Route path='/register' element={<Registerform/>}></Route> 
          <Route path='/login' element={<Login/>}></Route> 
          <Route path='/profile' element={<Profile/>}></Route> 
          <Route path='/update-pass' element={<Updatepass/>}></Route> 
          <Route path='/update-profile' element={<UpdateProfile/>}></Route>
          <Route path='/shelter-dashboard/:shelterId' element={<ShelterDashboard/>}/>
          <Route path='/shelter-profile' element={<ShelterProfile/>}/>
          <Route path='/shelter-list-page' element={<ShelterFoundPage/>}/>
          <Route path='/health-page' element={<ShelterHealth/>}/>
          <Route path='/training-page' element={<ShelterTraining/>} ></Route>
          <Route path='/food-page' element={<ShelterFood/>} ></Route>
          <Route path='/shelter-events' element={<ShelterEvent/>} ></Route>
          <Route path='/donation' element={<ShelterDonation/>} ></Route>
          <Route path='/add-donation' element={<ShelterAddDonation/>}></Route>
          <Route path='/adoption-pet' element={<ShelterAdopt/>} ></Route>
          <Route path="/adoptionform/:petId" element={<AdoptionForm/>}></Route>
          <Route path='/shelter-add-events' element={<AddEvent/>}></Route>
          <Route path='/view-events' element={<ViewEvents/>}></Route>
          <Route path='/feedback-form/:requestId' element={<Feedback />}></Route> 
          <Route path='/my-events/:userId' element={<MyEvent/>}></Route>
          <Route path='/vieweventdetails/:shelterId' element={<ViewEventDetails/>}></Route>
          <Route path='/my-pets/:userId' element={<Mypet/>}></Route>
          <Route path='/submit-adoption-form/:userId' element={<MyAdoption/>}></Route>
          <Route path='/adoption-request/:userId' element={<AdopionReq/>}></Route>
          <Route path='/login/admin-dashboard' element={<AdminDashboard/>}></Route>
          <Route path='/my-feedback/:shelterId' element={<ShelterFeebackReview/>}></Route>
          <Route path='/my-event-participation/:userId' element={<MyEventParticipation/>}></Route>
          <Route path='/report-form/:requestId' element={<Reports/>}></Route>
          <Route path='/my-shelter-report/:shelterId' element={<ShelterReport/>}></Route>
          <Route path='/track-my-report/:userId' element={<MyReports/>}></Route>
          <Route path='/forgotpass' element={<ForgotPassword/>}></Route>
          <Route path='/view-application/:petId' element={<ViewApplication/>}/>
          <Route path='*' element={<Notfound/>}></Route>
          
        </Routes> 
        <Footer/>
      </BrowserRouter>
        </userProfile.Provider>
         </userContext.Provider>
    </>
  )
}

export default App
