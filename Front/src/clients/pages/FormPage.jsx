import { useState } from 'react'
import { Card, CardBody, Input, CardHeader, Divider, CardFooter, Link, Select, Button, SelectItem } from '@nextui-org/react'
import { calcularPercentil, calculateImc } from '../../utils/imcUtils'
import backendApi from "../../api/backendApi"
import { useForm } from "../../hooks/useForm"

export const FormPage = () => {

    const datos = {
        nombre: '',
        apellido: '',
        genero: '',
        fecha_nacimiento: '2000-01-01',
        peso: '',
        altura: '',
    }

    const { formData, handleChange, setFormData } = useForm(datos)

    function almacenarDatos(formData) {
        const paciente = {
            nombre: formData.nombre + ' ' + formData.apellido,
            genero: formData.genero,
            fecha_nacimiento: formData.fecha_nacimiento
        }

        const historial = {
            peso: Number(formData.peso),
            altura: Number(formData.altura),
            imc: Number(IMC())
        }

        return { paciente, historial }
    }

    function fechaActual() {
        const hoy = new Date()
        const año = hoy.getFullYear()
        const mes = String(hoy.getMonth() + 1).padStart(2, '0')
        const dia = String(hoy.getDate()).padStart(2, '0')

        return `${año}-${mes}-${dia}`;
    }

    const handleSubmint = async () => {

        const { paciente, historial } = almacenarDatos(formData)

        historial.fecha_medicion = fechaActual()

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        try {
            const { data } = await backendApi.post('/paciente', paciente, config)
            historial.paciente = data.id
            setFormData(datos)
            console.log('resultado paciente', data);
        } catch (error) {
            console.error('try paciente', error);
        }

        try {            
            const { data } = await backendApi.post('/paciente/historial', historial, config)
            console.log('resultado historial', data);
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

    return (
        <>
            <div className='container mx-auto mt-8 pb-12'>
                <Card shadow='none'>
                    <CardHeader>
                        <p className='text-lg'>Registro de pacientes</p>
                    </CardHeader>
                    <Divider />
                    <CardBody className="flex gap-5">
                        <div className='flex gap-3'>
                            <Input type="text" name="nombre" value={formData.nombre} onChange={handleChange} label="Nombre(s)" isRequired />
                            <Input type="text" name="apellido" value={formData.apellido} onChange={handleChange} label="Apellidos" isRequired />
                        </div>
                        <div className='flex gap-3'>
                            <Select label="Genero" name="genero" value={formData.genero} onChange={handleChange} className="max-w-xs" isRequired>
                                <SelectItem key='H' value='Hombre'>
                                    Hombre
                                </SelectItem>
                                <SelectItem key='M' value='Mujer'>
                                    Mujer
                                </SelectItem>
                            </Select>
                            <Input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className='mainWrapper' label="Fecha de Nacimiento" defaultValue='2000-01-01' isRequired />
                            <Input type="number" name="imc" label="IMC" value={IMC()} disabled />
                        </div>
                        <div className='flex gap-3'>
                            <Input type="number" name="peso" value={formData.peso} onChange={handleChange} label="Peso" isRequired />
                            <Input type="number" name="altura" value={formData.altura} onChange={handleChange} label="Altura (cm)" isRequired />
                        </div>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <Button color="primary" onClick={handleSubmint}>Guardar</Button>
                    </CardFooter>
                </Card>
            </div>
        </>)
}