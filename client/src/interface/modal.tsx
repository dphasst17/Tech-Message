export interface Modal {
    isOpen: boolean,
    onOpenChange: () => void
    setModalName: React.Dispatch<React.SetStateAction<string>>,
}