// hooks/useProfile.ts
import { useState, useEffect } from "react";
import { apiService, Category } from "./api";
import { Toast } from "react-native-toast-notifications";

export const useCategories = () => {
  const [categories, setCategory] = useState<Category[] | null>(null);
  const [loadingCategories, setLoading] = useState(true);
  const [errorCategories, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCategories();
      setCategory(data);
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
    fetchCategories();
  }, []);

  return {
    categories,
    loadingCategories,
    errorCategories,
    refetch: fetchCategories,
  };
};
