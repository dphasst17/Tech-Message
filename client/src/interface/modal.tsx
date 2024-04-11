export interface Modals {
    isOpen: boolean,
    onOpenChange: () => void
    setModalName: React.Dispatch<React.SetStateAction<string>>,
}