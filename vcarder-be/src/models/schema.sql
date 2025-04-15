CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(255) UNIQUE NOT NULL,
  profile_image_url VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  website VARCHAR(255),
  is_website_selected BOOLEAN DEFAULT false,
  is_whatsapp_selected BOOLEAN DEFAULT false,
  is_vcard_selected BOOLEAN DEFAULT false,
  selected_theme VARCHAR(255) DEFAULT 'default',
  slug VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);
