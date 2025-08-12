import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { useWebsiteSettings } from "@/contexts/WebsiteSettingsContext";

const Footer = () => {
  const { settings } = useWebsiteSettings();
  return (
    <footer className="bg-gradient-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-2xl font-bold text-gradient-primary">Dajin</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Building innovative web solutions for modern businesses.
            </p>
            <div className="flex space-x-4">
              {settings.showGithub !== false && settings.github && (
                <a href={settings.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-secondary transition-smooth">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {settings.showLinkedin !== false && settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-secondary transition-smooth">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {settings.showMail !== false && settings.mail && (
                <a href={settings.mail} className="text-muted-foreground hover:text-secondary transition-smooth">
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-secondary transition-smooth">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-secondary transition-smooth">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-secondary transition-smooth">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-secondary transition-smooth">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground">Web Development</span>
              </li>
              <li>
                <span className="text-muted-foreground">Mobile Apps</span>
              </li>
              <li>
                <span className="text-muted-foreground">UI/UX Design</span>
              </li>
              <li>
                <span className="text-muted-foreground">Maintenance</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-secondary" />
                <span className="text-muted-foreground text-sm">hello@dajin.dev</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-secondary" />
                <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Dajin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;