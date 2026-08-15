import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Lang = "en" | "it";

const STORAGE_KEY = "ma-lang";

type Dict = typeof en;

const en = {
  nav: { home: "Home", about: "About", contact: "Contact" },
  lang: { switchTo: "Passa all'italiano", label: "Language" },
  home: {
    role: "Software Engineer | Embedded Systems & Industrial Automation",
    greeting: "Hi, I'm",
    intro:
      "I build software that connects electronics, microcontrollers, and industrial automation. For more than ten years, I have developed my experience in programming and electronics through professional work, personal projects, teaching, and community activities. Today I lead the software team at Roboze while continuing to work hands-on with embedded systems and automation software.",
    badgeRole: "Head of Software Engineering @ Roboze",
    badgeSpec: "Embedded & Automation Engineer",
    cta: "Get in touch",
    about: "More info",
    portraitAlt: "Marino Andriani portrait",
  },
  about: {
    kicker: "About me",
    title: "Software engineer working across embedded systems, automation, and technology",
    p1: "I'm Marino Andriani, a software engineer with a strong passion for programming, electronics, and automation. I enjoy understanding systems as a whole and turning real-world problems into reliable, understandable software solutions.",
    p2: "I have been Head of Software Engineering at Roboze since July 2023. I coordinate the software team using SCRUM and DevOps platforms, focusing on development processes and their continuous improvement. At the same time, I remain hands-on with automation software for industrial 3D printers and embedded programming.",
    p3: "Embedded programming is still an active part of my work: I develop C/C++ software for Atmel ATmega and SAM microcontrollers and work on electronic design. I also gained professional experience managing and expanding corporate IT infrastructure and networks as IT Manager from 2018 to 2022. IT remains one of my strongest personal interests and an area I continue to explore.",
    p4: "I also work with Python, C#, JavaScript, and common markup technologies. I use them as complementary tools for automation, utilities, prototypes, and personal projects.",
    experienceKicker: "Experience",
    experienceTitle: "Main experiences",
    current: "Current",
    stackKicker: "Skills",
    stackTitle: "What I work with",
    certKicker: "Certifications",
    certTitle: "Certified skills",
    stack: {
      embedded: "Embedded & Electronics",
      automation: "Industrial Automation",
      software: "Software & Scripting",
      it: "IT & Systems",
      tools: "Design Tools",
      leadership: "Leadership & Processes",
    },
    stackNote: "IT infrastructure is past professional experience and a current personal interest, not my present role.",
    certs: {
      swTitle: "SOLIDWORKS — 2021",
      swDesc:
        "Certified SOLIDWORKS Associate (CSWA) — Mechanical Design; Certified SOLIDWORKS Professional Advanced (CSWPA-DT) — Drawing Tools",
      brTitle: "B&R Academy — 2020",
      brDesc: "Automation Diploma: IEC Programming (15/01/2020); Automation Diploma: Motion (22/01/2020)",
    },
    roles: {
      head: "Head of Software Engineering",
      headDesc:
        "Coordinating the software team with SCRUM methodology on a DevOps platform and improving development processes.",
      automation: "Automation Engineer",
      automationDesc:
        "Developing control software for industrial 3D printers with B&R PLCs and IEC 61131-3 languages: LD, ST and FBD.",
      embedded: "Embedded Programmer",
      embeddedDesc:
        "Developing C/C++ software for Atmel ATmega and SAM microcontrollers, along with electronic design work.",
      it: "IT Manager",
      itDesc: "Management and expansion of the corporate IT infrastructure and network.",
      barimakers: "Barimakers — Volunteer",
      barimakersDesc:
        "Programming and electronics courses, open source projects, video tutorials and support for the Makers' Meeting 2014 and 2015.",
      arci: "Circolo Arci Carlo Cafiero — Lecturer",
      arciDesc:
        "Basic electronics courses, PCB design with open source tools and Atmel/Arduino microcontroller programming.",
      apulia: "Apulia Makers 3D — Lecturer",
      apuliaDesc: "Hands-on introduction to programming and electronics for beginners.",
    },
    periods: {
      head: "07/2023 — present",
      automation: "12/2020 — present",
      embedded: "06/2016 — present",
      it: "06/2018 — 06/2022",
      barimakers: "01/2014 — 01/2018",
      arci: "03/2017 — 05/2017",
      apulia: "04/2016",
    },
  },
  contact: {
    kicker: "Contact",
    title: "Let's work together",
    subtitle: "Have a project, job opportunity, or just want to say hello? I'd love to hear from you.",
    directTitle: "Write me directly",
    directText:
      "The quickest way to reach me is email. I usually reply within a few days.",
    directButton: "Send an email",
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
    tagline: "Software engineer focused on embedded systems and industrial automation, with a strong passion for IT.",
  },
};

const it: Dict = {
  nav: { home: "Home", about: "Chi sono", contact: "Contatti" },
  lang: { switchTo: "Switch to English", label: "Lingua" },
  home: {
    role: "Software Engineer | Embedded Systems & Industrial Automation",
    greeting: "Ciao, sono",
    intro:
      "Progetto software che mette in comunicazione elettronica, microcontrollori e automazione industriale. Da oltre dieci anni coltivo programmazione ed elettronica attraverso esperienza professionale, progetti personali, docenza e attività nella community. Oggi guido il team software di Roboze e continuo a lavorare direttamente su sistemi embedded e software di automazione.",
    badgeRole: "Head of Software Engineering @ Roboze",
    badgeSpec: "Embedded & Automation Engineer",
    cta: "Contattami",
    about: "Maggiori informazioni",
    portraitAlt: "Ritratto di Marino Andriani",
  },
  about: {
    kicker: "Chi sono",
    title: "Software engineer tra embedded, automazione e tecnologia",
    p1: "Sono Marino Andriani, software engineer con una forte passione per la programmazione, l'elettronica e l'automazione. Mi interessa capire come funzionano i sistemi nel loro insieme e trasformare problemi concreti in soluzioni software affidabili e comprensibili.",
    p2: "In Roboze ricopro il ruolo di Head of Software Engineering da luglio 2023. Coordino il team software con metodologia SCRUM e piattaforme DevOps, lavorando sull'organizzazione e sull'ottimizzazione dei processi di sviluppo. Continuo allo stesso tempo a contribuire direttamente al software di automazione per stampanti 3D industriali e alla programmazione embedded.",
    p3: "La programmazione embedded è una parte tuttora attiva del mio lavoro: sviluppo software in C/C++ per microcontrollori Atmel ATmega e SAM e mi occupo di progettazione elettronica. Ho inoltre maturato esperienza nella gestione e nell'ampliamento di infrastrutture IT e reti aziendali come IT Manager dal 2018 al 2022. L'IT continua a essere una delle mie principali passioni personali e un ambito che approfondisco costantemente.",
    p4: "Conosco anche Python, C#, JavaScript e le principali tecnologie di markup. Le utilizzo come strumenti complementari per automazione, utility, prototipi e progetti personali.",
    experienceKicker: "Esperienza",
    experienceTitle: "Esperienze principali",
    current: "Attuale",
    stackKicker: "Competenze",
    stackTitle: "Con cosa lavoro",
    certKicker: "Certificazioni",
    certTitle: "Competenze certificate",
    stack: {
      embedded: "Embedded ed elettronica",
      automation: "Automazione industriale",
      software: "Software e scripting",
      it: "IT e sistemi",
      tools: "Strumenti di progettazione",
      leadership: "Leadership e processi",
    },
    stackNote: "L'area IT è esperienza professionale pregressa e interesse personale attuale, non il mio ruolo odierno.",
    certs: {
      swTitle: "SOLIDWORKS — 2021",
      swDesc:
        "Certified SOLIDWORKS Associate (CSWA) — Mechanical Design; Certified SOLIDWORKS Professional Advanced (CSWPA-DT) — Drawing Tools",
      brTitle: "B&R Academy — 2020",
      brDesc: "Automation Diploma: IEC Programming (15/01/2020); Automation Diploma: Motion (22/01/2020)",
    },
    roles: {
      head: "Head of Software Engineering",
      headDesc:
        "Coordinamento del team software con metodologia SCRUM su piattaforma DevOps e ottimizzazione dei processi di sviluppo.",
      automation: "Automation Engineer",
      automationDesc:
        "Sviluppo del software di controllo per stampanti 3D industriali con PLC B&R e linguaggi IEC 61131-3: LD, ST e FBD.",
      embedded: "Embedded Programmer",
      embeddedDesc:
        "Sviluppo software in C/C++ per microcontrollori Atmel ATmega e SAM e attività di progettazione elettronica.",
      it: "IT Manager",
      itDesc: "Gestione e ampliamento dell'infrastruttura IT e della rete aziendale.",
      barimakers: "Barimakers — Volontariato",
      barimakersDesc:
        "Corsi di programmazione ed elettronica, progetti open source, video tutorial e supporto all'organizzazione dei Makers' Meeting 2014 e 2015.",
      arci: "Circolo Arci Carlo Cafiero — Docente",
      arciDesc:
        "Corsi di elettronica di base, progettazione PCB con strumenti open source e programmazione di microcontrollori Atmel e Arduino.",
      apulia: "Apulia Makers 3D — Docente",
      apuliaDesc: "Introduzione pratica alla programmazione e all'elettronica per principianti.",
    },
    periods: {
      head: "07/2023 — oggi",
      automation: "12/2020 — oggi",
      embedded: "06/2016 — oggi",
      it: "06/2018 — 06/2022",
      barimakers: "01/2014 — 01/2018",
      arci: "03/2017 — 05/2017",
      apulia: "04/2016",
    },
  },
  contact: {
    kicker: "Contatti",
    title: "Lavoriamo insieme",
    subtitle: "Hai un progetto, un'opportunità di lavoro o vuoi solo salutare? Scrivimi pure.",
    directTitle: "Scrivimi direttamente",
    directText: "Il modo più rapido per contattarmi è l'email. Di solito rispondo entro pochi giorni.",
    directButton: "Invia una email",
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
    tagline: "Software engineer specializzato in sistemi embedded e automazione industriale, con una forte passione per l'IT.",
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
