import { useState, useMemo, useEffect, useCallback } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	User,
	Tooltip,
	AvatarIcon,
} from "@nextui-org/react";
import { TablePagination } from "../components/TablePagination";
import backendApi from "../../api/backendApi";
import { TableTop } from "../components/TableTop";
import { EyeIcon } from "../../assets/icons/EyeIcon";
import { DeleteIcon } from "../../assets/icons/DeleteIcon";
import { Link } from "react-router-dom";

const eliminarPaciente = async (id, onSuccess) => {	
	try {
		const response = await backendApi.delete(`/paciente/${id}`);
		console.log('Eliminar Paciente', response.data)
		onSuccess();
	} catch (error) {
		console.error("Error al eliminar el paciente:", error);
	}
};

export const UserPage = () => {
	const [listUser, setListUser] = useState()
	const [sortDescriptor, setSortDescriptor] = useState({
		column: "nombre",
		direction: "descending",
	})

	const fetchPaciente = async () => {
		try {
			const response = await backendApi.get(`/paciente`);
			console.log(response.data)
			setListUser(response.data);
		} catch (error) {
			console.error("Error al obtener el paciente:", error);
		}
	};

	useEffect(() => {		
		fetchPaciente();		
	}, []);

	const users = listUser || [];
	const [page, setPage] = useState(1)
	const rowsPerPage = 10;
	const pages = Math.ceil(users.length / rowsPerPage)

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return users.slice(start, end);
	}, [page, users]);

	const sortedItems = useMemo(() => {
		return [...items].sort((a, b) => {
			const first = a[sortDescriptor.column];
			const second = b[sortDescriptor.column];
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, items]);

	const columns = [
		{ name: "Nombre", uid: "nombre", sortable: true },
		{ name: "Genero", uid: "genero", sortable: true },
		{ name: "Peso", uid: "peso_actual", sortable: true },
		{ name: "Altura", uid: "altura_actual", sortable: true },
		{ name: "Acciones", uid: "actions" },
	];

	const renderCell = useCallback((user, columnKey) => {
		const cellValue = user[columnKey];

		switch (columnKey) {
			case "nombre":
				return (
					<User
						avatarProps={{
							radius: "lg",
							classNames: {
								base: (user.genero === "hombre") ? "bg-blue-300" : "bg-pink-300"
							},
							icon:(<AvatarIcon />)
						}}
						description={`${user.edad_actual.anios} años`}
						name={cellValue}
					>
						{cellValue}
					</User>
				)
			case "genero":
				return <p>{cellValue}</p>
			case "altura_actual":
				return <p>{cellValue}</p>
			case "peso_actual":
				return <p>{cellValue}</p>
			case "actions":
				return (
					<div className="relative flex items-center gap-2">
						<Tooltip content="Detalles">
							<span className="text-lg text-default-400 cursor-pointer active:opacity-50">
								<Link to={'/dashboard/user/'+user.id}><EyeIcon /></Link>
							</span>
						</Tooltip>
						<Tooltip color="danger" content="Eliminar">
							<span onClick={() => eliminarPaciente(user.id, fetchPaciente)} className="text-lg text-danger cursor-pointer active:opacity-50">
								<DeleteIcon />
							</span>
						</Tooltip>
					</div>
				)
		}
	})

	return (
		<div className='container mx-auto mt-8'>
			<Table
				aria-label="Tabla de usuarios"
				isHeaderSticky
				shadow="none"
				selectionMode="single"
				topContent={<TableTop />}
				topContentPlacement="outside"
				sortDescriptor={sortDescriptor}
				onSortChange={setSortDescriptor}
				bottomContent={
					<TablePagination
						page={page}
						pages={pages}
						onPageChange={setPage} />
				}
				bottomContentPlacement="outside">
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
							key={column.uid}
							align={column.uid === "actions" ? "center" : "start"}
							allowsSorting={column.sortable}>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody emptyContent={"No se encontraron usuarios"} items={sortedItems}>
					{(item) => (
						<TableRow key={item.key}>
							{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}