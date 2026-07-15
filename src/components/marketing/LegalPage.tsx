import Navbar from "./Navbar";
import Footer from "./Footer";
import Reveal from "./Reveal";

export type LegalSection = {
  id: string;
  navLabel: string;
  title: string;
  paragraphs?: string[];
  items: React.ReactNode[];
};

export default function LegalPage({
  title,
  titleAccent,
  description,
  sections,
  notice,
}: {
  title: string;
  titleAccent: string;
  description: React.ReactNode;
  sections: LegalSection[];
  notice?: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="bg-white pt-[calc(var(--navbar-h)+75px)] pb-20">
        <Reveal>
          <header className="mx-auto w-[90%] max-w-[1200px] pb-8 text-center lg:pb-[60px]">
            <h1 className="mb-5 text-[2.2rem] leading-[1.1] font-black tracking-[-1px] text-brand-navy lg:text-[3.5rem]">
              {title} <span className="text-brand-red">{titleAccent}</span>
            </h1>
            <p className="mx-auto max-w-[600px] text-[1.15rem] font-medium text-slate-600">
              {description}
            </p>
          </header>
        </Reveal>

        <section className="mx-auto w-[90%] max-w-[1200px]">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[280px_1fr] lg:gap-16">
            <aside className="hidden lg:block lg:sticky lg:top-[calc(var(--navbar-h)+40px)] lg:self-start">
              <h3 className="mb-5 inline-block border-b-2 border-brand-red pb-2.5 text-[1.1rem] font-black tracking-[1px] text-brand-navy uppercase">
                ¿Qué buscas?
              </h3>
              <ul className="flex flex-col border-t border-slate-200">
                {sections.map((s) => (
                  <li key={s.id} className="border-b border-slate-200">
                    <a
                      href={`#${s.id}`}
                      className="block py-3 text-[0.95rem] font-semibold text-slate-600 transition-colors hover:text-brand-red"
                    >
                      {s.navLabel}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="flex flex-col">
              {notice}
              {sections.map((s, i) => (
                <div
                  key={s.id}
                  id={s.id}
                  className={`scroll-mt-[calc(var(--navbar-h)+40px)] py-10 lg:py-14 ${
                    i !== 0 ? "border-t border-slate-200" : ""
                  }`}
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute -top-6 left-0 -z-10 text-[4.5rem] leading-none font-black text-brand-red/[0.06] lg:text-[6rem]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="relative mb-4 text-[1.4rem] font-black tracking-[-0.5px] text-brand-navy lg:text-[1.6rem]">
                      {s.title}
                    </h2>
                  </div>
                  {s.paragraphs?.map((p, pi) => (
                    <p
                      key={pi}
                      className="mb-5 text-[0.95rem] leading-[1.7] font-medium text-slate-600 lg:text-[1.05rem]"
                    >
                      {p}
                    </p>
                  ))}
                  <ul className="flex flex-col divide-y divide-slate-200 border-t border-slate-200">
                    {s.items.map((item, ii) => (
                      <li
                        key={ii}
                        className="flex gap-3 py-3.5 text-[0.95rem] leading-[1.6] text-slate-700"
                      >
                        <span className="mt-0.5 shrink-0 font-black text-brand-red">
                          —
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
