/**
 * Transform event data from the new SDHM API format to the legacy format
 * expected by the rest of the application
 */
export function transformEventData(newEvent) {
  if (!newEvent) return null;

  return {
    id: newEvent.id,
    link: newEvent.link,
    name: newEvent.name,
    ages: newEvent.ages,
    festivalInd: newEvent.festivalind,
    livestreamInd: newEvent.livestreamind,
    electronicGenreInd: newEvent.electronicgenreind,
    otherGenreInd: newEvent.othergenreind,
    date: newEvent.date,
    startTime: newEvent.starttime,
    endTime: newEvent.endtime,
    createdDate: newEvent.createddate,
    venue: {
      id: newEvent.venue.id,
      name: newEvent.venue.name,
      location: newEvent.venue.location,
      address: newEvent.venue.address,
      state: newEvent.venue.state,
      country: newEvent.venue.country,
      latitude: newEvent.venue.latitude,
      longitude: newEvent.venue.longitude,
    },
    artistList:
      newEvent.artistlist?.map((artist) => ({
        id: artist.id,
        name: artist.name,
        link: artist.link,
        b2bInd: artist.b2bInd,
      })) || [],
    eventSource: newEvent.source,
    isVisible: true,
    formattedDate: formatEventDate(newEvent.date),
  };
}

/**
 * Transform an array of events from new format to legacy format
 */
export function transformEventsArray(newEvents) {
  if (!Array.isArray(newEvents)) return [];

  return newEvents.map(transformEventData).filter(Boolean);
}

/**
 * Format date string to match the legacy format
 */
function formatEventDate(dateString) {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    const options = { weekday: "long", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}
