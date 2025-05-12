/**
 * Calcula el percentil del índice de masa corporal (IMC) de una persona en función de su edad y valor de IMC.
 *
 * @param {number} edad - La edad de la persona.
 * @param {number} imc - El valor del IMC de la persona.
 * @param {object} percentil - Un objeto que contiene los percentiles de IMC para diferentes grupos de edad.
 * @return {object} Un objeto que contiene el percentil calculado, la categoría (por ejemplo, "Saludable", "Sobrepeso", etc.) y el color asociado a la categoría.
 */
export function calcularPercentil(edad, imc, percentil) {
    var imcPercentiles = percentil
    let percentilCercano = null;
    let distanciaMinima = Infinity;

    for (let percentil in imcPercentiles) {
        let datosPercentil = imcPercentiles[percentil];

        let percentilEncontrado = datosPercentil.reduce((prev, curr) => {
            if (Math.abs(curr.x - edad) < Math.abs(prev.x - edad)) {
                return curr;
            } else {
                return prev;
            }
        });

        let distancia = Math.abs(imc - percentilEncontrado.y);

        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            percentilCercano = percentil;
        }
    }

    let categoria = '';
    let color = '';

    if (percentilCercano === 'p5') {
        if (imc < imcPercentiles[percentilCercano][0].y) {
            categoria = 'Bajo Peso';
            color = 'warning';
        } else {
            categoria = 'Peso Saludable';
            color = 'success';
        }
    } else if (percentilCercano === 'p85') {
        categoria = 'Sobrepeso';
        color = 'warning';
    } else if (percentilCercano === 'p95') {
        categoria = 'Obesidad';
        color = 'danger';
    } else {
        categoria = 'Peso Saludable';
        color = 'success';
    }

    return {
        percentil: percentilCercano,
        categoria: categoria,
        color: color
    }
}

export const calculateImc = (peso, altura) => {
    const imc = peso / ((altura / 100) ** 2) // Convertir altura de cm a metros
    return imc.toFixed(2) // Redondear a 2 decimales
}

export const calcularEdad = (fechaNacimientoO, fechaActual) => {
    fechaActual = new Date();
    const fechaNacimiento = fechaNacimientoO;
    const diaActual = fechaActual.getDate();
    const mesActual = fechaActual.getMonth() + 1; // Los meses se indexan desde 0

    const diaNacimiento = fechaNacimiento.getDate();
    const mesNacimiento = fechaNacimiento.getMonth() + 1;
    const anioNacimiento = fechaNacimiento.getFullYear();

    let edadAnios = fechaActual.getFullYear() - anioNacimiento;
    let edadMeses = mesActual - mesNacimiento;
    let edadDias = diaActual - diaNacimiento;

    // Ajustar la edad si los meses o los días aún no se han alcanzado en el año actual
    if (edadMeses < 0 || (edadMeses === 0 && edadDias < 0)) {
      edadAnios--;
      edadMeses += 12;
    }

    if (edadDias < 0) {
      const ultimoDiaMesAnterior = new Date(anioNacimiento, mesNacimiento - 1, 0).getDate();
      edadDias += ultimoDiaMesAnterior;
      edadMeses--;
    }

    // Calcular la edad en decimales
    const diasEnAnioActual = (new Date(anioNacimiento, 11, 31).getTime() - new Date(anioNacimiento, 0, 1).getTime()) / (1000 * 60 * 60 * 24);
    let edadDecimal = (edadDias + (edadMeses * 30) + (edadAnios * diasEnAnioActual)) / diasEnAnioActual;

    return {
      anios: edadAnios,
      meses: edadMeses,
      dias: edadDias,
      decimal: edadDecimal.toFixed(2)
    };
  }