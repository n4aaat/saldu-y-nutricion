import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useForm } from "../hooks/useForm";
import { useState } from "react";
import axios from "axios";

export const ModalRegister = ({ isOpen, onClose }) => {
  const [errorGeneral, setErrorGeneral] = useState('');

  const formDataInit = {
    fullName: '',
    email: '',
    password: ''
  };

  const validations = {
    fullName: [(v) => v.length >= 2, 'El nombre es obligatorio'],
    email: [(v) => v.includes('@'), 'Correo inválido'],
    password: [(v) =>
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(v),
      'Debe tener mayúscula, minúscula y número'
    ]
  };

  const {
    formData,
    handleChange,
    formValidation,
    isFormValid
  } = useForm(formDataInit, validations);

  const handleRegister = async () => {
    if (isFormValid) return;

    try {
      await axios.post('http://localhost:3000/api/v1/auth/register', formData);
      alert("✅ Usuario creado. Inicia sesión.");
      onClose();
    } catch (error) {
      setErrorGeneral("❌ Error al registrar. Intenta con otros datos.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Crear Cuenta</ModalHeader>
        <ModalBody>
          <Input
            name="fullName"
            label="Nombre completo"
            value={formData.fullName}
            onChange={handleChange}
            errorMessage={formValidation.fullName}
            isInvalid={!!formValidation.fullName}
          />
          <Input
            name="email"
            label="Correo"
            value={formData.email}
            onChange={handleChange}
            errorMessage={formValidation.email}
            isInvalid={!!formValidation.email}
          />
          <Input
            name="password"
            type="password"
            label="Contraseña"
            value={formData.password}
            onChange={handleChange}
            errorMessage={formValidation.password}
            isInvalid={!!formValidation.password}
          />
          {errorGeneral && <p className="text-red-500 text-sm">{errorGeneral}</p>}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>Cancelar</Button>
          <Button color="primary" onClick={handleRegister}>Registrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
