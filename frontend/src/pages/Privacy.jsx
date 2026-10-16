import { PublicLayout } from "@/components/site/PublicLayout";
import { PageHero } from "@/components/site/PageHero";
import { usePageMeta } from "@/hooks/usePageMeta";
export default function Privacy() {
  usePageMeta(
    "Privacy Policy | Compass Elevators",
    "How Compass Elevators handles website enquiries and contact information.",
  );
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Website information"
        title="Privacy Policy"
        description="How information shared through this website is handled."
      />
      <article className="page-shell max-w-3xl py-20">
        <div className="space-y-8 leading-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground">Information you provide</h2>
            <p className="mt-3">
              When you submit a contact or quote request, we collect the details needed to
              understand and respond to your enquiry. This may include contact information, building
              details and files you choose to attach.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">How it is used</h2>
            <p className="mt-3">
              Information is used to assess your request, contact you, prepare a quotation or
              coordinate an appropriate service response. Private enquiry details are available only
              to authorised administrators.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground">Contact</h2>
            <p className="mt-3">
              For a question about information submitted through this site, contact Compass
              Elevators using the details on our Contact page.
            </p>
          </section>
        </div>
      </article>
    </PublicLayout>
  );
}
