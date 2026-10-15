export type Field = { key: string; label: string; type: "text" | "textarea" | "image"; def: string };
export type FieldGroup = { page: string; fields: Field[] };

const t = (key: string, label: string, def: string): Field => ({ key, label, type: "text", def });
const a = (key: string, label: string, def: string): Field => ({ key, label, type: "textarea", def });
const i = (key: string, label: string): Field => ({ key, label, type: "image", def: "" });

export const fieldGroups: FieldGroup[] = [
  { page: "Home page", fields: [
    t("hero_eyebrow", "Hero small heading", "Elevator solutions • Sri Lanka"),
    t("hero_title_1", "Hero title (line 1)", "Reliable lift solutions"),
    t("hero_title_2", "Hero title (line 2, highlighted)", "for every level."),
    a("hero_text", "Hero paragraph", "Installation, maintenance, modernization and technical support for residential, commercial, healthcare and industrial buildings across Sri Lanka."),
    i("hero_image", "Hero background image"),
    t("intro_eyebrow", "Intro small heading", "About Compass"),
    t("intro_title", "Intro title", "Vertical mobility you can depend on"),
    a("intro_p1", "Intro paragraph 1", "Compass Elevators delivers practical, reliable lift solutions designed around the needs of each building. From planning a new installation to maintaining or upgrading an existing system, our team focuses on safe operation, smooth performance and dependable long-term service."),
    a("intro_p2", "Intro paragraph 2", "We work with residential, commercial, healthcare and industrial requirements, helping clients choose solutions based on usage, capacity, building configuration and budget."),
    i("intro_image", "Intro image"),
    t("services_eyebrow", "Services section small heading", "Complete care"),
    t("services_title", "Services section title", "Support throughout the elevator lifecycle"),
    i("services_image", "Services section image"),
    t("cta_title", "Bottom call-to-action title", "Planning a new lift or need support for an existing one?"),
    a("cta_text", "Bottom call-to-action text", "Tell us about your building or elevator requirement and our team will contact you to discuss the next step."),
  ] },
  { page: "About page", fields: [
    t("about_title", "Page title", "About Compass Elevators"),
    t("about_desc", "Page sub-title", "Practical elevator expertise. Dependable service."),
    t("about_heading", "Main heading", "Moving people safely through dependable vertical mobility."),
    a("about_p1", "Paragraph 1", "Compass Elevators provides vertical mobility solutions for residential, commercial, healthcare and industrial applications. Our work covers new installations, maintenance, repairs, modernization and technical support."),
    a("about_p2", "Paragraph 2", "Every project has different requirements. We focus on understanding the building, expected usage and operational needs before recommending an appropriate solution."),
    i("about_image", "Page image"),
    t("about_b1_title", "Box 1 title", "Our approach"),
    a("about_b1_text", "Box 1 text", "We begin by understanding the building, expected usage and operational priorities before recommending a solution."),
    t("about_b2_title", "Box 2 title", "Commitment to safety"),
    a("about_b2_text", "Box 2 text", "Safety considerations guide how we plan, install, inspect and support elevator systems."),
    t("about_b3_title", "Box 3 title", "Service & support"),
    a("about_b3_text", "Box 3 text", "Clear communication and practical problem-solving remain important from first enquiry through long-term care."),
    t("about_b4_title", "Box 4 title", "Who we work with"),
    a("about_b4_text", "Box 4 text", "Homeowners, developers, architects, contractors, offices, hotels, hospitals, retailers and industrial facilities."),
  ] },
  { page: "Elevators page", fields: [
    t("elevators_title", "Page title", "Elevators planned around real building needs"),
    a("elevators_desc", "Page sub-title", "Solutions for moving people and goods safely, smoothly and efficiently."),
    i("elevators_image", "Banner image"),
    i("elevator_detail_image", "Default image for elevator detail pages"),
  ] },
  { page: "Services page", fields: [
    t("services_page_title", "Page title", "Support throughout the elevator lifecycle"),
    a("services_page_desc", "Page sub-title", "Practical assistance from early planning and installation through long-term maintenance and upgrades."),
    i("services_page_image", "Page image"),
    i("service_detail_image", "Default image for service detail pages"),
  ] },
  { page: "Projects page", fields: [
    t("projects_title", "Page title", "Our work"),
    a("projects_desc", "Page sub-title", "A look at elevator installations, upgrades and service projects."),
  ] },
  { page: "Blog page", fields: [
    t("blog_title", "Page title", "News & insights"),
    a("blog_desc", "Page sub-title", "Updates, guidance and articles from the Compass Elevators team."),
  ] },
  { page: "Contact page", fields: [
    t("contact_title", "Page title", "Let’s discuss your elevator requirement"),
    a("contact_desc", "Page sub-title", "Share a few details or speak directly with the Compass Elevators team."),
  ] },
];

export const fieldDefaults: Record<string, string> = Object.fromEntries(fieldGroups.flatMap((g) => g.fields.map((f) => [f.key, f.def])));
