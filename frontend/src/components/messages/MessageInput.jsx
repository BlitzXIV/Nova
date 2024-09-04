import { BsSend } from "react-icons/bs";
import { useState } from "react";
import useSendMessage from "../../hooks/useSendMessage";


const MessageInput = () => {
	const [message , setMessage] = useState("");
	const{loading, sendMessage} = useSendMessage();
	const handleSubmit = async (e) => {
		e.preventDefault();
		if(!message) return;
		await sendMessage(message);
		setMessage("")
	};

	return (
		<form className=' flex  pl-4 my-3' onSubmit={handleSubmit}>
			<div className='w-[90%] transform translate-y-1 h-fill relative'>
				<textarea
					type='text'
					maxLength={250}
					className=' overflow-hidden border text-sm rounded-lg block w-full h-10 max-h-40 p-2.5  bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				
			</div>
			<div className=' pl-3 justify-center items-center transform -translate- '>
				<button type='submit' className="btn btn-circle bg-sky-500 text-white">
					{loading ? <div className="loading loading-spinner"></div> :  <BsSend />}
				</button>
			</div>		
		</form>
	);
};
export default MessageInput;