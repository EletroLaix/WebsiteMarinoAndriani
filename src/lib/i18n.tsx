import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "it";

const STORAGE_KEY = "ma-lang";

type Dict = typeof en;

const en = {
  nav: { home: "Home", about: "About", contact: "Contact" },
  lang: { switchTo: "Passa all'italiano", label: "Language" },
  home: {
    role: "Software Engineer",
    greeting: "Hi, I'm",
    intro:
      "Italian software engineer focused on industrial automation, embedded systems, and web development. I lead software teams and still love writing code that solves real problems.",
    cta: "Get in touch",
    about: "About me",
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
    experienceTitle: "Where I've worked",
    educationKicker: "Education",
    educationTitle: "What I studied",
    skillsKicker: "Skills",
    skillsTitle: "What I work with",
    skills: {
      languages: "Languages",
      automation: "Industrial automation",
      web: "Web",
      backend: "Backend & Data",
      tools: "Tools & OS",
      cad: "Design & CAD",
    },
    roles: {
      head: "Head of software engineering",
      headDesc: "Managing the software team with SCRUM and DevOps, optimizing development processes.",
      automation: "Automation engineer",
      automationDesc: "Software development for industrial 3D printers using B&R PLCs and IEC languages.",
      it: "IT Manager",
      itDesc: "Managing and scaling company IT infrastructure and network.",
      embedded: "Embedded programmer",
      embeddedDesc: "Firmware development for Atmel ATmega/SAM MCUs in C/C++ and electronic design.",
      teacher: "Teacher",
      teacherArciDesc: "Electronics courses using open-source PCB software and Atmel/Arduino programming.",
      teacherApuliaDesc: "Programming and electronics basics for beginners, with hands-on projects.",
    },
    periods: {
      head: "Jul 2023 — present",
      automation: "Dec 2020 — present",
      it: "Jun 2018 — Jun 2022",
      embedded: "Jun 2016 — present",
      arci: "Mar 2017 — May 2017",
      apulia: "Apr 2016",
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
    role: "Software Engineer",
    greeting: "Ciao, sono",
    intro:
      "Software engineer italiano specializzato in automazione industriale, sistemi embedded e sviluppo web. Guido team di sviluppo e continuo a scrivere codice che risolve problemi reali.",
    cta: "Contattami",
    about: "Chi sono",
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
    experienceTitle: "Dove ho lavorato",
    educationKicker: "Formazione",
    educationTitle: "Cosa ho studiato",
    skillsKicker: "Competenze",
    skillsTitle: "Con cosa lavoro",
    skills: {
      languages: "Linguaggi",
      automation: "Automazione industriale",
      web: "Web",
      backend: "Backend & Dati",
      tools: "Strumenti & OS",
      cad: "Progettazione & CAD",
    },
    roles: {
      head: "Head of software engineering",
      headDesc: "Gestione del team software con SCRUM e DevOps, ottimizzando i processi di sviluppo.",
      automation: "Automation engineer",
      automationDesc: "Sviluppo software per stampanti 3D industriali con PLC B&R e linguaggi IEC.",
      it: "IT Manager",
      itDesc: "Gestione e crescita dell'infrastruttura IT e della rete aziendale.",
      embedded: "Programmatore embedded",
      embeddedDesc: "Sviluppo firmware per microcontrollori Atmel ATmega/SAM in C/C++ e progettazione elettronica.",
      teacher: "Docente",
      teacherArciDesc: "Corsi di elettronica con software PCB open source e programmazione Atmel/Arduino.",
      teacherApuliaDesc: "Basi di programmazione ed elettronica per principianti, con progetti pratici.",
    },
    periods: {
      head: "Lug 2023 — oggi",
      automation: "Dic 2020 — oggi",
      it: "Giu 2018 — Giu 2022",
      embedded: "Giu 2016 — oggi",
      arci: "Mar 2017 — Mag 2017",
      apulia: "Apr 2016",
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

type I18nValue = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void; t: Dict };

const I18nContext = createContext<I18nValue>({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
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
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const detected = detectLang();
    setLangState(detected);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "it" ? "en" : "it";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <I18nContext.Provider value={{ lang, setLang, toggle, t: dictionaries[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
