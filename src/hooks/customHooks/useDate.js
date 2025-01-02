import { useEffect, useState } from "react";

export function useCurrentDateTime() {
    const [currentDateTime, setCurrentDateTime] = useState({
      date: '',
      time: '',
      month: '',
      year: ''
    });
    
    useEffect(() => {
        const updateDateTime = () => {
          const now = new Date();
          const date = now.getDate(); // Day of the month
          const time = now.toLocaleTimeString(); // Time in HH:MM:SS format
          const month = now.toLocaleString('default', { month: 'long' }); // Month name
          const year = now.getFullYear(); // Year
    
          setCurrentDateTime({ date, time, month, year });
        };

        updateDateTime()
    
        // Update every second to keep time current
        // const intervalId = setInterval(updateDateTime, 1000);
    
        // // Cleanup interval on unmount
        // return () => clearInterval(intervalId);
      }, []); // Empty dependency array ensures it runs only once when the component mounts


      return currentDateTime;
}  