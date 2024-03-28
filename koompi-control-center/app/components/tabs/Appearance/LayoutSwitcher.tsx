import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LayoutSwitcher: React.FC = () => {
  const [activeImage, setActiveImage] = useState<number | null>(null);

  useEffect(() => {
    const savedLayout = localStorage.getItem('activeImage');
    if (savedLayout) {
      setActiveImage(parseInt(savedLayout, 10));
    }
  }, []);

  const handleImageClick = async (imageId: number) => {
    setActiveImage(imageId);
    localStorage.setItem('activeImage', imageId.toString());
    let command = '';
    let logout_command = 'loginctl kill-user $USER';
    if (imageId === 1) {
      command = 'pizard set layout1';
    } else if (imageId === 2) {
      command = 'pizard set layout2';
    }
    // Check if the desktop layout is already set
    if (activeImage === imageId) {
      toast.error('Desktop Layout is already set');

      return;
    }
    // Execute Linux command using Tauri
    try {
      await invoke('execute_command', { command });
      console.log('Layout changed successfully');
      toast.success('Desktop Layout changed successfully');
      invoke('execute_command', { logout_command });
    } catch (error) {
      console.error(`Error executing command: ${error}`);
      toast.error('Failed to change desktop layout');
    }
  };
  return (
    <div className="space-y-1 justify-center">
      <img
        src="/layout1.png"
        alt="layout1"
        width={500}
        height={400}
        className={`cursor-pointer ${
          activeImage === 1 ? 'border-4 border-blue-700 rounded' : ''
        }`}
        onClick={() => handleImageClick(1)}
      />
      <img
        src="/layout2.png"
        alt="layout1"
        width={500}
        height={400}
        className={`cursor-pointer ${
          activeImage === 2 ? 'border-4 border-blue-700 rounded' : ''
        }`}
        onClick={() => handleImageClick(2)}
      />
      <ToastContainer />
    </div>
  );
};

export default LayoutSwitcher;
