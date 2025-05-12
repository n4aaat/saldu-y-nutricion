import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import backendApi from "../../api/backendApi";
import { LineChart } from "../components/LineChart";
import { Tabs, Tab, Avatar, Button, useDisclosure } from "@nextui-org/react";
import { PlusIcon } from "../../assets/icons/plusIcon";
import { TableHistory } from "../components/TableHistory";
import { CreateHistory } from "../components/CreateHistory";

export const PacientePage = () => {
    const { id } = useParams()
    const [paciente, setPaciente] = useState(null)
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    const fetchPaciente = async () => {
        try {
            const response = await backendApi.get(`/paciente/${id}`);
            console.log(response.data)
            setPaciente(response.data);
        } catch (error) {
            console.error("Error al obtener el paciente:", error);
        }
    };

    useEffect(() => {        
        fetchPaciente();
    }, [id]);

    return (
        <>
            <div className="container m-auto pt-8 pb-20">
                {paciente ? (
                    <>
                        <div className="flex items-center gap-6 pb-6">
                            <Avatar isBordered color={(paciente.genero === "hombre") ? "66AAF9" : "FF95E1"} size="lg" />
                            <div>
                                <p className="text-base text-gray-700"><b>Nombre:</b> {paciente.nombre}</p>
                                <p className="text-base text-gray-700"><b>Genero:</b> {paciente.genero}</p>
                                <p className="text-base text-gray-700"><b>Fecha de Nacimiento:</b> {paciente.fecha_nacimiento}</p>
                            </div>
                        </div>
                        <Tabs aria-label="Options">
                            <Tab key="historial" title="Historial">
                                <TableHistory item={paciente.historial} setItem={setPaciente} percentil={paciente.percentiles.imc} onSuccess={fetchPaciente} />
                            </Tab>
                            <Tab key="peso" title="Peso">
                                <LineChart info={{
                                    percentiles: paciente.percentiles.peso,
                                    genero: paciente.genero,
                                    label: "Peso (kgs)",
                                    historial: paciente.historial,
                                    type: "peso"
                                }} />
                            </Tab>
                            <Tab key="estatura" title="Estatura">
                                <LineChart info={{ percentiles: paciente.percentiles.estatura, genero: paciente.genero, label: "Estatura (cm)", historial: paciente.historial, type: "altura" }} />
                            </Tab>
                            <Tab key="imc" title="IMC">
                                <LineChart info={{ percentiles: paciente.percentiles.imc, genero: paciente.genero, label: "IMC (kgs/m2)", historial: paciente.historial, type: "imc" }} />
                            </Tab>
                        </Tabs>
                        <Button onClick={() => {onOpen()}}
                            endContent={<PlusIcon />}
                            color="primary">
                            Agregar Historial
                            <CreateHistory onOpenChange={onOpenChange} isOpen={isOpen} id={id} onClose={onClose} onSuccess={fetchPaciente} />
                        </Button>
                    </>
                ) : (
                    <p>Cargando paciente...</p>
                )}
            </div>
        </>
    )
}