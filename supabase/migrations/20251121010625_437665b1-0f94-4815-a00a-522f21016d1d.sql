-- Add industry field to companies table
ALTER TABLE companies ADD COLUMN industry TEXT;

-- Add comment to document the field
COMMENT ON COLUMN companies.industry IS 'Business industry/sector for tailored alerts and strategies';