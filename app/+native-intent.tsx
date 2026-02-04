import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function NativeIntent() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
}
