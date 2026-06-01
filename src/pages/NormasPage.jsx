import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Shield, Music, HeartHandshake, Info, ArrowLeft, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AccordionItem = ({ title, icon: Icon, isOpen, onClick, children }) => {
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#1E293B]/30 mb-4 transition-colors hover:border-gray-700">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            isOpen ? "bg-[#FF8C42] text-white shadow-lg shadow-[#FF8C42]/20" : "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-gray-300"
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={cn("text-lg font-semibold transition-colors", isOpen ? "text-white" : "text-gray-300 group-hover:text-white")}>
            {title}
          </span>
        </div>
        <ChevronDown className={cn("w-5 h-5 text-gray-500 transition-transform duration-300", isOpen && "rotate-180 text-[#FF8C42]")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 text-gray-400 text-sm leading-relaxed border-t border-gray-800/50 mt-2">
              <div className="pt-4 space-y-4">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NormasPage = () => {
  const [openSection, setOpenSection] = useState(0);

  const sections = [
    {
      id: 0,
      title: "Para pedir una canción",
      icon: Music,
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-green-400 font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>✅ Puedes pedir</h4>
            <ul className="list-disc list-inside space-y-1 pl-2 marker:text-gray-600">
              <li>Historias personales, anécdotas, dedicatorias.</li>
              <li>Sentimientos abstractos ("soledad urbana", "alegría nostálgica").</li>
              <li>Ideas originales o conceptos creativos tuyos.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-red-400 font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>❌ No puedes pedir</h4>
            <ul className="list-disc list-inside space-y-1 pl-2 marker:text-gray-600">
              <li>Discursos de odio, acoso o violencia explícita.</li>
              <li>Clonación de voz de personas reales (deepfakes).</li>
              <li>Letras protegidas por copyright sin permiso.</li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-gray-700/50">
             <h4 className="text-[#FF8C42] font-medium flex items-center gap-2 mb-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF8C42]"></span>🎧 Entrega y uso</h4>
             <p>Las canciones generadas se entregan para uso personal. Si deseas utilizarlas comercialmente (Spotify, YouTube monetizado, anuncios), debes contactar para gestionar la licencia correspondiente.</p>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Para subir audio / publicar",
      icon: Shield,
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
             <h4 className="text-green-400 font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>✅ Puedes subir</h4>
             <ul className="list-disc list-inside space-y-1 pl-2 marker:text-gray-600">
               <li>Música generada por IA donde tengas los derechos de la plataforma.</li>
               <li>Composiciones propias o colaboraciones autorizadas.</li>
               <li>Experimentación sonora original.</li>
             </ul>
          </div>
          <div className="space-y-3">
             <h4 className="text-red-400 font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>❌ No puedes subir</h4>
             <ul className="list-disc list-inside space-y-1 pl-2 marker:text-gray-600">
               <li>Canciones comerciales de artistas famosos (Copyright Strike).</li>
               <li>Remixes no autorizados de material protegido.</li>
               <li>Contenido difamatorio o ilegal.</li>
             </ul>
          </div>
          <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-gray-700/50">
             <h4 className="text-blue-400 font-medium flex items-center gap-2 mb-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>📌 Transparencia</h4>
             <p>Si tu canción es IA, márcala como tal. Valoramos la honestidad sobre la herramienta usada (Suno, Udio, etc.).</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Moderación y cuidado del espacio",
      icon: HeartHandshake,
      content: (
        <div className="space-y-4">
          <p>BeatStory es una comunidad, no un archivo sin ley. Nos reservamos el derecho de:</p>
          <ul className="list-decimal list-inside space-y-2 pl-2 marker:text-[#FF8C42]">
            <li>Ocultar o eliminar contenido que vulnere estas normas.</li>
            <li>Suspender cuentas que hagan uso abusivo de las solicitudes o comentarios.</li>
            <li>Moderar comentarios que no aporten valor o sean ofensivos.</li>
          </ul>
          <p className="text-xs text-gray-500 mt-4 italic">El objetivo es mantener un feed de alta calidad donde cada historia brille.</p>
        </div>
      )
    },
    {
      id: 3,
      title: "Transparencia (IA y autoría)",
      icon: Info,
      content: (
        <div className="space-y-4">
          <p>
            En BeatStory, la IA es el instrumento, no el autor final. El autor es quien tiene la visión, el motivo y la historia.
          </p>
          <div className="bg-[#0F172A] p-4 rounded-lg border border-gray-800">
             <h5 className="text-white font-medium mb-2">Sobre los derechos de generación</h5>
             <p className="mb-2">
                Dependiendo de la herramienta usada (Suno, Udio, etc.) y tu plan de suscripción en ellas, eres dueño de la canción o no.
             </p>
             <p>
                BeatStory no reclama propiedad sobre tus subidas, pero al publicar aquí, nos das licencia para reproducir y mostrar tu obra dentro de la plataforma.
             </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Normas y Licencias | BeatStory</title>
        <meta name="description" content="Guía de convivencia y normas de uso de BeatStory." />
      </Helmet>

      <div className="min-h-screen bg-[#0F172A] pt-12 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-[#FF8C42]/10 rounded-2xl mb-6 ring-1 ring-[#FF8C42]/20">
              <ShieldCheck className="w-8 h-8 text-[#FF8C42]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Normas y licencias
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Historias que suenan. Un espacio cuidado.
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-2">
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                title={section.title}
                icon={section.icon}
                isOpen={openSection === section.id}
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              >
                {section.content}
              </AccordionItem>
            ))}
          </div>

          {/* Footer Quote */}
          <div className="mt-16 text-center border-t border-gray-800 pt-12">
            <p className="text-xl md:text-2xl font-serif italic text-gray-500 mb-8">
              "Que la historia sea libre… y el respeto también."
            </p>
            
            <Link to="/">
              <Button variant="outline" className="border-[#FF8C42] text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white px-8 py-6 rounded-full transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default NormasPage;