import { Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const SearchInput = () => {
	const [search, setSearch] = useState("");
    const {users,setSelectedUser} = useChatStore()
	// const { setSelectedConversation } = useConversation();
	// const { conversations } = useGetConversations();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!search) return;
		if (search.length < 2) {
			return toast.error("Search term must be at least 3 characters long");
		}
        console.log(users)

		const conversation = users.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

		if (conversation) {
			setSelectedUser(conversation);
			setSearch("");
		} else toast.error("No such user found!");
	};
	return (
		<form onSubmit={handleSubmit} className='flex gap-1 '>
			<input
				type='text' 
				placeholder='Search…'
				className='input input-bordered rounded-full w-45 h-7 mt-2 -ml-3 hidden sm:block'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<button type='submit' className='btn btn-circle bg-sky-500 text-white btn-sm mt-1  hidden sm:block'>
				<Search  className="w-2 h-2"/>
			</button>
		</form>
	);
};
export default SearchInput;

// STARTER CODE SNIPPET
// import { IoSearchSharp } from "react-icons/io5";

// const SearchInput = () => {
// 	return (
// 		<form className='flex items-center gap-2'>
// 			<input type='text' placeholder='Search…' className='input input-bordered rounded-full' />
// 			<button type='submit' className='btn btn-circle bg-sky-500 text-white'>
// 				<IoSearchSharp className='w-6 h-6 outline-none' />
// 			</button>
// 		</form>
// 	);
// };
// export default SearchInput;