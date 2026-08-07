import { useState } from 'react';

import Posts from '../../components/common/Posts';
import CreatePost from './CreatePost';

const HomePage = () => {
  const [feedType, setFeedType] = useState('forYou');

  return (
    <main className="min-w-0 flex-[4_4_0] mr-auto border-r border-white/10 min-h-screen">
      {/* Header */}
      <div className="glass-header">
        <h1 className="text-xl font-bold px-4 pt-3">Home</h1>
        <div className="flex w-full">
          <button
            type="button"
            className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative font-medium"
            onClick={() => setFeedType('forYou')}
          >
            For you
            {feedType === 'forYou' && <div className="tab-underline" />}
          </button>
          <button
            type="button"
            className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative font-medium"
            onClick={() => setFeedType('following')}
          >
            Following
            {feedType === 'following' && <div className="tab-underline" />}
          </button>
        </div>
      </div>

      {/* Create post */}
      <CreatePost />

      {/* Posts */}
      <Posts feedType={feedType} />
    </main>
  );
};

export default HomePage;
