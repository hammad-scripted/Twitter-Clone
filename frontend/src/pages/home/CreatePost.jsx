import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { CiImageOn } from 'react-icons/ci';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { IoCloseSharp } from 'react-icons/io5';

import { apiRequest, getAuthUser, getImageUrl } from '../../utils/api';
import { useImageVersion } from '../../hooks/useImageVersion';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [imgFile, setImgFile] = useState(null);

  const imgRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ['authUser'], queryFn: getAuthUser });
  const imageVersion = useImageVersion();
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
    if (!text.trim() && !imgFile) {
      toast.error('Add some text or an image first');
      return;
    }
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
    <div className="flex p-4 items-start gap-3 border-b border-white/10">
      <div className="avatar">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={getImageUrl(authUser?.profileImg, imageVersion)}
            className="w-full h-full object-cover"
            alt={authUser?.fullName}
          />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea min-h-24 w-full bg-transparent p-0 text-xl resize-none border-none focus:outline-none"
          placeholder="What’s happening?"
          maxLength={280}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <button type="button" aria-label="Remove image" className="absolute right-2 top-2 z-10 icon-button bg-black/70 text-white"
              onClick={() => {
                setImg(null);
                setImgFile(null);
                imgRef.current.value = null;
              }}><IoCloseSharp className="h-5 w-5" /></button>
            <img
              src={img}
              className="w-full mx-auto max-h-80 object-contain rounded-2xl border border-white/10"
              alt="Post preview"
            />
          </div>
        )}

        <div className="flex justify-between items-center border-t pt-3 border-t-white/10">
          <div className="flex gap-1 items-center">
            <button type="button" aria-label="Add image" className="icon-button" onClick={() => imgRef.current.click()}><CiImageOn className="fill-primary w-6 h-6" /></button>
            <BsEmojiSmileFill aria-hidden="true" className="fill-primary w-5 h-5 opacity-40" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">{text.length}/280</span>
            <button className="btn btn-primary rounded-full btn-sm text-white px-5" disabled={isPending || (!text.trim() && !imgFile)}>
              {isPending ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};

export default CreatePost;
