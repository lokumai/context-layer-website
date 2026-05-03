import Link from "next/link";

const BASE_PATH = "/context-layer-website";

const COLUMNS = [
  {
    heading: "Product",
    items: [
      { href: "/product/context-layer", label: "Context Layer" },
      { href: "/product/code-translation", label: "Code Translation" },
      { href: "/product/code-modernization", label: "Code Modernization" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { href: "/design-system", label: "Design System" },
      {
        href: "https://github.com/amirkiarafiei/microservices-product-catalog",
        label: "Demo workspace",
      },
    ],
  },
  {
    heading: "Legal",
    items: [
      { href: "#", label: "Privacy" },
      { href: "#", label: "Terms" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t border-border-subtle bg-white" data-testid="marketing-footer">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" aria-label="Context Layer home" className="inline-flex items-center">
              {/* biome-ignore lint/performance/noImgElement: logo doesn't need next/image optimization */}
              <img
                src={`${BASE_PATH}/logo_square.svg`}
                alt="Context Layer"
                className="h-18 w-auto lg:h-26"
                width={280}
                height={64}
              />
            </Link>
            <p className="text-caption text-[#777169] max-w-[240px]">
              Build the context your codebase never had.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading} className="space-y-3">
              <h4 className="text-micro uppercase text-[#777169] tracking-[0.08em]">
                {col.heading}
              </h4>
              <ul className="space-y-2">
                {col.items.map((it) => (
                  <li key={it.label}>
                    {it.href.startsWith("http") || it.href === "#" ? (
                      <a
                        href={it.href}
                        className="text-caption text-[#4e4e4e] hover:text-black transition-colors"
                        {...(it.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {it.label}
                      </a>
                    ) : (
                      <Link
                        href={it.href}
                        className="text-caption text-[#4e4e4e] hover:text-black transition-colors"
                      >
                        {it.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-border-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p className="text-tiny text-[#777169]">
            &copy; {year} Context Layer. All rights reserved.
          </p>
          <p className="text-tiny text-[#777169]">Built for the Context Layer Ecosystem.</p>
        </div>
      </div>
    </footer>
  );
}
