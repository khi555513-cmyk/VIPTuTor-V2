import React, { useEffect } from 'react';

interface ApiKeyModalProps {
  onSuccess: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSuccess }) => {
  useEffect(() => {
    // API Key is now handled via process.env.API_KEY.
    // This modal is deprecated and automatically calls onSuccess to proceed.
    onSuccess();
  }, [onSuccess]);

  return null;
};

export default ApiKeyModal;