import { create } from 'zustand'; // Importing the zustand library

interface useStoreModalStore {
  isOpen: boolean; // State to check if the modal is open
  onOpen: () => void; // Function to open the modal
  onClose: () => void; // Function to close the modal
}

export const useStoreModal = create<useStoreModalStore>((set) => ({
  isOpen: false, // Initial state: modal is closed
  onOpen: () => set({ isOpen: true }), // Opens the modal
  onClose: () => set({ isOpen: false }), // Closes the modal
}));
