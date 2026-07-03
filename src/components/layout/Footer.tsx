export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-heading font-bold text-sm">Autoventas Dan</p>
          <p className="text-xs text-muted mt-1 max-w-xs">
            Compra, vende, importa y recibe asesoría automotriz en un solo lugar.
          </p>
        </div>
        <p className="text-xs text-muted">© {new Date().getFullYear()} Autoventas Dan · Guatemala</p>
      </div>
    </footer>
  );
}
