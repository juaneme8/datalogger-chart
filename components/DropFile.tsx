import { useState } from 'react';
import { CSVReader } from 'react-papaparse';
import Chart from './Chart';
export default function DropFile() {
	const [data, setData] = useState([]);

	const handleOnDrop = (fileData:any) => {
		setData(fileData);
	};

	const handleOnError = (err:any, file:any, inputElem:any, reason:any) => {
		console.log(err);
	};

	const handleOnRemoveFile = (fileData:any) => {
		console.log(fileData);
	};

	return (
		<div>

		<h5>Archivo de Eventos </h5>
				
			<CSVReader
				onDrop={handleOnDrop}
				onError={handleOnError}
				addRemoveButton
				onRemoveFile={handleOnRemoveFile}
				style={{
					dropArea: {
						borderRadius: 20,
						margin: 0,
						marginTop: 0,
						padding: 10,
					},
					dropFile: {
						width: 90,
						height: 80,
						background: '#ccc',
					},
					fileSizeInfo: {
						padding: 0,
						backgroundColor: 'transparent',
						fontSize: 12,
					},
					fileNameInfo: {
						borderRadius: 3,
						fontSize: 12,
						lineHeight: 1,
						padding: '0 0.4em',
					},
				}}
			>
				<span>Arrastre aqui el archivo de eventos</span>
			</CSVReader>
			<Chart chartData={data} />
		</div>
	);
}
