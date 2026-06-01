import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Github, Twitter, Instagram } from 'lucide-react';
import RulesModal from './RulesModal';

function Footer() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#0F172A] border-t border-gray-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4 group">
                <div className="bg-gradient-to-tr from-[#FF8C42] to-orange-600 p-2 rounded-lg group-hover:rotate-3 transition-transform">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">BeatStory</span>
              </Link>
              <p className="text-gray-400 max-w-sm mb-6">
                Una comunidad para descubrir la historia detrás de cada canción generada por IA. 
                Conectamos tecnología con emociones humanas.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-[#FF8C42] transition-colors"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="text-gray-400 hover:text-[#FF8C42] transition-colors"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="text-gray-400 hover:text-[#FF8C42] transition-colors"><Github className="h-5 w-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/feed" className="hover:text-[#FF8C42] transition-colors">Explorar Feed</Link></li>
                <li><Link to="/login" className="hover:text-[#FF8C42] transition-colors">Iniciar Sesión</Link></li>
                <li><Link to="/register" className="hover:text-[#FF8C42] transition-colors">Registrarse</Link></li>
                <li><Link to="/normas" className="hover:text-[#FF8C42] transition-colors">Normas y licencias</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => setIsRulesOpen(true)} className="hover:text-[#FF8C42] transition-colors text-left">
                    Normas de la comunidad (Modal)
                  </button>
                </li>
                <li><a href="#" className="hover:text-[#FF8C42] transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-[#FF8C42] transition-colors">Términos de Servicio</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} BeatStory. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
      
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </>
  );
}

export default Footer;