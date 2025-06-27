import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing event modal state with URL hash integration
 * Handles opening/closing modals and syncing with URL hash fragments
 * 
 * @param {number} eventId - The ID of the event this hook manages
 * @param {number|null} openEventId - The currently open event ID from parent
 * @param {function} setOpenEventId - Function to update the parent's open event ID
 * @returns {object} - Object containing modal state and handlers
 */
export const useEventModal = (eventId, openEventId, setOpenEventId) => {
  // Parse hash from URL to get event ID
  const parseEventIdFromHash = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    const hash = window.location.hash;
    const match = hash.match(/^#event-(.+)$/);
    if (match) {
      const eventIdStr = match[1];
      const eventId = parseInt(eventIdStr);
      return !isNaN(eventId) ? eventId : null;
    }
    return null;
  }, []);

  // Update URL hash with event ID
  const updateUrlHash = useCallback((eventId) => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentUrl = new URL(window.location);
      if (eventId) {
        currentUrl.hash = `event-${eventId}`;
      } else {
        currentUrl.hash = '';
      }
      window.history.pushState(null, '', currentUrl);
    } catch (error) {
      console.warn('Could not update URL hash:', error);
    }
  }, []);

  // Open modal for this event
  const openModal = useCallback(() => {
    setOpenEventId(eventId);
    updateUrlHash(eventId);
  }, [eventId, setOpenEventId, updateUrlHash]);

  // Close modal
  const closeModal = useCallback(() => {
    setOpenEventId(null);
    updateUrlHash(null);
  }, [setOpenEventId, updateUrlHash]);

  // Check if this specific event should be open
  const isModalOpen = openEventId === eventId;

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
};

/**
 * Hook for managing multiple event modals (for parent components)
 * Handles the shared state across multiple EventCard components
 * 
 * @returns {object} - Object containing shared modal state and handlers
 */
export const useEventModalManager = () => {
  const [openEventId, setOpenEventId] = useState(null);

  // Parse hash from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hash = window.location.hash;
    const match = hash.match(/^#event-(.+)$/);
    if (match) {
      const eventIdStr = match[1];
      const eventId = parseInt(eventIdStr);
      if (!isNaN(eventId)) {
        setOpenEventId(eventId); // Store as number
      }
    }
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#event-(.+)$/);
      if (match) {
        const eventIdStr = match[1];
        const eventId = parseInt(eventIdStr);
        setOpenEventId(!isNaN(eventId) ? eventId : null); // Store as number
      } else {
        setOpenEventId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return {
    openEventId,
    setOpenEventId,
  };
};
