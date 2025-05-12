import { Link } from "@nextui-org/react";
import { Modal, ModalContent, useDisclosure, ModalHeader, Input, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useAuthStore } from "../hooks/useAuthStore";
import { useForm } from "../hooks/useForm";

export const ModalLogin = () => {
    const { startLogin, status, errorMessage } = useAuthStore()
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
    const formValues = {
        email: '',
        password: ''
    }
    const formValidatios = {
        email: [value => {
            if (value === "") return true;
            return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i) ? true : false;
        }, 'Introduce un correo Valido'],
        password: [value => {
            if (value === "") return true;
            return value.match(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/) ? true : false;
        }, "Contraseña Invalida"]
    }
    const { formData, handleChange, formValidation, isFormValid } = useForm(formValues, formValidatios)

    const loginSubmint = (event) => {
        event.preventDefault();
        startLogin({ ...formData }).then((isLogin) => {
            if (isLogin) {
                onClose()
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <Link color="foreground" onPress={onOpen} className="cursor-pointer">
                Iniciar Sesion
            </Link>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="auto">
                <ModalContent>
                    {
                        (onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Iniciar Sesion</ModalHeader>
                                <ModalBody>
                                    {
                                        Array.isArray(errorMessage) && errorMessage.map((error, index) => (
                                            <spam className="text-red-500" key={index}>
                                                {`${index + 1}. ${error}`}
                                            </spam>
                                        ))
                                    }

                                    <Input autoFocus label="Correo" variant="bordered" value={formData.email} onChange={handleChange} name="email" errorMessage={formValidation.email} isInvalid={formValidation.email ? true : false} />
                                    <Input label="Contraseña" type="password" variant="bordered" value={formData.password} onChange={handleChange} name="password" errorMessage={formValidation.password} isInvalid={formValidation.password ? true : false} />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                    <Button color="primary" onClick={loginSubmint}>
                                        Iniciar
                                    </Button>
                                </ModalFooter>
                            </>
                        )
                    }
                </ModalContent>
            </Modal>
        </>
    )
}