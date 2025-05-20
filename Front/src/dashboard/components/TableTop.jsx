import { Input, Button } from "@nextui-org/react";
import { PlusIcon } from "../../assets/icons/plusIcon";
import { SearchIcon } from "../../assets/icons/searchIcon";
import { Link } from "react-router-dom";
export const TableTop = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
                <Input
                    isClearable
                    classNames={{
                        base: "sm:max-w-[44%]"
                    }}
                    variant="bordered"
                    placeholder="Buscar por nombre..."
                    startContent={<SearchIcon />}/>
                <div className="flex gap-2">
                    <Button
                        endContent={<DownloadIcon />}
                        color="success"
                        onClick={exportToExcel}>
                        Exportar Excel
                    </Button>
                    <Button
                        endContent={<PlusIcon />}
                        color="primary">
                        <Link to="/form">Agregar Nuevo</Link>
                    </Button>
                </div>
            </div>
        </div>)
}