import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart, Brain, Baby, Utensils, Shield, Users, Star, ArrowRight, CheckCircle, Sparkles, Zap, Globe } from 'lucide-react';

const Landing = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: <Heart className="w-7 h-7" />,
      title: t('landing.features.cycle.title'),
      description: t('landing.features.cycle.description'),
      gradient: 'from-rose-500 to-pink-500',
      bg: 'bg-rose-50',
    },
    {
      icon: <Brain className="w-7 h-7" />,
      title: t('landing.features.mood.title'),
      description: t('landing.features.mood.description'),
      gradient: 'from-purple-500 to-indigo-500',
      bg: 'bg-purple-50',
    },
    {
      icon: <Baby className="w-7 h-7" />,
      title: t('landing.features.pregnancy.title'),
      description: t('landing.features.pregnancy.description'),
      gradient: 'from-pink-500 to-rose-400',
      bg: 'bg-pink-50',
    },
    {
      icon: <Utensils className="w-7 h-7" />,
      title: t('landing.features.nutrition.title'),
      description: t('landing.features.nutrition.description'),
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: t('landing.features.schemes.title'),
      description: t('landing.features.schemes.description'),
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: t('landing.features.ai.title'),
      description: t('landing.features.ai.description'),
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
    }
  ];

  const benefits = [
    t('landing.benefits.personalized'),
    t('landing.benefits.confidential'),
    t('landing.benefits.multilingual'),
    t('landing.benefits.evidence_based'),
    t('landing.benefits.govt_schemes'),
    t('landing.benefits.free_to_use')
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      content: t('landing.testimonials.priya'),
      rating: 5,
      avatar: 'P'
    },
    {
      name: "Anjali Patel",
      role: "Teacher",
      content: t('landing.testimonials.anjali'),
      rating: 5,
      avatar: 'A'
    },
    {
      name: "Sunita Reddy",
      role: "Homemaker",
      content: t('landing.testimonials.sunita'),
      rating: 5,
      avatar: 'S'
    }
  ];

  const stats = [
    { number: "50K+", label: t('landing.stats.users'), icon: '👩‍💻' },
    { number: "22", label: t('landing.stats.schemes'), icon: '📋' },
    { number: "5", label: t('landing.stats.languages'), icon: '🌍' },
    { number: "24/7", label: t('landing.stats.support'), icon: '🤖' }
  ];

  return (
    <div className="bg-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Heart className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
                <Sparkles className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                EmpowerHer
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:flex items-center">
                <Globe className="w-4 h-4 text-gray-400 absolute left-2.5 pointer-events-none" />
                <select 
                  value={i18n.language} 
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="appearance-none pl-8 pr-6 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300 cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="ta">தமிழ்</option>
                  <option value="te">తెలుగు</option>
                </select>
              </div>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-rose-600 font-medium transition-colors text-sm"
              >
                {t('login')}
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-5 py-2 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300 font-medium text-sm shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 hover:-translate-y-0.5"
              >
                {t('register')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-white to-purple-50/80" />
        <div className="absolute top-20 -left-40 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-100/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-100 rounded-full px-4 py-1.5 mb-8">
              <Zap className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-rose-700">AI-Powered Women's Health Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              {t('landing.hero.title')}
              <span className="bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
                {' '}{t('landing.hero.titleHighlight')}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('landing.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-4 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-300 font-semibold text-lg inline-flex items-center justify-center shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:-translate-y-0.5 group"
              >
                {t('landing.hero.getStarted')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/50 transition-all duration-300 font-semibold text-lg"
              >
                {t('landing.hero.signIn')}
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {t('landing.features.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('landing.features.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-rose-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                {t('landing.benefits.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t('landing.benefits.description')}
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 to-purple-100/50 rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-rose-400/20 to-purple-400/20 rounded-full blur-xl" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('landing.cta.title')}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('landing.cta.description')}
                </p>
                <input
                  type="email"
                  placeholder={t('landing.cta.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all"
                />
                <Link 
                  to="/register" 
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all duration-300 font-semibold text-center block shadow-md shadow-rose-200 hover:shadow-lg"
                >
                  {t('landing.cta.getStarted')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {t('landing.testimonials.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('landing.testimonials.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-11 h-11 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-md">
                    <span className="text-white font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-rose-500 to-purple-600 rounded-3xl p-12 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Take Control of Your Health?
              </h2>
              <p className="text-rose-100 text-lg mb-8 max-w-2xl mx-auto">
                Join 50,000+ women who trust EmpowerHer for their health journey. It's free, it's private, it's powerful.
              </p>
              <Link 
                to="/register" 
                className="inline-flex items-center bg-white text-rose-600 px-8 py-4 rounded-xl hover:bg-rose-50 transition-all duration-300 font-bold text-lg shadow-xl hover:-translate-y-0.5 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
