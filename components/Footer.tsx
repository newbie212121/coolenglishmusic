export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-neutral-500 text-center">
        © {new Date().getFullYear()} Cool English Music · All rights reserved
      </div>
    </footer>
  );
}
