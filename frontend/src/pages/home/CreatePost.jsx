import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { CiImageOn } from 'react-icons/ci';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { IoCloseSharp } from 'react-icons/io5';

import { apiRequest, getAuthUser, getImageUrl } from '../../utils/api';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [imgFile, setImgFile] = useState(null);

  const imgRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ['authUser'], queryFn: getAuthUser });
  const { data: imageVersion = 0 } = useQuery({
    queryKey: ['profileImageVersion'],
    queryFn: () => queryClient.getQueryData(['profileImageVersion']) || 0,
    staleTime: Infinity,
  });
  const {
    mutate: createPost,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('text', text);
      if (imgFile) formData.append('Img', imgFile);

      return apiRequest('/api/posts/create', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      setText('');
      setImg(null);
      setImgFile(null);
      if (imgRef.current) imgRef.current.value = null;
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost();
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={getImageUrl(authUser?.profileImg, imageVersion)} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                setImgFile(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button
            className="btn btn-primary rounded-full btn-sm text-white px-4"
            disabled={isPending}
          >
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};

export default CreatePost;
