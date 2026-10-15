/*
# Create categories and products tables for Ferrari Imports

1. New Tables
- `categories`: product categories manageable from admin panel.
  - id (serial, primary key)
  - slug (text, unique) — URL-safe identifier used by the storefront
  - label (text, not null) — display name
  - sort_order (int, default 0) — ordering
  - created_at (timestamptz)

- `products`: full product catalog manageable from admin panel.
  - id (serial, primary key)
  - name (text, not null)
  - description (text)
  - category_slug (text, references categories.slug)
  - price (numeric, not null)
  - old_price (numeric, nullable) — promotional price
  - image (text) — URL
  - sizes (text[]) — available sizes
  - badge (text, nullable) — 'novo' | 'oferta' | 'bestseller'
  - stock (int, default 0)
  - published (boolean, default true)
  - created_at (timestamptz)
  - updated_at (timestamptz)

2. Seed data
- Inserts default categories matching the existing store: camisetas, moletons, calcas, jaquetas, acessorios, conjuntos, bermudas, ofertas.
- Inserts all 18 existing products from the static data file.

3. Security
- Enable RLS on both tables.
- SELECT: public (anon + authenticated) — storefront visitors need to read products and categories.
- INSERT / UPDATE / DELETE: authenticated only — admin operations.
*/
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories"
ON categories FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories"
ON categories FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories"
ON categories FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories"
ON categories FOR DELETE
TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text DEFAULT '',
  category_slug text REFERENCES categories(slug) ON DELETE SET NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  old_price numeric(10,2),
  image text DEFAULT '',
  sizes text[] DEFAULT '{}',
  badge text,
  stock int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products"
ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
ON products FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
ON products FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
ON products FOR DELETE
TO authenticated USING (true);

CREATE OR REPLACE FUNCTION update_product_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_product_updated_at();

-- Seed categories
INSERT INTO categories (slug, label, sort_order) VALUES
  ('camisetas', 'Camisetas', 1),
  ('moletons', 'Moletons', 2),
  ('calcas', 'Calças', 3),
  ('jaquetas', 'Jaquetas', 4),
  ('acessorios', 'Acessórios', 5),
  ('conjuntos', 'Conjuntos', 6),
  ('bermudas', 'Bermudas', 7),
  ('ofertas', 'Ofertas', 8)
ON CONFLICT (slug) DO NOTHING;

-- Seed products
INSERT INTO products (name, description, category_slug, price, old_price, image, sizes, badge, stock, published) VALUES
  ('Camiseta Oversize Premium Preta', 'Camiseta oversize com caimento solto e tecido 100% algodão fio 30.1. Estampa exclusiva Ferrari Imports no peito.', 'camisetas', 129.90, 169.90, 'https://images.pexels.com/photos/3290886/pexels-photo-3290886.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{PP,P,M,G,GG}', 'bestseller', 50, true),
  ('Camiseta Street Graphic Tee', 'T-shirt com estampa gráfica urbana. Modelagem regular fit, gola reforçada e acabamento premium.', 'camisetas', 99.90, NULL, 'https://images.pexels.com/photos/15258903/pexels-photo-15258903.png?auto=compress&cs=tinysrgb&h=650&w=940', '{P,M,G,GG}', 'novo', 35, true),
  ('Camiseta Urban Lifestyle', 'Camiseta de lifestyle urbano com tecido leve e respirável. Perfeita para o dia a dia na cidade.', 'camisetas', 89.90, 119.90, 'https://images.pexels.com/photos/33222517/pexels-photo-33222517.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{PP,P,M,G,GG,XGG}', 'oferta', 40, true),
  ('Camiseta Black Street All-Black', 'Camiseta totalmente preta com acabamento fosco. Visual monocromático para quem domina o estilo street.', 'camisetas', 109.90, NULL, 'https://images.pexels.com/photos/12859416/pexels-photo-12859416.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{P,M,G,GG}', 'bestseller', 28, true),
  ('Moletom Oversized Hoodie Preto', 'Hoodie oversized com capuz duplo, bolso frontal e interior peluciado. Algodão pesado 480g/m².', 'moletons', 219.90, 279.90, 'https://images.pexels.com/photos/34582210/pexels-photo-34582210.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{P,M,G,GG,XGG}', 'bestseller', 20, true),
  ('Moletom Duo Street Hoodie', 'Hoodie streetwear com modelagem relaxada e tecido macio. Disponível em múltiplas cores.', 'moletons', 189.90, NULL, 'https://images.pexels.com/photos/31052880/pexels-photo-31052880.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{P,M,G,GG}', 'novo', 25, true),
  ('Moletom Casual Urban Capuz', 'Moletom com capuz para o dia a dia. Conforto e estilo em uma peça só.', 'moletons', 169.90, 219.90, 'https://images.pexels.com/photos/16581723/pexels-photo-16581723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{P,M,G,GG,XGG}', 'oferta', 15, true),
  ('Moletom Twilight Edition', 'Hoodie edition especial com tecido encorpado e caimento perfeito. Para os creps noturnos.', 'moletons', 199.90, NULL, 'https://images.pexels.com/photos/18677642/pexels-photo-18677642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{P,M,G,GG}', 'novo', 18, true),
  ('Calça Baggy Jeans Urbana', 'Calça baggy com modelagem ampla e cintura alta. Jeans resistente com lavagem urbana.', 'calcas', 179.90, 229.90, 'https://images.pexels.com/photos/10400987/pexels-photo-10400987.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{38,40,42,44,46}', 'bestseller', 22, true),
  ('Calça Cargo Streetwear Retro', 'Calça cargo com bolsos laterais e modelagem retro. Tecido leve e respirável para o verão.', 'calcas', 159.90, NULL, 'https://images.pexels.com/photos/36328440/pexels-photo-36328440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{38,40,42,44}', 'novo', 30, true),
  ('Calça Wide Leg Urban', 'Calça wide leg com caimento solto e confortável. Estilo streetwear contemporâneo.', 'calcas', 149.90, 199.90, 'https://images.pexels.com/photos/30289407/pexels-photo-30289407.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{36,38,40,42,44}', 'oferta', 12, true),
  ('Jaqueta Bomber Preta Premium', 'Bomber jacket com acabamento premium e detalhes em costaria japonesa. Peça statement da temporada.', 'jaquetas', 299.90, 389.90, 'https://images.pexels.com/photos/19969948/pexels-photo-19969948.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{P,M,G,GG,XGG}', 'bestseller', 10, true),
  ('Jaqueta Bomber Street Style', 'Bomber jacket feminina com caimento perfeito e tecido leve. Para compor looks urbanos marcantes.', 'jaquetas', 259.90, NULL, 'https://images.pexels.com/photos/15684133/pexels-photo-15684133.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{P,M,G,GG}', 'novo', 14, true),
  ('Jaqueta Urban Windbreaker', 'Jaqueta windbreaker leve e resistente. Proteção contra vento com estilo urbano.', 'jaquetas', 239.90, 319.90, 'https://images.pexels.com/photos/15988333/pexels-photo-15988333.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{P,M,G,GG,XGG}', 'oferta', 16, true),
  ('Beanie Streetwear Premium', 'Beanie em tricô acrílico macio. Acessório essencial para completar o look street.', 'acessorios', 59.90, 79.90, 'https://images.pexels.com/photos/11722775/pexels-photo-11722775.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{Único}', 'bestseller', 60, true),
  ('Boné Street Cap Urban', 'Boné com aba curvada e tecido resistente. Detalhes bordados Ferrari Imports.', 'acessorios', 69.90, NULL, 'https://images.pexels.com/photos/10301342/pexels-photo-10301342.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{Único}', 'novo', 45, true),
  ('Beanie Winter Edition', 'Beanie inverno com forro térmico. Conforto e aquecimento para os dias frios.', 'acessorios', 49.90, 69.90, 'https://images.pexels.com/photos/7957213/pexels-photo-7957213.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{Único}', 'oferta', 55, true),
  ('Conjunto Beanie Duo Pack', 'Pack com 2 beanies em cores variadas. Praticidade e estilo em um só kit.', 'acessorios', 89.90, NULL, 'https://images.pexels.com/photos/33258845/pexels-photo-33258845.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '{Único}', 'novo', 40, true)
ON CONFLICT DO NOTHING;
