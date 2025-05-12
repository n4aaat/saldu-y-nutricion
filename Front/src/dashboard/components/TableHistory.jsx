import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@nextui-org/react"
import { useCallback, useState } from "react";
import { EditIcon } from "../../assets/icons/EditIcon";
import { DeleteIcon } from "../../assets/icons/DeleteIcon";
import { HistoryModal } from "./HistoryModal";
import { calcularPercentil } from "../../utils/imcUtils";
import backendApi from "../../api/backendApi";

const eliminarHistorial = async (id, onSuccess) => {	
	try {
		const response = await backendApi.delete(`/paciente/historial/${id}`);
		console.log('Eliminar Historial', response.data)		
        onSuccess();
	} catch (error) {
		console.error("Error al eliminar el historial:", error);
	}
};

export const TableHistory = ({ item, percentil, setItem, onSuccess }) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
    const [selectedItem, setSelectedItem] = useState(null);

    const columns = [
        { name: "Fecha", uid: "fecha_medicion", sortable: true },
        { name: "Edad", uid: "edad_decimal", sortable: true },
        { name: "Peso", uid: "peso", sortable: true },
        { name: "Altura", uid: "altura", sortable: true },
        { name: "IMC", uid: "imc", sortable: true },
        { name: "Estado", uid: "status", sortable: true },
        { name: "Acciones", uid: "actions" },
    ];

    const updateItem = (updatedItem) => {
        setItem((prevPaciente) => ({
            ...prevPaciente,
            historial: prevPaciente.historial.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
            ),
        }));
    };

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "fecha_medicion":
                return <p>{cellValue}</p>
            case "edad_decimal":
                return <p>{cellValue}</p>
            case "peso":
                return <p>{cellValue}</p>
            case "altura":
                return <p>{cellValue}</p>
            case "imc":
                return <p>{cellValue}</p>
            case "status":
                const data = calcularPercentil(user.edad_decimal, user.imc, percentil)
                return (
                    <Chip className="capitalize" color={data.color} size="sm" variant="flat">
                        {data.categoria}
                    </Chip>
                )
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Editar" key={"Hola"}>
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => {
                                setSelectedItem(user);
                                onOpen();
                            }}>
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Eliminar">
                            <span onClick={() => eliminarHistorial(user.id, onSuccess)} className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                )
        }
    })

    return (<>
        <Table
            aria-label="Tabla de usuarios"
            isHeaderSticky
            shadow="none"
            selectionMode="single">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No se encontraron registros"} items={item}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
        <HistoryModal onClose={onClose} onSuccess={onSuccess} onOpenChange={onOpenChange} isOpen={isOpen} selectedItem={selectedItem} updateItem={updateItem} />
    </>)
}