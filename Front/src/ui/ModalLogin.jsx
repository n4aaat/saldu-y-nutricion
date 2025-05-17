import { Link } from "@nextui-org/react";
import {
  Modal, ModalContent, useDisclosure, ModalHeader, Input,
  ModalBody, ModalFooter, Button
} from "@nextui-org/react";

import { useAuthStore } from "../hooks/useAuthStore";
import { useForm } from "../hooks/useForm";
import { useState } from "react";
import { ModalRegister } from "./ModalRegister"; // Asegúrate que exista este archivo

export const ModalLogin = () => {
  const { startLogin, status, errorMessage } = useAuthStore();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [showRegister, setShowRegister] = useState(false);

  const formValues = {
    email: '',
    password: ''
  };

  const formValidations = {
    email: [value => {
      if (value === "") return true;
      return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) ? true : false;
    }, 'Introduce un correo válido'],
    password: [value => {
      if (value === "") return true;
      return value.match(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/) ? true : false;
    }, "Contraseña inválida"]
  };

  const { formData, handleChange, formValidation, isFormValid } = useForm(formValues, formValidations);

  const loginSubmit = (event) => {
    event.preventDefault();
    startLogin({ ...formData }).then((isLogin) => {
      if (isLogin) {
        onClose();
      }
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <>
      <Link color="foreground" onPress={onOpen} className="cursor-pointer">
        Iniciar Sesión
      </Link>

      {/* Modal de LOGIN */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="auto">
        <ModalContent>
          {
            (onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Iniciar Sesión</ModalHeader>
                <ModalBody>
                  {Array.isArray(errorMessage) && errorMessage.map((error, index) => (
                    <span className="text-red-500 text-sm" key={index}>
                      {`${index + 1}. ${error}`}
                    </span>
                  ))}
                  <Input
                    autoFocus
                    label="Correo"
                    variant="bordered"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    errorMessage={formValidation.email}
                    isInvalid={!!formValidation.email}
                  />
                  <Input
                    label="Contraseña"
                    type="password"
                    variant="bordered"
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                    errorMessage={formValidation.password}
                    isInvalid={!!formValidation.password}
                  />
                </ModalBody>
                <ModalFooter className="flex flex-col items-start gap-2">
                  <div className="flex justify-between w-full">
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Cerrar
                    </Button>
                    <Button color="primary" onClick={loginSubmit}>
                      Iniciar
                    </Button>
                  </div>
                  <Button
                    variant="light"
                    size="sm"
                    className="text-sm text-blue-600"
                    onClick={() => {
                      onClose();
                      setShowRegister(true);
                    }}
                  >
                    ¿No tienes cuenta? Regístrate aquí
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>

      {/* Modal de REGISTRO */}
      <ModalRegister isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </>
  );
};
