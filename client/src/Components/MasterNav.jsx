import ShelterNavbar from '../Components/ShelterNavbar';
import NormalNavbar from '../Components/NormalNavbar';
import { useContext, useEffect, useState } from 'react';
import userContext from '../Context/userContext';
import userProfile from '../Context/userProfile';
import Nav from '../Components/Nav';

export default function MasterNav() {
    let usercontext1 = useContext(userContext);
    let userNavbarcontext = useContext(userProfile);
    let [NavShelter, setNavShelter] = useState(<NormalNavbar/>);

    useEffect(() => {
        console.log(userNavbarcontext)
        if (userNavbarcontext.userdetails.isShelter === "YES") {
            setNavShelter(<ShelterNavbar />);

        }
    }, [userNavbarcontext.userdetails.isShelter]);
    if (usercontext1.isloggedin && userNavbarcontext.userdetails.userEmail === "admin@gmail.com") {
        return null;  // Do not render anything (No Navbar)
    }

    return (
        <>
            {usercontext1.isloggedin ? NavShelter : <Nav />}
        </>
    );
}
