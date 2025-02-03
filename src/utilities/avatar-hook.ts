import { useState, useEffect } from "react";
import { apiService } from "./api";

export const useAvatar = (avatarId: string | null) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loadingAvatar, setLoading] = useState(true);
  const [errorAvatar, setError] = useState<string | null>(null);

  const fetchAvatar = async () => {
    if (!avatarId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.getAvatar(avatarId);
      
      if (response) {
        // Конвертируем ArrayBuffer в base64
        const bytes = new Uint8Array(response);
        let binary = '';
        bytes.forEach(byte => binary += String.fromCharCode(byte));
        const base64 = btoa(binary);
        
        setAvatar(`data:image/jpeg;base64,${base64}`);
        setError(null);
      } else {
        throw new Error('No avatar data received');
      }
    } catch (err) {
      console.error('Avatar fetch error:', err);
      setError("Failed to fetch avatar");
      setAvatar(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [avatarId]);

  const avatarSource = avatar 
    ? { uri: avatar }
    : require("../../assets/icon.jpg");

  return { 
    avatar, 
    loadingAvatar, 
    errorAvatar, 
    avatarSource,
    refetchAvatar: fetchAvatar 
  };
}; 