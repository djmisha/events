import { useMemo } from 'react';
import setDates from '../../utils/setDates';

const EventStructuredData = ({ event, currentUrl }) => {
  const structuredData = useMemo(() => {
    if (!event) return null;

    const {
      id,
      name: eventName,
      artistList = [],
      venue,
      date,
      startTime,
      link,
    } = event;

    const { dayOfWeek, dayMonth, daySchema } = setDates(date);
    
    // Generate event name
    const generateEventName = () => {
      if (eventName) {
        return eventName;
      }
      
      const artistNames = artistList.slice(0, 3).map(artist => artist.name).join(', ');
      const venueName = venue?.name || 'TBA';
      
      if (artistList.length > 3) {
        return `${artistNames} + ${artistList.length - 3} more at ${venueName}`;
      } else if (artistNames) {
        return `${artistNames} at ${venueName}`;
      }
      
      return `Event at ${venueName}`;
    };

    // Generate description
    const generateDescription = () => {
      const artistNames = artistList.slice(0, 3).map(artist => artist.name).join(', ');
      const venueName = venue?.name || 'TBA';
      const readableDate = `${dayOfWeek}, ${dayMonth}`;
      
      if (artistList.length === 0) {
        return `Event at ${venueName} on ${readableDate}.`;
      }
      
      if (artistList.length > 3) {
        return `See ${artistNames} and ${artistList.length - 3} more artists perform at ${venueName} on ${readableDate}.`;
      }
      
      return `See ${artistNames} perform at ${venueName} on ${readableDate}.`;
    };

    // Generate event URL
    const generateEventUrl = () => {
      try {
        // Use sandiegohousemusic.com as the base URL structure
        const baseUrl = 'https://www.sandiegohousemusic.com';
        
        // Extract location from current URL or use a default
        let location = 'events';
        if (currentUrl) {
          const urlMatch = currentUrl.match(/\/events\/([^\/\?#]+)/);
          if (urlMatch) {
            location = `events/${urlMatch[1]}`;
          }
        }
        
        return `${baseUrl}/${location}#event-${id}`;
      } catch (error) {
        console.warn('Could not generate event URL:', error);
        return link || `https://www.sandiegohousemusic.com/events#event-${id}`;
      }
    };

    // Generate start date/time
    const generateStartDateTime = () => {
      if (!date) return null;
      
      try {
        // Create a proper date object from the event date
        const eventDate = new Date(date);
        
        // If we have a specific start time, parse and use it
        if (startTime) {
          // startTime could be in formats like "19:00:00", "19:00", or "7:00 PM"
          const timeStr = startTime.replace(/[^\d:]/g, ''); // Remove non-digit/colon chars
          const [hours, minutes = "00", seconds = "00"] = timeStr.split(":");
          eventDate.setHours(parseInt(hours) || 19, parseInt(minutes) || 0, parseInt(seconds) || 0, 0);
        } else {
          // Default to 7 PM if no start time specified
          eventDate.setHours(19, 0, 0, 0);
        }
        
        // Format as ISO string with proper timezone offset
        // This follows Google's recommended format: "2025-07-21T19:00:00-05:00"
        const year = eventDate.getFullYear();
        const month = String(eventDate.getMonth() + 1).padStart(2, '0');
        const day = String(eventDate.getDate()).padStart(2, '0');
        const hour = String(eventDate.getHours()).padStart(2, '0');
        const minute = String(eventDate.getMinutes()).padStart(2, '0');
        const second = String(eventDate.getSeconds()).padStart(2, '0');
        
        // Get timezone offset in format +/-HH:MM
        const timezoneOffset = eventDate.getTimezoneOffset();
        const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
        const offsetSign = timezoneOffset <= 0 ? '+' : '-';
        
        return `${year}-${month}-${day}T${hour}:${minute}:${second}${offsetSign}${offsetHours}:${offsetMinutes}`;
      } catch (error) {
        console.warn('Error generating start date:', error);
        // Fallback: just use the date without time if parsing fails
        return new Date(date).toISOString().split('T')[0];
      }
    };

    // Generate image URL
    const generateImageUrl = () => {
      const baseUrl = 'https://www.sandiegohousemusic.com';
      
      if (artistList.length > 0 && artistList[0].id) {
        return `${baseUrl}/images/artists/${artistList[0].id}.jpg`;
      }
      return `${baseUrl}/images/fallback-event.jpg`;
    };

    // Generate performers array
    const generatePerformers = () => {
      return artistList.map(artist => ({
        "@type": "MusicGroup",
        "name": artist.name
      }));
    };

    // Generate location object
    const generateLocation = () => {
      const location = {
        "@type": "Place",
        "name": venue?.name || "TBA"
      };

      if (venue?.address) {
        // Try to parse the address for better structured data
        const addressParts = venue.address.split(',').map(part => part.trim());
        
        location.address = {
          "@type": "PostalAddress",
          "streetAddress": addressParts[0] || "",
          "addressLocality": venue.location?.split(',')[0]?.trim() || "",
          "addressRegion": venue.state || "",
          "addressCountry": venue.country || "United States"
        };
      }

      if (venue?.latitude && venue?.longitude) {
        location.geo = {
          "@type": "GeoCoordinates",
          "latitude": venue.latitude,
          "longitude": venue.longitude
        };
      }

      return location;
    };

    const schema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": generateEventName(),
      "startDate": generateStartDateTime(),
      "location": generateLocation(),
      "url": generateEventUrl(),
      "image": [generateImageUrl()],
      "description": generateDescription(),
      "performer": generatePerformers(),
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
    };

    // Add end date if we can infer it (same day, late night)
    if (date) {
      try {
        const eventDate = new Date(date);
        // Assume most events end around 11 PM on the same day
        eventDate.setHours(23, 0, 0, 0);
        
        // Format end date with same timezone formatting as start date
        const year = eventDate.getFullYear();
        const month = String(eventDate.getMonth() + 1).padStart(2, '0');
        const day = String(eventDate.getDate()).padStart(2, '0');
        const hour = String(eventDate.getHours()).padStart(2, '0');
        const minute = String(eventDate.getMinutes()).padStart(2, '0');
        const second = String(eventDate.getSeconds()).padStart(2, '0');
        
        // Get timezone offset in format +/-HH:MM
        const timezoneOffset = eventDate.getTimezoneOffset();
        const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
        const offsetSign = timezoneOffset <= 0 ? '+' : '-';
        
        schema.endDate = `${year}-${month}-${day}T${hour}:${minute}:${second}${offsetSign}${offsetHours}:${offsetMinutes}`;
      } catch (error) {
        console.warn('Error generating end date:', error);
        // Skip end date if there's an error
      }
    }

    // Add offers/ticket info if available
    if (link) {
      schema.offers = {
        "@type": "Offer",
        "url": generateEventUrl(),
        "availability": "https://schema.org/InStock"
      };
    }

    return schema;
  }, [event, currentUrl]);

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
};

export default EventStructuredData;
