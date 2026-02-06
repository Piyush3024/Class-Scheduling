import { useEffect } from 'react';
import { useClassStore } from '@/store/useClassStore';

export const useClasses = () => {
  const { 
    classes, 
    loading, 
    error, 
    fetchClasses,
    createClass,
    updateClass,
    deleteClass 
  } = useClassStore();

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    loading,
    error,
    createClass,
    updateClass,
    deleteClass,
  };
};