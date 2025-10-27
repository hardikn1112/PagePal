'use client'
import * as React from 'react';
import {Upload} from 'lucide-react';
import Loader from './Loader';

const FileUpload: React.FC = () => {

	const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
	const [isProcessing, setIsProcessing] = React.useState<boolean>(false);

	const pollJobStatus = async (jobId: string) => {
		const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
		for(;;){
			try{
				const res = await fetch(`http://localhost:8000/status/${jobId}`);
				if(!res.ok){
					await sleep(1000);
					continue;
				}
				const data = await res.json();
				if(data.status === 'completed'){
					return true;
				}
				if(data.status === 'failed' || data.status === 'error' || data.status === 'not_found'){
					return false;
				}
				await sleep(1000);
			}catch{
				await sleep(1000);
			}
		}
	}

	const handleFileUpload = () => {
		const el = document.createElement('input');
		el.setAttribute('type', 'file');
		el.setAttribute('accept', 'application/pdf');
		el.addEventListener('change', async (ev) =>{
			if(el.files && el.files.length >0) {
				const file = el.files.item(0);
				if(file){
					const formData = new FormData();
					formData.append('pdf', file);  

					setIsProcessing(true);
					const res = await fetch('http://localhost:8000/upload/pdf', {
						method: 'POST',
						body: formData
					});
					const payload = await res.json();
					console.log('File Uploaded');
					const ok = await pollJobStatus(payload.jobId);
					setIsProcessing(false);
					if(ok){
						setPdfUrl(URL.createObjectURL(file));
					}
				}			  
			}
		});
		el.click();
	}

	if (isProcessing) {
		return (
			<div className='w-full h-[85vh] rounded-lg border-white border-2 flex items-center justify-center bg-white'>
				<Loader />
			</div>
		);
	}

	if (pdfUrl) {
		return (
			<div className='w-full h-full'>
				<iframe src={pdfUrl} className='w-full h-[85vh] rounded-lg border-white border-2' />
			</div>
		);
	}

	return (
		<div className='bg-slate-800 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-white border-2'>
			<div onClick={handleFileUpload} className='flex justify-center items-center flex-col'>
				<h3>Upload PDF File</h3>
				<div className='pt-2'>
					<Upload />
				</div>
			</div>
		</div>
	);

}

export default FileUpload;