
export function DateSection(date) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const formattedDate = `${date.getDate()} ${months[date.getMonth()]} at ${formatTime(date)}`;

  function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${amOrPm}`;
  }

  const currentDate = new Date();
  const timeDiffInSeconds = Math.floor((currentDate - date) / 1000); // Get the time difference in seconds

  let timeAgo;
  if (timeDiffInSeconds < 60) {
    timeAgo = `${timeDiffInSeconds}s`;
  } else if (timeDiffInSeconds < 3600) {
    timeAgo = `${Math.floor(timeDiffInSeconds / 60)}m`;
  } else if (timeDiffInSeconds < 86400) {
    const hours = Math.floor(timeDiffInSeconds / 3600);
    timeAgo = `${hours}h`;
  } else if (timeDiffInSeconds < 604800) {
    const days = Math.floor(timeDiffInSeconds / 86400);
    if (days >= 7) {
      const weeks = Math.floor(days / 7);
      timeAgo = `${weeks}w`;
    } else {
      timeAgo = `${days}d`;
    }
  } else if (timeDiffInSeconds < 2592000) {
    const weeks = Math.floor(timeDiffInSeconds / 604800);
    timeAgo = `${weeks}w`;
  } else if (timeDiffInSeconds < 31536000) {
    const months = Math.floor(timeDiffInSeconds / 2592000);
    timeAgo = `${months}mo`;
  } else {
    const years = Math.floor(timeDiffInSeconds / 31536000);
    timeAgo = `${years}y`;
  }

  return (
    timeAgo
  );
}
export function DateFormatted(date) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const formattedDate = `${date.getDate()} ${months[date.getMonth()]} at ${formatTime(date)}`;
  
    function formatTime(date) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const amOrPm = hours >= 12 ? "PM" : "AM";
      hours %= 12;
      hours = hours || 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${minutes} ${amOrPm}`;
    }
  
  
    return (
      formattedDate
    );
  }
  

