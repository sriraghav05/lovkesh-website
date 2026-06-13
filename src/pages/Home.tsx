import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, animate } from "framer-motion";
import logoSrc from "@assets/ls_logo_clean.png";
import headshotSrc from "@assets/lovkesh_headshot_v2.png";
import dellaLogo from "@assets/logos/della_townships.webp";
import dellaResortsLogo from "@assets/logos/della_resorts.webp";
import yesBankLogo from "@assets/logos/clean/yesbank.png";
import anantaSpaLogo from "@assets/logos/clean/ananta_spa.png";
import anantaGlobalLogo from "@assets/logos/clean/ananta_global.png";
import anantaEliteLogo from "@assets/logos/clean/ananta_elite.png";
import jaypeeLogo from "@assets/logos/clean/jaypee.png";
import anantaDwarkaLogo from "@assets/logos/clean/ananta_dwarka.png";
import cambayLogo from "@assets/logos/clean/cambay.png";
import hyattLogo from "@assets/logos/clean/hyatt.png";
import hotelOmTowerLogo from "@assets/logos/clean/hotel_om_tower.png";
import brownSugarLogo from "@assets/logos/brown_sugar.png";
import mpstdcLogo from "@assets/logos/mpstdc.png";
import rtdcLogo from "@assets/logos/clean/rtdc.png";
import jaipurNationalUniLogo from "@assets/logos/clean/jaipur_national_uni.png";
import jecrcLogo from "@assets/logos/clean/jecrc.png";

const FILTER_CLEAN = "grayscale(1) brightness(1.4) contrast(1.1)";
const FILTER_INVERT = "invert(1) grayscale(1) brightness(0.85)";

const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } }
};

const FADE_IN = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease: "easeOut" } }
};

function useEmail() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const parts = ["srilovkesh", "@", "gmail", ".", "com"];
    setEmail(parts.join(""));
  }, []);
  return email;
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView.current) {
          inView.current = true;
          const controls = animate(0, target, {
            duration: 2,
            ease: "easeOut",
            onUpdate(val) {
              if (ref.current) ref.current.textContent = Math.round(val) + suffix;
            },
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

function Marquee() {
  const items = ["Hospitality", "Strategy", "Leadership", "Consulting", "Operations", "Excellence", "Brand Building", "Real Estate", "Precision"];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/[0.06] py-5 bg-white/[0.01] select-none">
      <motion.div
        className="flex gap-12 whitespace-nowrap w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-xs tracking-[0.35em] uppercase text-muted-foreground/30 flex items-center gap-12">
            {item}
            <span className="text-primary/30 text-base leading-none">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 300, damping: 28 });
  const springY = useSpring(y, { stiffness: 300, damping: 28 });
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovered(!!(t.closest("a") || t.closest("button")));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);
  return (
    <motion.div className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block" style={{ translateX: springX, translateY: springY }}>
      <motion.div
        className="rounded-full bg-primary"
        animate={{ width: hovered ? 36 : 8, height: hovered ? 36 : 8, opacity: hovered ? 0.4 : 0.7, x: hovered ? -18 : -4, y: hovered ? -18 : -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </motion.div>
  );
}

type CompanyEntry = { name: string; logo?: string; filter?: string };

function CompanyBadges({ entries }: { entries: CompanyEntry[] }) {
  return (
    <div className="flex flex-wrap gap-4 mt-6 items-center">
      {entries.map(({ name, logo, filter: f }) =>
        logo ? (
          <div key={name} title={name} className="h-9 flex items-center px-3 border border-white/[0.07] bg-white/[0.02] hover:border-primary/20 transition-colors duration-300">
            <img
              src={logo}
              alt={name}
              className="h-6 w-auto max-w-[110px] object-contain opacity-40 hover:opacity-70 transition-opacity duration-300"
              style={{ filter: f ?? FILTER_CLEAN }}
            />
          </div>
        ) : (
          <span key={name} className="text-[10px] tracking-[0.2em] uppercase border border-primary/20 text-primary/50 px-3 py-2 hover:border-primary/40 hover:text-primary/70 transition-colors duration-300">
            {name}
          </span>
        )
      )}
    </div>
  );
}

type ExpTab = "realEstate" | "hospitality" | "education";

export default function Home() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<ExpTab>("realEstate");
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);
  const email = useEmail();

  useEffect(() => {
    document.body.style.cursor = window.innerWidth >= 768 ? "none" : "auto";
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.cursor = "auto";
    };
  }, []);

  const expData: Record<ExpTab, { period: string; role: string; org: string; note: string }[]> = {
    realEstate: [
      { period: "2024 – Present", role: "Chief Operating Officer", org: "Della Townships", note: "Leading large-scale township development and real estate operations." },
      { period: "2017 – 2024", role: "CEO — Projects & Business Acquisition", org: "Ananta Spa & Resorts", note: "Delivered 160-key resort at Sariska, 250-villa development in Jaipur, 87-room resort at Goa, 60-room acquisition at Gir. Led a 352-key project at Karjat near Mumbai — all on innovative lease-back and co-ownership models." },
      { period: "2008 – 2010", role: "Senior Manager", org: "Yes Bank — Strategic Investment Advisory", note: "Government domain strategy, tourism/hospitality project development, and capacity building mandates." },
      { period: "2001 – 2002", role: "Consultant", org: "Bijou Consultants", note: "Project reports, feasibility studies, concept development and market surveys for hospitality ventures." },
    ],
    hospitality: [
      { period: "2013 – 2024", role: "CEO — Budget Hospitality", org: "Ananta Elite & Ananta Express", note: "Scaled budget hospitality arm to 11 hotels, approximately 800 rooms across India. Full P&L, branding, operations and villa sales." },
      { period: "2014 – 2017", role: "Corporate Director — Quality, Audit & Planning", org: "Ananta Spa & Resorts", note: "Operations of Ananta Pushkar (100 villas) and Udaipur (200 villas). MIS, budgeting, manpower development." },
      { period: "2006 – 2010", role: "General Manager", org: "Cambay Hotels & Resorts", note: "Full hotel operations, revenue management, and business development across the Cambay portfolio." },
      { period: "1996 – 1997", role: "Management Trainee", org: "Mansigh Palace, Ajmer", note: "Foundational training in luxury hotel operations." },
    ],
    education: [
      { period: "2014 – 2017", role: "Founder & Academic Head", org: "Ananta Institute of Hotel Management", note: "Established hotel management schools at Jaipur and Pushkar. Built to ~300 students within 3 years." },
      { period: "2010 – 2014", role: "Director — Learning & Development", org: "Cambay Institute of Hospitality Management", note: "Ran three centres across Jaipur, Neemrana and Udaipur. Oversaw degree and MBA programs, international affiliations, and marketing operations." },
      { period: "2002 – 2008", role: "Assistant Lecturer", org: "IHM Banipark, Jaipur", note: "Student mentorship, placements, and marketing communications. Key speaker at national hospitality seminars." },
    ],
  };

  const companyLogos: Record<ExpTab, CompanyEntry[]> = {
    realEstate: [
      { name: "Della Townships", logo: dellaLogo, filter: FILTER_INVERT },
      { name: "Yes Bank — SIA·G", logo: yesBankLogo },
      { name: "Ananta Spa & Resorts", logo: anantaSpaLogo },
      { name: "Ananta Dwarka", logo: anantaDwarkaLogo },
      { name: "MPSTDC", logo: mpstdcLogo, filter: FILTER_INVERT },
      { name: "RTDC", logo: rtdcLogo },
    ],
    hospitality: [
      { name: "Della Resorts", logo: dellaResortsLogo, filter: FILTER_INVERT },
      { name: "Cambay Hotels", logo: cambayLogo },
      { name: "Ananta Global Hospitality", logo: anantaGlobalLogo },
      { name: "Jaypee Hotels & Resorts", logo: jaypeeLogo, filter: FILTER_INVERT },
      { name: "Hyatt South Asia", logo: hyattLogo },
      { name: "Hotel Om Tower", logo: hotelOmTowerLogo },
      { name: "Brown Sugar", logo: brownSugarLogo, filter: FILTER_INVERT },
    ],
    education: [
      { name: "Cambay Institute", logo: cambayLogo },
      { name: "Jaipur National University", logo: jaipurNationalUniLogo },
      { name: "JECRC University", logo: jecrcLogo },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <CustomCursor />

      {/* Grain overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Navigation */}
      <motion.nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? "py-4 backdrop-blur-xl bg-background/90 border-b border-white/[0.06]" : "py-8"}`}>
        <div className="container mx-auto px-6 md:px-16 flex justify-between items-center">
          <a href="#" className="flex items-center gap-3">
            <img src={logoSrc} alt="LS" className="h-12 w-auto object-contain" style={{ filter: "brightness(1.3) contrast(1.1) saturate(1.2)" }} />
          </a>
          <div className="hidden md:flex gap-10 text-xs tracking-[0.25em] uppercase text-muted-foreground">
            {["About", "Experience", "Expertise", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-foreground transition-colors duration-300 relative group py-1">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-400 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="h-[100dvh] flex flex-col justify-center items-center text-center relative px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(201,169,110,0.05),transparent)] pointer-events-none" />
        <motion.div style={{ y: heroY }} className="z-10 w-full">
          <motion.div initial="hidden" animate="visible" variants={STAGGER}>
            <motion.div variants={FADE_UP} className="mb-8 flex justify-center">
              <img src={logoSrc} alt="LS" className="w-16 h-16 md:w-20 md:h-20" style={{ filter: "brightness(1.3) contrast(1.1) saturate(1.2)" }} />
            </motion.div>
            <motion.h1 variants={FADE_UP} className="font-serif text-5xl md:text-7xl lg:text-[7rem] tracking-[0.18em] mb-5 uppercase leading-none">
              Lovkesh<br />Srivastava
            </motion.h1>
            <motion.div variants={FADE_UP} className="w-8 h-px bg-primary mx-auto mb-6 opacity-60" />
            <motion.p variants={FADE_UP} className="text-primary/80 tracking-[0.35em] text-xs md:text-sm uppercase mb-10">
              Hotelier &nbsp;&middot;&nbsp; Real Estate &nbsp;&middot;&nbsp; COO
            </motion.p>
            <motion.p variants={FADE_UP} className="max-w-lg mx-auto text-muted-foreground/70 font-light text-base md:text-lg leading-relaxed">
              26 years in hospitality and real estate.<br className="hidden md:block" />
              Hotels opened, brands built, townships led.
            </motion.p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 2, duration: 1.2, ease: "easeOut" }}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 origin-top"
        >
          <div className="w-px h-16 bg-gradient-to-b from-primary/40 to-transparent" />
        </motion.div>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* Stats */}
      <section className="py-16 md:py-20 border-b border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05]">
            {[
              { value: 26, suffix: "+", label: "Years of Experience" },
              { value: 50, suffix: "+", label: "Properties Managed" },
              { value: 3, suffix: "×", label: "Revenue Growth Achieved" },
              { value: 10, suffix: "+", label: "States Nationwide" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={FADE_IN}
                className="bg-background px-8 py-10 md:py-14 text-center group"
              >
                <div className="font-serif text-4xl md:text-5xl text-primary/80 mb-2 group-hover:text-primary transition-colors duration-500">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground/40">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-28 md:py-40 px-6 md:px-16 container mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={FADE_IN}
            className="relative md:sticky md:top-32"
          >
            <div className="aspect-[4/5] relative overflow-hidden bg-zinc-900">
              <img
                src={headshotSrc}
                alt="Lovkesh Srivastava"
                className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                style={{ filter: "contrast(1.05) brightness(0.95)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-primary/20 pointer-events-none hidden md:block" />
            <motion.div
              initial={{ scaleX: 1 }}
              whileInView={{ scaleX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 bg-background origin-right z-10"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={STAGGER}
            className="space-y-7"
          >
            <motion.p variants={FADE_UP} className="text-xs tracking-[0.3em] uppercase text-primary/70">About</motion.p>
            <motion.h2 variants={FADE_UP} className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
              The person<br />behind the numbers.
            </motion.h2>
            <motion.div variants={FADE_UP} className="w-8 h-px bg-primary/60" />
            <motion.p variants={FADE_UP} className="text-muted-foreground text-base leading-[1.9] font-light">
              Over the past 26 years, Lovkesh Srivastava has built his career doing one thing really well — turning ambitious hospitality and real estate ideas into real, functioning properties.
            </motion.p>
            <motion.p variants={FADE_UP} className="text-muted-foreground text-base leading-[1.9] font-light">
              He currently serves as the COO of Della Townships, bringing to the role a wealth of experience across large-scale project development, financial structuring, and operational leadership that few in the industry can match.
            </motion.p>
            <motion.p variants={FADE_UP} className="text-muted-foreground text-base leading-[1.9] font-light">
              Before joining Della, Lovkesh spent over a decade with Ananta Spa & Resorts, where he was central to some of the group's most defining projects — a 160-key luxury resort at Sariska, a 250-villa development in Jaipur, properties in Gir and Goa, and an ongoing 352-key project near Mumbai. All of these were built on innovative lease-back and co-ownership models that he helped design and execute from the ground up. He also scaled the group's budget hospitality arm to 11 hotels and close to 800 rooms across India.
            </motion.p>
            <motion.p variants={FADE_UP} className="text-muted-foreground text-base leading-[1.9] font-light">
              His work has never been limited to one lane. Across his career he has handled everything from vendor negotiations and financial modeling to branding, legal compliances, and building hotel management institutions. He has also advised state tourism bodies in Rajasthan, Madhya Pradesh, and West Bengal on infrastructure development and privatization strategies.
            </motion.p>
            <motion.p variants={FADE_UP} className="text-muted-foreground text-base leading-[1.9] font-light">
              Educated in business management, law, and hospitality — including a certification from the Swiss Education Group in Leysen, Switzerland — Lovkesh brings both the strategic thinking and the hands-on execution mindset that complex, high-stakes projects demand.
            </motion.p>
            <motion.p variants={FADE_UP} className="text-foreground/80 text-base leading-[1.9] font-light italic font-serif">
              Based in Jaipur. Spent his career building things that last.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Marquee 2 */}
      <Marquee />

      {/* Experience */}
      <section id="experience" className="py-28 md:py-40 border-y border-white/[0.05] bg-white/[0.01]">
        <div className="container mx-auto px-6 md:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={STAGGER}
            className="mb-16 md:mb-24"
          >
            <motion.p variants={FADE_UP} className="text-xs tracking-[0.3em] uppercase text-primary/70 mb-4 text-center">Career</motion.p>
            <motion.h2 variants={FADE_UP} className="font-serif text-3xl md:text-5xl text-foreground text-center">Where I've been.</motion.h2>
            <motion.div variants={FADE_UP} className="w-8 h-px bg-primary/60 mx-auto mt-6" />
          </motion.div>

          {/* Tab switcher */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center gap-0 mb-16 border border-white/[0.08] w-full md:w-fit mx-auto"
          >
            {(["realEstate", "hospitality", "education"] as ExpTab[]).map((tab) => {
              const labels: Record<ExpTab, string> = { realEstate: "Real Estate", hospitality: "Hospitality", education: "Education" };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-4 md:px-7 py-3 text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.25em] uppercase transition-all duration-400 ${
                    activeTab === tab ? "bg-primary/10 text-primary border-b border-primary/60" : "text-muted-foreground/50 hover:text-muted-foreground"
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </motion.div>

          {/* Timeline */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="space-y-0">
              {expData[activeTab].map((job, idx) => (
                <div
                  key={idx}
                  className="group py-8 md:py-10 border-b border-white/[0.05] last:border-0"
                >
                  {/* Mobile: stacked */}
                  <div className="md:hidden">
                    <p className="text-[10px] tracking-widest text-primary/60 uppercase mb-2">{job.period}</p>
                    <h3 className="font-serif text-lg text-foreground mb-1">{job.role}</h3>
                    <p className="text-xs text-primary/70 tracking-wider mb-2">{job.org}</p>
                    <p className="text-sm text-muted-foreground/60 font-light leading-relaxed">{job.note}</p>
                  </div>
                  {/* Desktop: 3-col */}
                  <div className="hidden md:grid grid-cols-[1fr_1px_2fr] gap-16 items-start">
                    <div className="text-right pt-1">
                      <p className="text-xs tracking-widest text-primary/70 uppercase">{job.period}</p>
                    </div>
                    <div className="w-px bg-white/10 relative self-stretch">
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-500" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-foreground mb-1">{job.role}</h3>
                      <p className="text-sm text-primary/70 tracking-wider mb-3">{job.org}</p>
                      <p className="text-sm text-muted-foreground/60 font-light leading-relaxed">{job.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Company badges */}
            <div className="mt-10 pt-10 border-t border-white/[0.05]">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground/30 mb-4">Associated with</p>
              <CompanyBadges entries={companyLogos[activeTab]} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Expertise */}
      <section id="expertise" className="py-28 md:py-40 container mx-auto px-6 md:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={STAGGER}
          className="mb-20 md:mb-28"
        >
          <motion.p variants={FADE_UP} className="text-xs tracking-[0.3em] uppercase text-primary/70 mb-4 text-center">What I do</motion.p>
          <motion.h2 variants={FADE_UP} className="font-serif text-3xl md:text-5xl text-foreground text-center">Where I can help.</motion.h2>
          <motion.div variants={FADE_UP} className="w-8 h-px bg-primary/60 mx-auto mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] max-w-6xl mx-auto border border-white/[0.04]">
          {[
            { num: "01", title: "Hospitality Strategy", desc: "Pre-opening strategy, brand positioning, market entry. I've done this enough times to know what fails before it fails." },
            { num: "02", title: "Business Consulting", desc: "Honest advice for owners who want a clearer picture of their asset — not the comfortable version." },
            { num: "03", title: "Operations & Scaling", desc: "Building systems that work without the founder in the room. SOPs, teams, culture — the invisible architecture of good hotels." },
            { num: "04", title: "Real Estate & Development", desc: "End-to-end project development — from financial modeling and vendor management to legal structuring and delivery." },
            { num: "05", title: "Sale & Leaseback", desc: "Designing co-ownership and leaseback models that attract investors while giving owners long-term operational control." },
            { num: "06", title: "Brand Development", desc: "What does this property stand for, and does the experience actually deliver on it? I help close that gap." },
          ].map((pillar, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={FADE_UP}
              className="p-7 md:p-12 bg-background hover:bg-white/[0.025] transition-colors duration-700 group relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 h-px w-0 bg-primary/40 group-hover:w-full transition-all duration-700" />
              <p className="text-xs tracking-[0.3em] text-primary/40 mb-5 font-mono">{pillar.num}</p>
              <h3 className="font-serif text-xl text-foreground mb-4 group-hover:text-primary/90 transition-colors duration-500">{pillar.title}</h3>
              <p className="text-muted-foreground/70 font-light leading-relaxed text-sm">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Worked With */}
      <section className="py-20 md:py-28 border-y border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground/30 text-center mb-12"
          >
            Brands &amp; Institutions
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-white/[0.04]">
            {[
              { name: "Della Townships", logo: dellaLogo, filter: FILTER_INVERT },
              { name: "Della Resorts", logo: dellaResortsLogo, filter: FILTER_INVERT },
              { name: "Ananta Spa & Resorts", logo: anantaSpaLogo },
              { name: "Ananta Global Hospitality", logo: anantaGlobalLogo },
              { name: "Jaypee Hotels & Resorts", logo: jaypeeLogo, filter: FILTER_INVERT },
              { name: "Ananta Dwarka", logo: anantaDwarkaLogo },
              { name: "Yes Bank SIA·G", logo: yesBankLogo },
              { name: "Cambay Hotels", logo: cambayLogo },
              { name: "Hyatt South Asia", logo: hyattLogo },
              { name: "Hotel Om Tower", logo: hotelOmTowerLogo },
              { name: "Brown Sugar", logo: brownSugarLogo, filter: FILTER_INVERT },
              { name: "MPSTDC", logo: mpstdcLogo, filter: FILTER_INVERT },
              { name: "RTDC", logo: rtdcLogo },
              { name: "Jaipur National University", logo: jaipurNationalUniLogo },
              { name: "JECRC University", logo: jecrcLogo },
            ].map(({ name, logo, filter: f }) => (
              <motion.div
                key={name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.6 }}
                title={name}
                className="bg-background flex items-center justify-center px-3 py-6 md:px-6 md:py-8 group hover:bg-white/[0.02] transition-colors duration-500"
              >
                <img
                  src={logo}
                  alt={name}
                  className="h-12 md:h-20 lg:h-24 w-auto max-w-[100px] md:max-w-[180px] object-contain opacity-60 group-hover:opacity-95 transition-opacity duration-500"
                  style={{ filter: f ?? FILTER_CLEAN }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-36 md:py-52 container mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER}
          className="max-w-xl mx-auto space-y-8"
        >
          <motion.p variants={FADE_UP} className="text-xs tracking-[0.3em] uppercase text-primary/70">Get in touch</motion.p>
          <motion.h2 variants={FADE_UP} className="font-serif text-4xl md:text-6xl text-foreground leading-tight">
            Have Land.<br />Let's talk.
          </motion.h2>
          <motion.div variants={FADE_UP} className="w-8 h-px bg-primary/60 mx-auto" />
         
          <motion.div variants={FADE_UP} className="pt-6">
            {email ? (
              <a
                href={`mailto:${email}`}
                rel="noopener noreferrer"
                className="inline-block border border-primary/60 text-primary/90 px-14 py-5 tracking-[0.25em] uppercase text-xs hover:bg-primary hover:text-background hover:border-primary transition-all duration-500 group relative overflow-hidden"
              >
                <span className="relative z-10">Write to me</span>
                <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1]" />
              </a>
            ) : (
              <div className="inline-block border border-primary/20 px-14 py-5 text-muted-foreground/30 text-xs tracking-widest">Loading…</div>
            )}
        </motion.div>

<div className="flex justify-center gap-4 pt-8">
  <a
    href="https://www.linkedin.com/in/lovkesh-srivastava-a11659b/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="text-muted-foreground/50 hover:text-primary transition-colors duration-300"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  </a>

  <a
    href="https://www.instagram.com/journeywithlovkesh/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="text-muted-foreground/50 hover:text-primary transition-colors duration-300"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 7.75 4zm9.5 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
    </svg>
  </a>
</div>

      </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logoSrc} alt="LS" className="h-10 w-auto" style={{ filter: "brightness(1.3) contrast(1.1) saturate(1.2)" }} />
          <p className="text-xs tracking-widest text-muted-foreground/30 uppercase">
            &copy; {new Date().getFullYear()} Lovkesh Srivastava
          </p>
          
          <p className="text-xs tracking-widest text-muted-foreground/20 uppercase">
            Crafted by RS
          </p>
        </div>
      </footer>
    </div>
  );
}
