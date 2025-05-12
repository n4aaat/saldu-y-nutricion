import { Chart } from 'chart.js/auto';
import { useMemo, useState } from "react"
import { Line } from "react-chartjs-2";

export const LineChart = ({ info }) => {
	const [percentil, setPercentil] = useState([])
	const customLegend = {
		id: 'customLegend',
		afterDraw: (chart, args, pluginOptions) => {
			const { ctx, data, chartArea: {right}, scales: {x,y}} = chart
			ctx.save()
			data.datasets.forEach((dataset, index) => {
				if(index !== 0){
					ctx.font = 'bolder 10px Arial'
					ctx.fillText(dataset.label, right + 5, chart.getDatasetMeta(index).data[217].y)
				}
			})
		}
	}
	
	
	useMemo(() => {
		Chart.register(customLegend)
		const dataKeys = Object.keys(info.percentiles);
		const datas = [{
			label: "Paciente",
			data: info.historial.map(({ edad_decimal, peso, altura, imc }) => ({
				x: parseFloat(edad_decimal),
				y: parseFloat((info.type === "peso") ? peso : (info.type === "altura") ? altura : imc)
			  })),
			borderColor: 'rgb(97, 106, 107)',
			backgroundColor: 'rgb(66, 73, 73)',
			pointRadius: 3,
			interaction: {
			  hover: false
			},
			borderDash: [5,5]
		}]

		dataKeys.map((name) => {
			datas.push({
				label: name,
				data: info.percentiles[name],
				borderColor: info.genero === 'hombre' ? 'rgba(102, 170, 249, 0.3)' : 'rgba(255, 149, 225, 0.3)',
				backgroundColor: info.genero === 'hombre' ? 'rgba(102, 170, 249, 0.3)' : 'rgba(255, 149, 225, 0.3)',
				tension: 0.3,
				pointRadius: 0,
				interaction: {
				  hover: false
				}
			})
		})
		
		setPercentil(datas)
	}, [info])
	
	return <Line data={{
		datasets: percentil
	}} options={{
		scales: {
			x: {
				type:'linear',
				beginAtZero: false,
				title: {
					display: true,
					text: 'Edad (Años)'
				},
				ticks: {
					stepSize: 1
				}
			},
			y: {
				title: {
					display: true,
					text: info.label
				}
			}
		},
		responsive: true,
		plugins: {
			legend: {
				display: false,
				position: 'top',
				align: 'center',
				labels: {
					usePointStyle: true,
					padding: 20,
				},
			}
		},
		layout: {
			padding: {
				right: 25
			}
		}
	}} />
}