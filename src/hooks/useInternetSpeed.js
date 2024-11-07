import { useState, useEffect, useCallback } from 'react';

const useInternetSpeed = () => {
  const [responseTime, setResponseTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkInternetSpeed = useCallback(async () => {
    setLoading(true);
    const startTime = new Date().getTime();

    try {
      const response = await fetch('https://www.google.com', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        const endTime = new Date().getTime();
        const timeTaken = endTime - startTime;
        setResponseTime(timeTaken);
      } else {
        setResponseTime('Failed to fetch');
      }
    } catch (error) {
      setResponseTime('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkInternetSpeed();
    const interval = setInterval(checkInternetSpeed, 60000); // Check every 60 seconds
    return () => clearInterval(interval);
  }, [checkInternetSpeed]);

  return { responseTime, loading };
};

export default useInternetSpeed;
