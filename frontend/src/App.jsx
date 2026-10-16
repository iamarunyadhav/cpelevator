import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { SiteContext } from "@/lib/site-context";
import { useLoad } from "@/hooks/useLoad";
import { contentService } from "@/services/contentService";
import { PageLoader } from "@/components/site/PageLoader";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Elevators from "@/pages/Elevators";
import ElevatorDetail from "@/pages/ElevatorDetail";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Projects from "@/pages/Projects";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import RequestQuote from "@/pages/RequestQuote";
import Privacy from "@/pages/Privacy";
import Auth from "@/pages/Auth";
import Admin from "@/pages/admin/Admin";
import NotFound from "@/pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { data: site, error } = useLoad(() => contentService.site());

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="text-xl font-semibold">This page didn't load</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Could not reach the server. Please refresh or try again shortly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  if (!site) return <PageLoader />;

  return (
    <SiteContext.Provider value={site}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/elevators" element={<Elevators />} />
        <Route path="/elevators/:slug" element={<ElevatorDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/request-quote" element={<RequestQuote />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SiteContext.Provider>
  );
}
