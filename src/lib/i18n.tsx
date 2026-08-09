import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Lang = "en" | "it";

const STORAGE_KEY = "ma-lang";

type Dict = typeof en;

const en = {
  nav: { home: "Home", about: "About", contact: "Contact" },
  lang: { switchTo: "Passa all'italiano", label: "Language" },
  home: {
    role: "Head of Software Engineering | Industrial Automation & Embedded Systems Specialist",
    greeting: "Hi, I'm",
    intro:
      "Bridging hardware, firmware, and cloud software. 10+ years driving industrial 3D printing automation, embedded MCU systems, and high-performance engineering teams.",
    badgeRole: "Head of Software Engineering @ Roboze",
    badgeSpec: "Embedded & Automation Engineer",
    cta: "Get in touch",
    about: "More info",
    portraitAlt: "Marino Andriani portrait",
    ctaTitle: "Have a project in mind?",
    ctaText: "I'm always open to discussing new opportunities, interesting ideas, or collaborations.",
    ctaButton: "Let's talk",
  },
  about: {
    kicker: "About me",
    title: "Software engineer, builder, problem solver",
    p1: "I'm Marino Andriani, a software engineer based in Italy with a deep passion for programming and automation. I enjoy turning complex problems into simple, reliable, and elegant software.",
    p2: "Currently Head of Software Engineering at Roboze SPA, I lead the software team using SCRUM and DevOps practices while still contributing hands-on to industrial automation, embedded systems, and web development.",
    p3: "My background spans PLC programming, embedded C/C++, full-stack web technologies, and IT infrastructure. I care about clean code, intuitive interfaces, and products that actually help people.",
    linkedin: "LinkedIn profile",
    email: "Email me",
    experienceKicker: "Experience",
    experienceTitle: "Career timeline",
    stackKicker: "Tech stack",
    stackTitle: "What I work with",
    certKicker: "Certifications",
    certTitle: "Diplomas & certified skills",
    educationKicker: "Education",
    educationTitle: "What I studied",
    stack: {
      leadership: "Leadership & DevOps",
      embedded: "Embedded & Electronics",
      automation: "Industrial Automation",
      languages: "Languages & Environments",
      cad: "CAD & Prototyping",
    },
    certs: {
      swTitle: "SolidWorks Certified",
      swDesc: "Professional Advanced (Drawing Tools) & Associate (Mechanical Design)",
      brTitle: "B&R Automation Diplomas",
      brDesc: "IEC Programming & Motion Control",
    },
    roles: {
      head: "Head of Software Engineering",
      headDesc:
        "Leading the software engineering team with SCRUM methodology on DevOps platforms. Optimizing the software development lifecycle and system architectures.",
      automation: "Automation Engineer",
      automationDesc:
        "Developing control software for industrial high-performance 3D printers using B&R PLCs and IEC 61131-3 languages (ST, LD, FBD).",
      embedded: "Embedded Programmer & IT Manager",
      embeddedDesc:
        "Firmware development for Atmel ATmega/SAM MCUs in C/C++. Full management of corporate IT infrastructure and networking.",
      teacher: "Lecturer & Volunteer",
      teacherDesc:
        "Barimakers, Apulia Makers 3D and Arci: taught electronics, PCB design (Altium/KiCad) and Arduino programming.",
    },
    periods: {
      head: "07/2023 — present",
      automation: "12/2020 — present",
      embedded: "06/2016 — 06/2022",
      teacher: "2014 — 2018",
    },
    education: {
      poliba: "Computer and Automation Engineering (2014 — not completed)",
      itis: "Mechanical technician diploma (2009 — 2014)",
      br: "Automation Diploma: IEC Programming (2020) and Motion (2020)",
      sw: "ASSOCIATE Mechanical Design (2021) and PROFESSIONAL ADVANCED Drawing Tools (2021)",
    },
  },
  contact: {
    kicker: "Contact",
    title: "Let's work together",
    subtitle: "Have a project, job opportunity, or just want to say hello? I'd love to hear from you.",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    message: "Message",
    messagePlaceholder: "Tell me about your project...",
    send: "Send message",
    sending: "Sending...",
    success: "Message sent! I'll get back to you soon.",
  },
  footer: {
    tagline: "Software engineer focused on automation and web.",
  },
};

const it: Dict = {
  nav: { home: "Home", about: "Chi sono", contact: "Contatti" },
  lang: { switchTo: "Switch to English", label: "Lingua" },
  home: {
    role: "Head of Software Engineering | Automazione Industriale & Sistemi Embedded",
    greeting: "Ciao, sono",
    intro:
      "Un ponte tra hardware, firmware e software cloud. Oltre 10 anni tra automazione della stampa 3D industriale, sistemi embedded a microcontrollore e team di ingegneria ad alte prestazioni.",
    badgeRole: "Head of Software Engineering @ Roboze",
    badgeSpec: "Embedded & Automation Engineer",
    cta: "Contattami",
    about: "Maggiori informazioni",
    portraitAlt: "Ritratto di Marino Andriani",
    ctaTitle: "Hai un progetto in mente?",
    ctaText: "Sono sempre disponibile a parlare di nuove opportunità, idee interessanti o collaborazioni.",
    ctaButton: "Parliamone",
  },
  about: {
    kicker: "Chi sono",
    title: "Software engineer, creatore, problem solver",
    p1: "Sono Marino Andriani, software engineer italiano con una grande passione per la programmazione e l'automazione. Mi piace trasformare problemi complessi in software semplice, affidabile ed elegante.",
    p2: "Attualmente Head of Software Engineering in Roboze SPA, guido il team software con pratiche SCRUM e DevOps, continuando a lavorare in prima persona su automazione industriale, sistemi embedded e sviluppo web.",
    p3: "La mia esperienza spazia dalla programmazione PLC all'embedded C/C++, dalle tecnologie web full-stack all'infrastruttura IT. Tengo al codice pulito, alle interfacce intuitive e a prodotti che aiutano davvero le persone.",
    linkedin: "Profilo LinkedIn",
    email: "Scrivimi",
    experienceKicker: "Esperienza",
    experienceTitle: "Percorso professionale",
    stackKicker: "Tech stack",
    stackTitle: "Con cosa lavoro",
    certKicker: "Certificazioni",
    certTitle: "Diplomi e competenze certificate",
    educationKicker: "Formazione",
    educationTitle: "Cosa ho studiato",
    stack: {
      leadership: "Leadership & DevOps",
      embedded: "Embedded & Elettronica",
      automation: "Automazione industriale",
      languages: "Linguaggi & Ambienti",
      cad: "CAD & Prototipazione",
    },
    certs: {
      swTitle: "SolidWorks Certified",
      swDesc: "Professional Advanced (Drawing Tools) e Associate (Mechanical Design)",
      brTitle: "Diplomi B&R Automation",
      brDesc: "IEC Programming e Motion Control",
    },
    roles: {
      head: "Head of Software Engineering",
      headDesc:
        "Guido il team di software engineering con metodologia SCRUM su piattaforme DevOps, ottimizzando ciclo di sviluppo e architetture di sistema.",
      automation: "Automation Engineer",
      automationDesc:
        "Sviluppo del software di controllo per stampanti 3D industriali ad alte prestazioni con PLC B&R e linguaggi IEC 61131-3 (ST, LD, FBD).",
      embedded: "Programmatore Embedded & IT Manager",
      embeddedDesc:
        "Sviluppo firmware per microcontrollori Atmel ATmega/SAM in C/C++. Gestione completa dell'infrastruttura IT e di rete aziendale.",
      teacher: "Docente & Volontario",
      teacherDesc:
        "Barimakers, Apulia Makers 3D e Arci: corsi di elettronica, progettazione PCB (Altium/KiCad) e programmazione Arduino.",
    },
    periods: {
      head: "07/2023 — oggi",
      automation: "12/2020 — oggi",
      embedded: "06/2016 — 06/2022",
      teacher: "2014 — 2018",
    },
    education: {
      poliba: "Ingegneria Informatica e dell'Automazione (2014 — non completato)",
      itis: "Diploma di tecnico meccanico (2009 — 2014)",
      br: "Diploma Automation: IEC Programming (2020) e Motion (2020)",
      sw: "ASSOCIATE Mechanical Design (2021) e PROFESSIONAL ADVANCED Drawing Tools (2021)",
    },
  },
  contact: {
    kicker: "Contatti",
    title: "Lavoriamo insieme",
    subtitle: "Hai un progetto, un'opportunità di lavoro o vuoi solo salutare? Scrivimi pure.",
    name: "Nome",
    namePlaceholder: "Il tuo nome",
    email: "Email",
    emailPlaceholder: "tu@esempio.it",
    message: "Messaggio",
    messagePlaceholder: "Raccontami del tuo progetto...",
    send: "Invia messaggio",
    sending: "Invio...",
    success: "Messaggio inviato! Ti risponderò al più presto.",
  },
  footer: {
    tagline: "Software engineer specializzato in automazione e web.",
  },
};

const dictionaries: Record<Lang, Dict> = { en, it };

type I18nValue = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void; isTransitioning: boolean; t: Dict };

const I18nContext = createContext<I18nValue>({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
  isTransitioning: false,
  t: en,
});

function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "it") return stored;
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return langs.some((l) => l?.toLowerCase().startsWith("it")) ? "it" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [visibleLang, setVisibleLang] = useState<Lang>("en");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fadeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeInRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const detected = detectLang();
    setVisibleLang(detected);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = visibleLang;
  }, [visibleLang]);

  const clearTimers = useCallback(() => {
    if (fadeOutRef.current) {
      clearTimeout(fadeOutRef.current);
      fadeOutRef.current = null;
    }
    if (fadeInRef.current) {
      clearTimeout(fadeInRef.current);
      fadeInRef.current = null;
    }
  }, []);

  const startTransition = useCallback(
    (next: Lang) => {
      if (next === visibleLang) return;
      clearTimers();
      setIsTransitioning(true);
      fadeOutRef.current = setTimeout(() => {
        setVisibleLang(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
        fadeInRef.current = setTimeout(() => {
          setIsTransitioning(false);
          fadeInRef.current = null;
        }, 250);
        fadeOutRef.current = null;
      }, 200);
    },
    [visibleLang, clearTimers]
  );

  const setLang = useCallback((l: Lang) => startTransition(l), [startTransition]);
  const toggle = useCallback(() => startTransition(visibleLang === "it" ? "en" : "it"), [visibleLang, startTransition]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return (
    <I18nContext.Provider value={{ lang: visibleLang, setLang, toggle, isTransitioning, t: dictionaries[visibleLang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LangFade({ children, className }: { children: ReactNode; className?: string }) {
  const { isTransitioning } = useI18n();
  return (
    <span
      className={cn(
        "inline-block transition-opacity duration-300 ease-out",
        isTransitioning ? "opacity-0" : "opacity-100",
        className
      )}
    >
      {children}
    </span>
  );
}
