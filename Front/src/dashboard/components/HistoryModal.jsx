import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import backendApi from "../../api/backendApi";

export const HistoryModal = ({ isOpen, onOpenChange, selectedItem, updateItem, onClose, onSuccess }) => {
    const [data, setData] = useState({
        id: null,
        fecha_medicion: new Date().toISOString().substring(0, 10),
        peso: "",
        altura: "",
        imc: "0"
    })

    useEffect(() => {
        if (selectedItem) {
            setData(() => ({
                id: selectedItem.id,
                fecha_medicion: selectedItem.fecha_medicion,
                peso: selectedItem.peso,
                altura: selectedItem.altura,
                imc: calculateImc(selectedItem.peso, selectedItem.altura),
            }));
        }
    }, [selectedItem]);

    const calculateImc = (peso, altura) => {
        const imc = peso / ((altura / 100) ** 2) // Convertir altura de cm a metros
        return imc.toFixed(2) // Redondear a 2 decimales
    }

    const updateData = async () => {
        try {
            console.log(data)
            const { data:info } = await backendApi.patch(`/paciente/historial/${data.id}`, {
                fecha_medicion: data.fecha_medicion,
                altura: parseFloat(data.altura),
                peso: parseFloat(data.peso),
                imc: parseFloat(data.imc)
            })
            console.log(info)
            updateItem(info)  
            onClose()
            onSuccess();         
        } catch (error) {
            console.log(error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        let updatedData = { ...data, [name]: value }

        if (name === "fecha_medicion" && value) {
            const date = new Date(value);
            const formattedDate = date.toISOString().substring(0, 10);
            updatedData.fecha_medicion = formattedDate;
        }

        // Calcular el IMC si peso y altura tienen valores válidos
        if (name === "peso" || name === "altura") {
            const peso = parseFloat(updatedData.peso)
            const altura = parseFloat(updatedData.altura)

            if (isNaN(peso) || isNaN(altura)) {
                updatedData.imc = "0" // Establecer IMC en 0 si hay campos vacíos
            } else {
                updatedData.imc = calculateImc(peso, altura)
            }
        }

        setData(updatedData)
    }

    return (<>
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="auto">
            <ModalContent>
                {(onclose) => (<>
                    <ModalHeader className="flex flex-col gap-1">
                        Modificar
                    </ModalHeader>
                    <ModalBody>
                        <Input name="fecha_medicion" autoFocus label="Fecha" type="date" variant="bordered" value={data.fecha_medicion} onChange={handleInputChange}/>
                        <Input name="peso" type="number" label="Peso (kgs)" variant="bordered" value={data.peso} onChange={handleInputChange} />
                        <Input name="altura" type="number" label="Altura (cm)" variant="bordered" value={data.altura} onChange={handleInputChange} />
                        <Input name="imc" type="number" label="IMC" isDisabled variant="bordered" value={data.imc} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={updateData}>Guardar</Button>
                        <Button onClick={onclose} color="danger">Cancelar</Button>
                    </ModalFooter>
                </>)}
            </ModalContent>
        </Modal>
    </>)
}