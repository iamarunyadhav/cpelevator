CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TYPE public.enquiry_status AS ENUM ('new','contacted','site_visit_planned','quoted','won','closed','cancelled');

CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, role public.app_role NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id, role));
GRANT SELECT ON public.user_roles TO authenticated; GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role) $$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id=auth.uid());
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.site_settings (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_name text NOT NULL DEFAULT 'Compass Elevators', logo_url text, favicon_url text, phone text NOT NULL, whatsapp text NOT NULL, email text NOT NULL, address_line_1 text NOT NULL, address_line_2 text, city text NOT NULL, country text NOT NULL, google_maps_url text, facebook_url text, instagram_url text, linkedin_url text, youtube_url text, business_hours text, emergency_support_text text, footer_description text NOT NULL, copyright_text text NOT NULL, seo_title text NOT NULL, seo_description text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.site_settings TO anon, authenticated; GRANT INSERT,UPDATE,DELETE ON public.site_settings TO authenticated; GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.homepage_content (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), eyebrow text NOT NULL, heading text NOT NULL, introduction text NOT NULL, secondary_text text NOT NULL, hero_image_url text, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.homepage_content TO anon,authenticated; GRANT INSERT,UPDATE,DELETE ON public.homepage_content TO authenticated; GRANT ALL ON public.homepage_content TO service_role;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads homepage" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Admins manage homepage" ON public.homepage_content FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.services (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, slug text NOT NULL UNIQUE, icon text NOT NULL DEFAULT 'wrench', short_description text NOT NULL, long_description text NOT NULL, featured_image_url text, seo_title text, seo_description text, sort_order integer NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true, featured boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.services TO anon,authenticated; GRANT INSERT,UPDATE,DELETE ON public.services TO authenticated; GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active services" ON public.services FOR SELECT USING (active=true);
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.elevator_types (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, slug text NOT NULL UNIQUE, category text NOT NULL, short_description text NOT NULL, long_description text NOT NULL, featured_image_url text, applications text[] NOT NULL DEFAULT '{}', benefits text[] NOT NULL DEFAULT '{}', seo_title text, seo_description text, sort_order integer NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true, featured boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.elevator_types TO anon,authenticated; GRANT INSERT,UPDATE,DELETE ON public.elevator_types TO authenticated; GRANT ALL ON public.elevator_types TO service_role;
ALTER TABLE public.elevator_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active elevators" ON public.elevator_types FOR SELECT USING (active=true);
CREATE POLICY "Admins manage elevators" ON public.elevator_types FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.projects (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, slug text NOT NULL UNIQUE, category text NOT NULL, client_name text, location text NOT NULL, elevator_type text NOT NULL, service_performed text NOT NULL, summary text NOT NULL, description text NOT NULL, project_date date, featured_image_url text, featured boolean NOT NULL DEFAULT false, published boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.projects TO anon,authenticated; GRANT INSERT,UPDATE,DELETE ON public.projects TO authenticated; GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published projects" ON public.projects FOR SELECT USING (published=true);
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.project_images (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE, image_url text NOT NULL, alt_text text NOT NULL, sort_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.project_images TO anon,authenticated; GRANT INSERT,UPDATE,DELETE ON public.project_images TO authenticated; GRANT ALL ON public.project_images TO service_role;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published project images" ON public.project_images FOR SELECT USING (EXISTS(SELECT 1 FROM public.projects p WHERE p.id=project_id AND p.published));
CREATE POLICY "Admins manage project images" ON public.project_images FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.testimonials (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), customer_name text NOT NULL, company text, role_title text, quote text NOT NULL, rating integer, image_url text, active boolean NOT NULL DEFAULT false, featured boolean NOT NULL DEFAULT false, sort_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.testimonials TO anon,authenticated; GRANT INSERT,UPDATE,DELETE ON public.testimonials TO authenticated; GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active testimonials" ON public.testimonials FOR SELECT USING (active=true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.faqs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), question text NOT NULL, answer text NOT NULL, category text NOT NULL DEFAULT 'general', active boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.faqs TO anon,authenticated; GRANT INSERT,UPDATE,DELETE ON public.faqs TO authenticated; GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active faqs" ON public.faqs FOR SELECT USING (active=true);
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.quote_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), reference text NOT NULL UNIQUE, service_type text NOT NULL, elevator_type text NOT NULL, property_type text NOT NULL, floors_stops text, required_capacity text, existing_elevator text NOT NULL, project_location text NOT NULL, timeline text NOT NULL, requirements text, full_name text NOT NULL, company_name text, phone text NOT NULL, whatsapp text, email text NOT NULL, preferred_contact text NOT NULL, consent boolean NOT NULL, status public.enquiry_status NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT INSERT ON public.quote_requests TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.quote_requests TO authenticated; GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors submit quotes" ON public.quote_requests FOR INSERT TO anon,authenticated WITH CHECK (consent=true);
CREATE POLICY "Admins manage quotes" ON public.quote_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.quote_attachments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), quote_request_id uuid NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE, storage_path text NOT NULL, original_name text NOT NULL, mime_type text NOT NULL, size_bytes bigint NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT INSERT ON public.quote_attachments TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.quote_attachments TO authenticated; GRANT ALL ON public.quote_attachments TO service_role;
ALTER TABLE public.quote_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors attach to quotes" ON public.quote_attachments FOR INSERT TO anon,authenticated WITH CHECK (true);
CREATE POLICY "Admins manage attachments" ON public.quote_attachments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.quote_notes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), quote_request_id uuid NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE, admin_user_id uuid NOT NULL, note text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT,INSERT,UPDATE,DELETE ON public.quote_notes TO authenticated; GRANT ALL ON public.quote_notes TO service_role;
ALTER TABLE public.quote_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage notes" ON public.quote_notes FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.contact_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, phone text, email text, subject text NOT NULL, message text NOT NULL, status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CHECK (phone IS NOT NULL OR email IS NOT NULL));
GRANT INSERT ON public.contact_messages TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.contact_messages TO authenticated; GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors submit contact messages" ON public.contact_messages FOR INSERT TO anon,authenticated WITH CHECK (true);
CREATE POLICY "Admins manage messages" ON public.contact_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END $$;
CREATE TRIGGER touch_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_home BEFORE UPDATE ON public.homepage_content FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_services BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_elevators BEFORE UPDATE ON public.elevator_types FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_testimonials BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_faqs BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_quotes BEFORE UPDATE ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_contacts BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Public reads site media" ON storage.objects FOR SELECT TO anon,authenticated USING (bucket_id='public-site-media');
CREATE POLICY "Admins upload site media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='public-site-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update site media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='public-site-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete site media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='public-site-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Visitors upload quote files" ON storage.objects FOR INSERT TO anon,authenticated WITH CHECK (bucket_id='quote-attachments');
CREATE POLICY "Admins read quote files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id='quote-attachments' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete quote files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id='quote-attachments' AND public.has_role(auth.uid(),'admin'));

INSERT INTO public.site_settings (phone,whatsapp,email,address_line_1,address_line_2,city,country,emergency_support_text,footer_description,copyright_text,seo_title,seo_description) VALUES ('+94 70 273 7585','+94 75 273 7585','cpelevator.lkcom@gmail.com','40/Fernando Road','Wellawatta','Colombo 06','Sri Lanka','Contact our support team for urgent elevator assistance.','Compass Elevators provides elevator installation, maintenance, repair and modernization solutions for residential, commercial and specialist applications.','© Compass Elevators. All Rights Reserved.','Compass Elevators | Elevator Installation & Maintenance Sri Lanka','Compass Elevators provides elevator installation, maintenance, repair and modernization solutions for residential and commercial properties in Sri Lanka.');
INSERT INTO public.homepage_content (eyebrow,heading,introduction,secondary_text) VALUES ('Elevator Solutions • Sri Lanka','Reliable Lift Solutions for Every Level.','Compass Elevators delivers practical, reliable lift solutions designed around the needs of each building. From planning a new installation to maintaining or upgrading an existing system, our team focuses on safe operation, smooth performance and dependable long-term service.','We work with residential, commercial, healthcare and industrial requirements, helping clients choose solutions based on usage, capacity, building configuration and budget.');
INSERT INTO public.services (title,slug,icon,short_description,long_description,sort_order,featured) VALUES
('New Elevator Installation','new-elevator-installation','building','From requirements and equipment selection through installation, testing and commissioning.','We support new elevator projects through every key stage, coordinating a practical solution around the building, expected use and project requirements.',1,true),
('Maintenance & Repair','elevator-maintenance','wrench','Preventive maintenance, routine inspections and responsive repair support.','Planned care and practical fault support help elevator systems operate safely, smoothly and consistently over the long term.',2,true),
('Modernization','elevator-modernization','refresh','Targeted upgrades for ageing controls, drives, doors and fixtures.','Modernization can improve the operation, presentation and maintainability of an existing elevator through upgrades selected for its condition and use.',3,true),
('24/7 Support','technical-support','headphones','A clear contact point when urgent technical assistance is required.','Our support team helps service customers explain an urgent issue and coordinate the appropriate next step.',4,true);
INSERT INTO public.elevator_types (name,slug,category,short_description,long_description,applications,benefits,sort_order,featured) VALUES
('Passenger Elevators','passenger-elevators','People Movement','Comfortable and dependable passenger lift solutions for apartments, offices, hotels and commercial developments.','Passenger elevator solutions planned around traffic, building configuration, accessibility and the finish expected by occupants.','{"Apartments","Offices","Hotels","Commercial buildings"}','{"Smooth travel","Flexible finishes","Accessible movement"}',1,true),
('Goods Elevators','goods-elevators','Material Movement','Robust vertical transport designed to move goods efficiently in warehouses, factories and commercial facilities.','Goods lift solutions focus on practical loading, durable finishes and a configuration suited to the materials being moved.','{"Warehouses","Factories","Commercial facilities"}','{"Practical loading","Durable interiors","Application-led planning"}',2,true),
('Hospital Elevators','hospital-elevators','Healthcare','Spacious lift solutions for hospitals and medical environments where smooth movement is essential.','Hospital elevator planning considers patient movement, beds and equipment, staff workflows and the operational needs of medical facilities.','{"Hospitals","Medical centres","Care facilities"}','{"Spacious cabins","Smooth movement","Workflow-aware planning"}',3,true),
('Home Elevators','home-elevators','Residential','Compact and elegant lift options that improve accessibility and convenience in private homes and villas.','Residential elevators combine practical access with finishes and dimensions considered for the character of the home.','{"Private homes","Villas","Low-rise residences"}','{"Compact footprint","Improved accessibility","Considered finishes"}',4,true),
('Escalators','escalators','People Movement','Efficient people-moving solutions for retail, commercial and high-traffic environments.','Escalator solutions are considered around passenger flow, site constraints and reliable daily operation.','{"Retail centres","Commercial buildings","High-traffic spaces"}','{"Continuous movement","Traffic support","Durable operation"}',5,true);
INSERT INTO public.projects (title,slug,category,location,elevator_type,service_performed,summary,description,featured,published) VALUES
('Residential Elevator Installation – Colombo','residential-elevator-installation-colombo','Residential','Colombo','Home Elevator','New Installation','A residential lift solution planned around accessibility, interior integration and day-to-day convenience.','This editable demonstration project shows how a residential installation can be presented without naming a private client.',true,true),
('Commercial Lift Upgrade – Western Province','commercial-lift-upgrade-western-province','Commercial','Western Province','Passenger Elevator','Modernization','A focused upgrade concept for an existing commercial passenger lift.','This editable demonstration project represents a modernization requirement for a commercial property.',true,true),
('Goods Lift Service Project','goods-lift-service-project','Industrial','Sri Lanka','Goods Elevator','Maintenance & Repair','Practical service support for a goods lift in an active facility.','This editable demonstration project illustrates service work for a goods-handling environment.',true,true);
INSERT INTO public.faqs (question,answer,sort_order) VALUES
('What types of elevators do you provide?','We provide passenger, goods, hospital and home elevator solutions, as well as escalators for suitable applications.',1),
('Can you maintain an elevator installed by another supplier?','Contact us with the elevator details and location. Our team can review the system and advise on suitable service support.',2),
('Do you provide elevator modernization?','Yes. We can review ageing systems and discuss appropriate upgrades to controls, drives, doors, fixtures and other components.',3),
('Can I request a site inspection?','Yes. Send a quote request with your location and project details so the team can discuss the next step.',4),
('Do you provide solutions for private homes?','Yes. Home elevator options can be planned around available space, accessibility needs and the style of the residence.',5),
('How can I request emergency support?','Call or WhatsApp Compass Elevators and provide the building location, elevator details and a clear description of the issue.',6);