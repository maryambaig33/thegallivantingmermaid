import React, { useState } from 'react';
import { BookOpen, Coffee, Map, Menu, X, ArrowRight } from 'lucide-react';
import { FEATURED_BOOKSTORES } from './constants';
import { BookstoreCard } from './components/BookstoreCard';
import { AIChat } from './components/AIChat';
import { ViewState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-orange-100 selection:text-orange-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-stone-200 bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white">
              <BookOpen size={20} />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight">Dallas Lit</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setView(ViewState.HOME)} 
              className={`text-sm font-medium transition-colors ${view === ViewState.HOME ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}
            >
              The Collection
            </button>
            <button 
              onClick={() => setView(ViewState.GUIDE)} 
              className={`text-sm font-medium transition-colors ${view === ViewState.GUIDE ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}
            >
              AI Guide
            </button>
            <button className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700">
              Subscribe
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-stone-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-100 bg-white px-6 py-4 shadow-lg">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { setView(ViewState.HOME); setMobileMenuOpen(false); }}
                className="text-left text-base font-medium text-stone-900"
              >
                The Collection
              </button>
              <button 
                onClick={() => { setView(ViewState.GUIDE); setMobileMenuOpen(false); }}
                className="text-left text-base font-medium text-stone-900"
              >
                AI Guide
              </button>
            </div>
          </div>
        )}
      </nav>

      <main>
        {view === ViewState.HOME ? (
          <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-stone-100 py-24 sm:py-32">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }}></div>
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-2xl">
                  <span className="mb-4 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-orange-800">
                    Curated Guide
                  </span>
                  <h1 className="font-serif text-5xl font-medium tracking-tight text-stone-900 sm:text-7xl">
                    Charming Indie Bookstores in Dallas
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-stone-600">
                    Discover the hidden literary gems of Dallas. From cozy corners in Bishop Arts to bustling hubs in Deep Ellum, explore the spaces where stories come alive.
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <button 
                      onClick={() => setView(ViewState.GUIDE)}
                      className="group flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
                    >
                      Ask the AI Concierge <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <a href="#collection" className="text-sm font-semibold leading-6 text-stone-900 hover:text-orange-700">
                      View the list <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section id="collection" className="py-24 sm:py-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">The Collection</h2>
                  <p className="mt-2 text-lg leading-8 text-stone-600">
                    Hand-picked sanctuaries for bibliophiles.
                  </p>
                </div>
                
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                  {FEATURED_BOOKSTORES.map((store) => (
                    <BookstoreCard key={store.id} store={store} />
                  ))}
                </div>
              </div>
            </section>

            {/* Feature Banner */}
            <section className="bg-stone-900 py-24 text-white">
              <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-xl">
                  <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                    Not sure where to go?
                  </h2>
                  <p className="mt-4 text-stone-300 text-lg">
                    Our AI-powered concierge can help you find the perfect bookstore based on your current location, mood, or specific literary interests.
                  </p>
                  <button 
                     onClick={() => setView(ViewState.GUIDE)}
                     className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-200"
                  >
                    Start Chatting
                  </button>
                </div>
                <div className="flex gap-4 opacity-50">
                  <Coffee size={48} strokeWidth={1} />
                  <Map size={48} strokeWidth={1} />
                  <BookOpen size={48} strokeWidth={1} />
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Guide View */
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 min-h-[calc(100vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 h-full">
              {/* Left Context Column */}
              <div className="lg:col-span-1 space-y-8">
                 <div>
                   <h1 className="font-serif text-4xl font-medium text-stone-900 mb-4">Your Literary Concierge</h1>
                   <p className="text-stone-600 leading-relaxed">
                     Powered by Gemini, this assistant has real-time access to Google Maps.
                   </p>
                 </div>
                 
                 <div className="rounded-xl bg-stone-100 p-6">
                   <h3 className="font-serif text-xl font-medium text-stone-800 mb-4">Try asking...</h3>
                   <ul className="space-y-3">
                     {[
                       "Find a bookstore near me open now.",
                       "Which store has the best coffee?",
                       "Are there any poetry readings tonight?",
                       "I want to find a rare first edition."
                     ].map((prompt, i) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                         <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-orange-400"></span>
                         "{prompt}"
                       </li>
                     ))}
                   </ul>
                 </div>

                 <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-50 text-orange-700 rounded-lg">
                        <Map size={20} />
                      </div>
                      <span className="font-semibold text-stone-900">Live Maps Grounding</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      When available, the AI will provide clickable map cards with reviews and directions directly from Google Maps.
                    </p>
                 </div>
              </div>

              {/* Right Chat Column */}
              <div className="lg:col-span-2">
                <AIChat />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-paper py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6 lg:px-8">
          <p className="text-center text-xs leading-5 text-stone-400">
            &copy; 2024 Dallas Lit Guide. A modernization of the classic indie bookstore list.
          </p>
          <div className="flex gap-4 text-stone-400">
            <a href="#" className="hover:text-stone-600 transition-colors">About</a>
            <a href="#" className="hover:text-stone-600 transition-colors">Submit a Store</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
