import { GraduationCap, Heart, Scissors, Coffee, Clock, ShieldCheck, MapPin, Search } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                CampusCare
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Services</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Locations</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Resources</a>
              <button className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 active:scale-95">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl -z-10" />
          <div className="absolute top-48 -left-24 w-72 h-72 bg-violet-200/50 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Trusted by 50,000+ Students</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                Campus life, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                  Carefree & Better.
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connecting students with the best on-campus services. From laundry and haircuts to daily essentials, we handle the chores so you can focus on your dreams.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="relative w-full sm:w-auto flex-1 max-w-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search for services..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <button className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
                  Explore Now
                </button>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xl">
              <div className="grid grid-cols-2 gap-4">
                <ServiceCard icon={<Scissors className="w-6 h-6" />} title="Grooming" desc="Fresh cuts near you" color="bg-orange-500" />
                <ServiceCard icon={<Heart className="w-6 h-6" />} title="Health" desc="Medical assistance" color="bg-rose-500" />
                <ServiceCard icon={<Coffee className="w-6 h-6" />} title="Dining" desc="Campus favorite eats" color="bg-amber-500" />
                <ServiceCard icon={<Clock className="w-6 h-6" />} title="Laundry" desc="Next day delivery" color="bg-sky-500" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Statistics Section */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem label="Active Students" value="50k+" />
            <StatItem label="Partner Dorms" value="120+" />
            <StatItem label="Service Providers" value="500+" />
            <StatItem label="Cities Covered" value="15+" />
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Students Love Us</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureItem
              icon={<ShieldCheck className="w-10 h-10 text-indigo-600" />}
              title="Verified Partners"
              desc="Every service provider undergoes a strict verification process for your safety."
            />
            <FeatureItem
              icon={<MapPin className="w-10 h-10 text-indigo-600" />}
              title="Real-time Tracking"
              desc="Know exactly when your laundry or food will arrive with live status updates."
            />
            <FeatureItem
              icon={<Search className="w-10 h-10 text-indigo-600" />}
              title="Smart Discovery"
              desc="Personalized recommendations based on your preferences and location."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function ServiceCard({ icon, title, desc, color }) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 text-lg mb-1">{title}</h3>
      <p className="text-slate-500 text-sm leading-snug">{desc}</p>
    </div>
  )
}

function StatItem({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-indigo-600 mb-1">{value}</p>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
  )
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center transition-all hover:bg-slate-900 group">
      <div className="mb-6 p-4 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600/20 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-slate-600 group-hover:text-slate-300 transition-colors leading-relaxed">{desc}</p>
    </div>
  )
}

export default App
