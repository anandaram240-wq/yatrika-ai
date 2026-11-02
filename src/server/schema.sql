-- src/server/schema.sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE source_registry (
  source_id VARCHAR(64) PRIMARY KEY,
  authority_name TEXT NOT NULL,
  official_url TEXT NOT NULL,
  source_category VARCHAR(48) NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE destinations (
  destination_id VARCHAR(64) PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_kn TEXT NOT NULL,
  district VARCHAR(64) NOT NULL,
  taluk VARCHAR(64) NOT NULL,
  center_geom GEOMETRY(Point, 4326) NOT NULL,
  bbox_geom GEOMETRY(Polygon, 4326) NOT NULL,
  managing_authority TEXT NOT NULL,
  unesco_status TEXT,
  review_status VARCHAR(24) NOT NULL DEFAULT 'PUBLISHED'
);

CREATE TABLE destination_aliases (
  alias_id SERIAL PRIMARY KEY,
  destination_id VARCHAR(64) REFERENCES destinations(destination_id) ON DELETE CASCADE,
  alias_text TEXT NOT NULL,
  script_lang VARCHAR(16) NOT NULL
);

CREATE TABLE attractions (
  attraction_id VARCHAR(64) PRIMARY KEY,
  destination_id VARCHAR(64) REFERENCES destinations(destination_id) ON DELETE CASCADE,
  cluster_id VARCHAR(48) NOT NULL,
  name_en TEXT NOT NULL,
  name_kn TEXT NOT NULL,
  geom GEOMETRY(Point, 4326) NOT NULL,
  elevation_m INTEGER,
  opening_hours TEXT NOT NULL,
  weekly_closing_day VARCHAR(32),
  recommended_duration_mins INTEGER NOT NULL,
  historical_period TEXT NOT NULL,
  dynasty TEXT NOT NULL,
  architectural_style TEXT NOT NULL,
  established_history TEXT NOT NULL,
  local_legend_note TEXT,
  source_id VARCHAR(64) REFERENCES source_registry(source_id)
);

CREATE TABLE entry_fees (
  fee_id SERIAL PRIMARY KEY,
  attraction_id VARCHAR(64) REFERENCES attractions(attraction_id) ON DELETE CASCADE,
  indian_inr NUMERIC(10, 2) NOT NULL,
  saarc_bimstec_inr NUMERIC(10, 2) NOT NULL,
  foreign_inr NUMERIC(10, 2) NOT NULL,
  ticketing_channel TEXT NOT NULL,
  fee_notes TEXT,
  source_id VARCHAR(64) REFERENCES source_registry(source_id)
);

CREATE TABLE accommodation_properties (
  property_id VARCHAR(64) PRIMARY KEY,
  destination_id VARCHAR(64) REFERENCES destinations(destination_id),
  property_name TEXT NOT NULL,
  verification_label VARCHAR(48) NOT NULL,
  authority_name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  valid_from DATE,
  valid_until DATE,
  geom GEOMETRY(Point, 4326) NOT NULL,
  official_booking_url TEXT NOT NULL,
  source_id VARCHAR(64) REFERENCES source_registry(source_id)
);

CREATE TABLE safety_events (
  safety_id VARCHAR(64) PRIMARY KEY,
  destination_id VARCHAR(64) REFERENCES destinations(destination_id),
  classification VARCHAR(48) NOT NULL,
  location_name TEXT NOT NULL,
  geom GEOMETRY(Geometry, 4326) NOT NULL,
  location_accuracy VARCHAR(48) NOT NULL,
  incident_date DATE NOT NULL,
  publication_date DATE NOT NULL,
  responsible_authority TEXT NOT NULL,
  source_url TEXT NOT NULL,
  valid_from TEXT NOT NULL,
  valid_until TEXT NOT NULL,
  current_status VARCHAR(48) NOT NULL
);

CREATE INDEX idx_attractions_geom ON attractions USING GIST (geom);
CREATE INDEX idx_safety_events_geom ON safety_events USING GIST (geom);
