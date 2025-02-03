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
      const data = await apiService.getAvatar(avatarId);
      if (typeof data === 'string') {
        setAvatar(data);
        setError(null);
      } else {
        throw new Error('Invalid avatar data format');
      }
    } catch (err) {
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
    ? { uri: `data:image/jpeg;base64,${avatar}` }
    : require("../../assets/icon.jpg");

  return { 
    avatar, 
    loadingAvatar, 
    errorAvatar, 
    avatarSource,
    refetchAvatar: fetchAvatar 
  };
}; 