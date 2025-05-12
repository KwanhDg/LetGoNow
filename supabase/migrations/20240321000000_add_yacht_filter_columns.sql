-- Add new columns for yacht filtering
ALTER TABLE yachts
ADD COLUMN rating DECIMAL(3,1) DEFAULT 0,
ADD COLUMN review_count INTEGER DEFAULT 0,
ADD COLUMN location TEXT,
ADD COLUMN launch_year INTEGER,
ADD COLUMN ship_type TEXT,
ADD COLUMN facilities JSONB DEFAULT '[]'::jsonb;

-- Add indexes for better query performance
CREATE INDEX idx_yachts_rating ON yachts(rating);
CREATE INDEX idx_yachts_price ON yachts(price);
CREATE INDEX idx_yachts_location ON yachts(location);
CREATE INDEX idx_yachts_ship_type ON yachts(ship_type);

-- Update existing records with sample data
UPDATE yachts
SET 
  rating = 4.5,
  review_count = 120,
  location = 'Vịnh Hạ Long',
  launch_year = 2020,
  ship_type = 'Tàu vỏ Kim loại',
  facilities = '["Có bể sục", "Bao gồm tất cả các bữa ăn", "Quầy bar", "Lễ tân 24 giờ", "Nhà hàng"]'::jsonb
WHERE id = 1;

UPDATE yachts
SET 
  rating = 4.8,
  review_count = 85,
  location = 'Vịnh Lan Hạ',
  launch_year = 2021,
  ship_type = 'Tàu vỏ Gỗ',
  facilities = '["Có bể sục", "Bao gồm tất cả các bữa ăn", "Quầy bar", "Lễ tân 24 giờ"]'::jsonb
WHERE id = 2;

UPDATE yachts
SET 
  rating = 4.2,
  review_count = 65,
  location = 'Đảo Cát Bà',
  launch_year = 2019,
  ship_type = 'Tàu vỏ Kim loại',
  facilities = '["Bao gồm tất cả các bữa ăn", "Quầy bar", "Lễ tân 24 giờ"]'::jsonb
WHERE id = 3; 