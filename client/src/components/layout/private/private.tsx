
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({children}:{ children: React.ReactNode }) => {
    const location = useLocation()
    const isLoggedIn = localStorage.getItem('chatLogin') === 'true'; // Hàm kiểm tra trạng thái đăng nhập của người dùng
    sessionStorage.setItem("pathName",JSON.stringify(location.pathname));
    return  isLoggedIn ? children : <Navigate to="/auth" />;

};

export default PrivateRoute