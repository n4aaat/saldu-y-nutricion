import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import backendApi from "../../api/backendApi"
import { useForm } from "../../hooks/useForm"
import { calculateImc } from '../../utils/imcUtils'

export const CreateHistory = ({ isOpen, onOpenChange, id, onClose, onSuccess }) => {

    const datos = {
        peso: '',
        altura: ''
    }

    const { formData, handleChange } = useForm(datos)

    function almacenarDatos(formData) {
        const historial = {
            peso: Number(formData.peso),
            altura: Number(formData.altura),
            imc: Number(IMC())
        }

        return historial
    }

    function fechaActual() {
        const hoy = new Date()
        const año = hoy.getFullYear()
        const mes = String(hoy.getMonth() + 1).padStart(2, '0')
        const dia = String(hoy.getDate()).padStart(2, '0')

        return `${año}-${mes}-${dia}`;
    }

    const handleSubmint = async () => {

        const historial = almacenarDatos(formData)

        historial.fecha_medicion = fechaActual()

        historial.paciente = id

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        try {
            const { data } = await backendApi.post('/paciente/historial', historial, config)
            onClose()
            console.log('resultado historial', data)
            onSuccess();            
        } catch (error) {
            console.error('try historial', error);
        }
    }

    const IMC = () => {
        if (formData.peso == 0 | formData.altura == 0)
            return '';
        const imc = calculateImc(formData.peso, formData.altura);
        return imc;
    }

    return (<>
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="auto">
            <ModalContent>
                {(onclose) => (<>
                    <ModalHeader className="flex flex-col gap-1">
                        Agregar Historial
                    </ModalHeader>
                    <ModalBody>
                        <Input name="fecha_medicion" label="Fecha" type="date" variant="bordered" value={fechaActual()} isDisabled />
                        <Input name="imc" type="number" label="IMC" isDisabled variant="bordered" value={IMC()} />
                        <Input name="peso" type="number" autoFocus label="Peso (kgs)" variant="bordered" onChange={handleChange} />
                        <Input name="altura" type="number" label="Altura (cm)" variant="bordered" onChange={handleChange} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSubmint}>Guardar</Button>
                        <Button onClick={onclose} color="danger">Cancelar</Button>
                    </ModalFooter>
                </>)}
            </ModalContent>
        </Modal>
    </>)
}