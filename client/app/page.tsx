import FileUpload from './components/fileUpload';
import ChatScreen from './components/chat';

export default function Home() {
	return (<div>
		<div className="min-h-screen w-screen flex">
			<div className="w-[35vw] min-h-screen p-4 flex justify-center items-center">
				<FileUpload />
			</div>
			<div className="w-[65vw] min-h-screen border-l-2">
				<ChatScreen/>
			</div>
		</div>

	</div>);
}
