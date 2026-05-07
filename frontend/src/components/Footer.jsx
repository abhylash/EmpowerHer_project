import { Link } from 'react-router-dom';
import { Heart, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Cycle Tracking', href: '/cycles' },
    { name: 'Mood & Wellness', href: '/mental' },
    { name: 'Pregnancy Care', href: '/pregnancy' },
    { name: 'Nutrition & Fitness', href: '/fitness' },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-rose-400" />
              <span className="text-xl font-bold text-white">EmpowerHer</span>
            </div>
            <p className="text-gray-400 text-sm">
              An MCA project focused on women's health and wellness using modern web technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-rose-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-rose-400" />
                <span>empowerher@college.edu</span>
              </div>
              <p className="text-gray-400 text-sm">
                MCA Department<br />
                Engineering College<br />
                Bengaluru, India
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} EmpowerHer. MCA Project Development.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
