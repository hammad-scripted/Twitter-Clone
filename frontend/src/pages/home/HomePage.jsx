import { useState } from "react";

// import Posts from "../../components/common/Posts";
// import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/*  CREATE POST INPUT */}
				<div className='border-b border-gray-700 p-4'>
					<textarea
						className='textarea textarea-bordered w-full resize-none rounded bg-base-200 text-base'
						placeholder='What is happening?!'
						rows='3'
					/>
					<div className='mt-3 flex justify-end'>
						<button className='btn btn-primary btn-sm rounded-full px-5 text-white'>Post</button>
					</div>
				</div>

				{/* POSTS */}
				<div className='p-6 text-center text-gray-400'>
					No posts yet. Your feed will appear here.
				</div>
			</div>
		</>
	);
};
export default HomePage;
