
-- Create locations table first
CREATE TABLE locations (
    id BIGINT PRIMARY KEY,
    city VARCHAR(255),
    state VARCHAR(255) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create venues table
CREATE TABLE venues (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    address TEXT,
    state VARCHAR(100),
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    location_id BIGINT,
    CONSTRAINT fk_location FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- Create events table
CREATE TABLE events (
    id BIGINT PRIMARY KEY,
    event_name VARCHAR(255),
    event_link TEXT,
    ages VARCHAR(50),
    is_festival BOOLEAN DEFAULT false,
    is_livestream BOOLEAN DEFAULT false,
    is_electronic BOOLEAN DEFAULT false,
    is_other_genre BOOLEAN DEFAULT false,
    event_date DATE,
    start_time TIME,
    end_time TIME,
    created_date TIMESTAMP WITH TIME ZONE,
    venue_id BIGINT,
    location_id BIGINT,
    CONSTRAINT fk_venue FOREIGN KEY (venue_id) REFERENCES venues(id),
    CONSTRAINT fk_location FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- Create artist-event junction table
CREATE TABLE event_artists (
    event_id BIGINT,
    artist_id BIGINT,
    artist_name VARCHAR(255),
    artist_link TEXT,
    is_b2b BOOLEAN DEFAULT false,
    PRIMARY KEY (event_id, artist_id),
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id)
);