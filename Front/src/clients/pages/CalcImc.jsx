import { useEffect, useState } from 'react';
import { Card, CardBody, Input, CardHeader, Divider, CardFooter, Link, Select, Button, SelectItem } from '@nextui-org/react';
import backendApi from '../../api/backendApi';
import { calcularPercentil, calculateImc } from '../../utils/imcUtils';

export const CalcImc = () => {
  const [imc, setImc] = useState({});
  const [gender, setGender] = useState('boy');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numimc = calculateImc(weight, height);
    let info = {};
    if (gender === 'boy') {
        info = calcularPercentil(age, numimc, imc.boy);
    }else{
        info = calcularPercentil(age, numimc, imc.girl);
    }
    console.log(info);
  };

  const fetchImc = async () => {
    try {
      const response = await backendApi.get(`/paciente/percentil/imc`);
      setImc(response.data);
      console.log("A");
    } catch (error) {
      console.error("Error al obtener el paciente:", error);
    }
  };

  useEffect(() => {
    fetchImc();
  }, []);

  return (
    <div className='container mx-auto pt-8'>
      <Card shadow='none'>
        <CardHeader>
          <h1>Calcular IMC - Niños y Adolescentes</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className="input-row">
              <label htmlFor="gender">Sexo:</label>
              <div>
                <input type='radio' id="gender" name="gender" value="boy" onChange={(e) => setGender(e.target.value)} checked={gender === 'boy'}/>
                <label htmlFor="gender" className="gender-label">Niño</label>
                <input type='radio' id="gender" name="gender" value="girl" onChange={(e) => setGender(e.target.value)} checked={gender === 'girl'}/>
                <label htmlFor="gender" className="gender-label">Niña</label>
              </div>
            </div>
            <Input
              type="number"
              placeholder="Edad (años)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Estatura (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Peso (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <Button type="submit">Calcular</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};