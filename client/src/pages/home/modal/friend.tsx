import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

const ModalFriend = () => {
  return <Modal
  /* isOpen={isOpen} */
  /* onOpenChange={() => { onOpenChange() }} */
>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1">Search</ModalHeader>
        <ModalBody>
          
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={() => { onClose() }}>
            Close
          </Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>

}

export default ModalFriend