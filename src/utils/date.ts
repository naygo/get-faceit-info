export function formatEpochDate(epochDate: number) {
    const date = new Date(epochDate * 1000);
  
    // Use Date methods to get the various date and time components.
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1.
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    // Create a formatted date and time string.
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }