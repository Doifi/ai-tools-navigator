interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

/**
 * 首页区块标题组件，统一 section 的标题层级和说明文案。
 */
export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-foreground/68">{description}</p>
    </div>
  );
}

export default SectionHeading;

