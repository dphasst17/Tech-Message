import { Navigate, useLocation } from 'react-router-dom';
import { getLocalStorage } from '../../../utils/localStorage';

const PrivateRoute = ({children}:{ children: React.ReactNode }) => {
    const location = useLocation()
    const isLoggedIn = getLocalStorage('chatLog',false) === true
    sessionStorage.setItem("pathName",JSON.stringify(location.pathname));
    return  isLoggedIn ? children : <Navigate to="/auth" />;

};

export default PrivateRoute