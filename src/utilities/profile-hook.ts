import { useState, useEffect } from "react";
import { apiService, UserProfile } from "./api";
import { Toast } from "react-native-toast-notifications";

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoading] = useState(true);
  const [errorProfile, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUserProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch profile");
      Toast.show("Failed to load profile", {
        type: "error",
        placement: "top",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loadingProfile, errorProfile, refetch: fetchProfile };
};
