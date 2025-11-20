-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own companies"
  ON public.companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own companies"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companies"
  ON public.companies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own companies"
  ON public.companies FOR DELETE
  USING (auth.uid() = user_id);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  hs_code TEXT,
  country_of_origin TEXT NOT NULL,
  cost_per_unit DECIMAL(10, 2) NOT NULL,
  units_per_month INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products"
  ON public.products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = products.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own products"
  ON public.products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = products.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own products"
  ON public.products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = products.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own products"
  ON public.products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = products.company_id
      AND companies.user_id = auth.uid()
    )
  );

-- Create product_catalog table (for autocomplete with HS codes)
CREATE TABLE public.product_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  hs_code TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.product_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product catalog"
  ON public.product_catalog FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample products with real HS codes
INSERT INTO public.product_catalog (name, hs_code, description) VALUES
  ('Coffee beans, roasted', '0901.21.00', 'Roasted coffee beans'),
  ('Coffee beans, not roasted', '0901.11.00', 'Green/raw coffee beans'),
  ('Ceramic mugs', '6912.00.50', 'Ceramic tableware and kitchenware'),
  ('Porcelain cups', '6911.10.52', 'Porcelain or china cups'),
  ('Espresso machines, electric', '8516.71.00', 'Electro-thermic coffee makers'),
  ('Coffee grinders, electric', '8509.40.00', 'Food grinders and mixers'),
  ('Espresso machine parts', '8516.90.80', 'Parts of electric heating apparatus'),
  ('Coffee filters, paper', '4823.20.00', 'Filter paper and paperboard'),
  ('Stainless steel carafes', '7323.93.00', 'Stainless steel table/kitchenware'),
  ('Glass coffee pots', '7013.37.00', 'Glassware for table/kitchen use'),
  ('Coffee syrups', '2106.90.98', 'Food preparations not elsewhere specified'),
  ('Milk frothers, electric', '8509.80.00', 'Other electromechanical domestic appliances'),
  ('Coffee tampers', '8210.00.00', 'Hand-operated mechanical devices'),
  ('Portafilter baskets', '7323.99.90', 'Other table/kitchen articles of iron or steel');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();