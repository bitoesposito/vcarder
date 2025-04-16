# API Endpoints

Metodo	    Endpoint	          Descrizione
POST	      /login	            Login utenti
GET	        /users/:id	        Dettagli utente
PUT	        /users/:id	        Modifica profilo utente
POST	      /users/:id/upload	  Upload immagine profilo
GET	        /public/:slug	      Dati profilo pubblico
GET	        /vcard/:id	        Scarica vCard
GET	        /pdf/:id	          Scarica biglietto PDF
GET	        /admin/users	      Lista utenti (solo admin)
POST	      /admin/users        Crea nuovo utente (solo admin)
DELETE	    /admin/users/:id    Elimina utente (solo admin)

# Database: tabella users

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL,
  profile_image_url TEXT,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  is_website_selected BOOLEAN,
  is_whatsapp_selected BOOLEAN,
  is_vcard_selected BOOLEAN,
  selected_theme TEXT,
  slug TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('user', 'admin')) NOT NULL,
  password_hash TEXT NOT NULL
);