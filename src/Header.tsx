function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-white/20 flex items-center px-6 shadow-lg z-20">
      <h1 className="flex items-baseline gap-3">
        <span className="text-2xl font-serif font-bold text-gray-700 tracking-[0.25em]">
          VIDENTIUM
        </span>
        <span className="text-2xl font-bold font-sans text-gray-600">
          3D Viewer
        </span>
      </h1>
    </header>
  );
}

export default Header;
