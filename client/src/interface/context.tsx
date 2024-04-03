export interface StateContextType {
    user: any[];
    setUser: React.Dispatch<React.SetStateAction<any[]>>;
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}