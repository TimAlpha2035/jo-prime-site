-- ============================================================
-- JO Prime Print — Schéma Supabase
-- Collez ce SQL dans : Supabase → SQL Editor → New query
-- Puis cliquez "Run" (bouton vert)
-- ============================================================

-- ── TABLE : produits (6 produits fixes) ──────────────────
CREATE TABLE IF NOT EXISTS produits (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        text        UNIQUE NOT NULL,
  nom         text        NOT NULL,
  tagline     text,
  description text,
  image_url   text,
  actif       boolean     DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

INSERT INTO produits (slug, nom, tagline, description, actif) VALUES
  ('cartes-de-visite', 'Cartes de visite',        'L''essentiel du networking',        'Des cartes de visite professionnelles de haute qualité pour représenter votre activité.', true),
  ('affiches',         'Affiches & Flyers',        'Visibilité maximale',               'Affiches et flyers en grands formats pour vos événements et promotions.', true),
  ('baches',           'Bâches & Banderoles',      'Grand format, grande présence',     'Bâches publicitaires résistantes pour une visibilité en extérieur.', true),
  ('photocopies',      'Photocopies & Impression', 'Rapide et économique',              'Service de photocopie et d''impression noir & blanc ou couleur.', true),
  ('decoration',       'Décoration & Stickers',    'Personnalisez votre espace',        'Stickers, adhésifs et décorations murales sur mesure.', true),
  ('kakemonos',        'Kakémonos & Roll-up',      'L''élégance de la communication',  'Kakémonos et roll-up pour salons, foires et expositions.', true)
ON CONFLICT (slug) DO NOTHING;

-- ── TABLE : variantes (tarifs par produit) ───────────────
CREATE TABLE IF NOT EXISTS variantes (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  produit_slug text        NOT NULL REFERENCES produits(slug) ON DELETE CASCADE,
  nom          text        NOT NULL,
  specs        text,
  prix         integer     DEFAULT 0,
  unite        text,
  delai        text,
  populaire    boolean     DEFAULT false,
  ordre        integer     DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

-- Quelques variantes d'exemple (modifiables depuis l'admin)
INSERT INTO variantes (produit_slug, nom, specs, prix, unite, delai, populaire, ordre) VALUES
  ('cartes-de-visite', 'Standard',        '85×55 mm • 300g',   150000, '100 cartes', '3–5 jours', false, 1),
  ('cartes-de-visite', 'Premium',         '85×55 mm • 350g',   220000, '100 cartes', '3–5 jours', true,  2),
  ('cartes-de-visite', 'Premium +',       '90×55 mm • 400g',   300000, '100 cartes', '5–7 jours', false, 3),
  ('affiches',         'A4',              '21×29 cm',           20000, '1 affiche',  '24h',        false, 1),
  ('affiches',         'A3',              '30×42 cm',           35000, '1 affiche',  '24h',        true,  2),
  ('affiches',         'A2',              '42×60 cm',           60000, '1 affiche',  '48h',        false, 3),
  ('baches',           'Bâche 1×2m',      '1 m × 2 m',        250000, '1 bâche',    '3–5 jours', false, 1),
  ('baches',           'Bâche 2×3m',      '2 m × 3 m',        450000, '1 bâche',    '3–5 jours', true,  2),
  ('baches',           'Bâche sur mesure','Dimensions libres', 600000, 'au m²',      '5–7 jours', false, 3),
  ('photocopies',      'N&B A4',          'Recto, A4',           1000, '1 page',     'Express',   false, 1),
  ('photocopies',      'Couleur A4',      'Recto, A4',           3000, '1 page',     'Express',   true,  2),
  ('photocopies',      'Lot 50 pages N&B','A4 recto',           40000, '50 pages',   '1 heure',   false, 3),
  ('decoration',       'Sticker A4',      '21×29 cm',           25000, '1 sticker',  '2–3 jours', false, 1),
  ('decoration',       'Sticker A3',      '30×42 cm',           45000, '1 sticker',  '2–3 jours', true,  2),
  ('decoration',       'Vinyle mural',    'Au m²',             120000, '1 m²',       '5–7 jours', false, 3),
  ('kakemonos',        'Roll-up 80×200',  '80 cm × 200 cm',   350000, '1 unité',    '5–7 jours', false, 1),
  ('kakemonos',        'Roll-up 100×200', '100 cm × 200 cm',  450000, '1 unité',    '5–7 jours', true,  2),
  ('kakemonos',        'Kakémono 60×160', '60 cm × 160 cm',   280000, '1 unité',    '5–7 jours', false, 3)
ON CONFLICT DO NOTHING;

-- ── TABLE : realisations (portfolio) ─────────────────────
CREATE TABLE IF NOT EXISTS realisations (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  titre       text        NOT NULL,
  categorie   text        NOT NULL,
  description text,
  image_url   text,
  actif       boolean     DEFAULT true,
  ordre       integer     DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- ── TABLE : demandes_devis ────────────────────────────────
CREATE TABLE IF NOT EXISTS demandes_devis (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  prenom      text        NOT NULL,
  nom         text        NOT NULL,
  email       text        NOT NULL,
  telephone   text        NOT NULL,
  entreprise  text,
  service     text        NOT NULL,
  quantite    text        NOT NULL,
  format      text,
  delai       text        NOT NULL,
  description text        NOT NULL,
  statut      text        NOT NULL DEFAULT 'nouveau',
  created_at  timestamptz DEFAULT now()
);

-- ── TABLE : messages_contact ──────────────────────────────
CREATE TABLE IF NOT EXISTS messages_contact (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  nom         text        NOT NULL,
  email       text        NOT NULL,
  sujet       text        NOT NULL,
  message     text        NOT NULL,
  statut      text        NOT NULL DEFAULT 'nouveau',
  created_at  timestamptz DEFAULT now()
);

-- ── TABLE : parametres_site (réglages) ───────────────────
CREATE TABLE IF NOT EXISTS parametres_site (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  cle        text        UNIQUE NOT NULL,
  valeur     text,
  created_at timestamptz DEFAULT now()
);

INSERT INTO parametres_site (cle, valeur) VALUES
  ('telephone',  '+224 625 50 50 39'),
  ('whatsapp',   '224625505039'),
  ('email',      'joprimeprint@gmail.com'),
  ('adresse',    'Conakry, Guinée'),
  ('horaires',   'Lun–Sam : 8h–19h'),
  ('facebook',   ''),
  ('instagram',  ''),
  ('afficher_prix', 'true')
ON CONFLICT (cle) DO NOTHING;

-- ── ROW LEVEL SECURITY ────────────────────────────────────
-- Le contenu public est lisible par tous ; TOUTE écriture admin passe par la
-- fonction Edge "admin-content" (service role + secret ADMIN_KEY).
-- Les visiteurs peuvent seulement INSÉRER un devis / un message.
ALTER TABLE produits          ENABLE ROW LEVEL SECURITY;
ALTER TABLE variantes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE realisations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE parametres_site   ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes_devis    ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_contact  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lecture publique produits"     ON produits;
DROP POLICY IF EXISTS "lecture publique variantes"    ON variantes;
DROP POLICY IF EXISTS "lecture publique realisations" ON realisations;
DROP POLICY IF EXISTS "lecture publique parametres"   ON parametres_site;
DROP POLICY IF EXISTS "public can submit devis"       ON demandes_devis;
DROP POLICY IF EXISTS "public can submit contact"     ON messages_contact;

CREATE POLICY "lecture publique produits"     ON produits        FOR SELECT TO public USING (true);
CREATE POLICY "lecture publique variantes"    ON variantes       FOR SELECT TO public USING (true);
CREATE POLICY "lecture publique realisations" ON realisations    FOR SELECT TO public USING (actif = true);
CREATE POLICY "lecture publique parametres"   ON parametres_site FOR SELECT TO public USING (true);
CREATE POLICY "public can submit devis"   ON demandes_devis   FOR INSERT TO anon WITH CHECK (statut = 'nouveau');
CREATE POLICY "public can submit contact" ON messages_contact FOR INSERT TO anon WITH CHECK (statut = 'nouveau');

-- Limites de taille (anti-abus) sur les formulaires publics
ALTER TABLE demandes_devis DROP CONSTRAINT IF EXISTS demandes_devis_len;
ALTER TABLE demandes_devis ADD CONSTRAINT demandes_devis_len CHECK (
  length(prenom) <= 200 AND length(nom) <= 200 AND length(email) <= 320 AND
  length(telephone) <= 50 AND length(coalesce(entreprise,'')) <= 200 AND
  length(service) <= 200 AND length(quantite) <= 200 AND
  length(coalesce(format,'')) <= 200 AND length(delai) <= 200 AND
  length(description) <= 5000) NOT VALID;
ALTER TABLE messages_contact DROP CONSTRAINT IF EXISTS messages_contact_len;
ALTER TABLE messages_contact ADD CONSTRAINT messages_contact_len CHECK (
  length(nom) <= 200 AND length(email) <= 320 AND length(sujet) <= 300 AND
  length(message) <= 5000) NOT VALID;

-- ── BUCKET STORAGE ────────────────────────────────────────
-- Faites ceci manuellement dans l'interface Supabase :
-- Storage → New bucket → Nom : "jo-prime-images" → cocher "Public bucket" → Create
--
-- OU collez ces requêtes SQL :
INSERT INTO storage.buckets (id, name, public)
VALUES ('jo-prime-images', 'jo-prime-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politique lecture publique
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND schemaname = 'storage'
      AND policyname = 'jo-prime-images public read'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "jo-prime-images public read"
        ON storage.objects FOR SELECT
        TO public
        USING (bucket_id = 'jo-prime-images');
    $policy$;
  END IF;
END $$;

-- Aucune politique d'écriture pour anon : les images sont stockées en base
-- (data URL) ou envoyées via une URL signée générée par la fonction Edge.
DROP POLICY IF EXISTS "jo-prime-images anon upload" ON storage.objects;
DROP POLICY IF EXISTS "jo-prime-images anon update" ON storage.objects;
DROP POLICY IF EXISTS "jo-prime-images anon delete" ON storage.objects;
