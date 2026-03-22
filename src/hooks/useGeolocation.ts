import { useEffect, useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

export function useGeolocation() {
  const [currentPos, setCurrentPos] = useState<GeolocationPosition | null>(null);
  const locations = useSettingsStore(state => state.settings.locations);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      pos => setCurrentPos(pos),
      err => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { currentPos, trackedLocations: locations };
}
