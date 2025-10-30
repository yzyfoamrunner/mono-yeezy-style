import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter">STORE</Link>
          <div className="flex gap-8">
            <Link to="/shop" className="hover:opacity-60 transition-opacity">SHOP</Link>
            <Link to="/admin" className="hover:opacity-60 transition-opacity">ADMIN</Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-8 p-8">
          <h1 className="text-8xl md:text-9xl font-bold">STORE</h1>
          <p className="text-xl tracking-wide">MINIMALIST FASHION</p>
          <Link to="/shop">
            <Button size="lg" className="text-lg px-12 py-6 border-2 border-primary">
              SHOP NOW
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-border p-8 text-center text-sm text-muted-foreground">
        <p>© 2025 STORE. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
};

export default Home;
