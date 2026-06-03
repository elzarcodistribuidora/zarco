/**
 * Interruptor estilo iOS (verde al activar) que envía un checkbox normal dentro
 * del <form>. El input real va oculto (`sr-only`) y `peer-checked:` controla la
 * pista verde y el desplazamiento de la perilla.
 */
export function ToggleSwitch({
  name,
  defaultChecked,
  title,
}: {
  name: string;
  defaultChecked?: boolean;
  title?: string;
}) {
  return (
    <label
      className="relative mx-auto inline-flex cursor-pointer items-center"
      title={title}
    >
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      {/* Pista */}
      <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors duration-200 ease-out peer-checked:bg-[#34C759] peer-focus-visible:ring-2 peer-focus-visible:ring-[#34C759]/45 peer-focus-visible:ring-offset-1" />
      {/* Perilla */}
      <span className="pointer-events-none absolute left-[3px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.3)] transition-transform duration-200 ease-out peer-checked:translate-x-5" />
    </label>
  );
}
