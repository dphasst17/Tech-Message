export interface GroupChat {
    idChat:string,
    name?:string,
    avatar?:string,
    listUser?:string[],
    timestamp:string,
    time:string,
    message:string
}
export interface Auth {
    username:string,
    password:string,
    confirm?:string,
    name?:string,
    email?:string,
    
}
export interface Modals {
    isOpen: boolean,
    onOpenChange: () => void
    setModalName: React.Dispatch<React.SetStateAction<string>>,
}