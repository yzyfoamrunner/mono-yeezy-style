import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "@/lib/storage";
import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter">STORE</Link>
          <div className="flex gap-8">
            <Link to="/shop" className="hover:opacity-60 transition-opacity">SHOP</Link>
            <Link to="/admin" className="hover:opacity-60 transition-opacity">ADMIN</Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto p-8">
        <h1 className="text-6xl mb-12">ALL PRODUCTS</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">NO PRODUCTS AVAILABLE</p>
            <p className="mt-4">Visit the admin panel to add products</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="border-2 border-border hover:border-foreground transition-all overflow-hidden">
                  <div className="aspect-square bg-muted relative">
                    {product.images[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        NO IMAGE
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl mb-2">{product.name}</h3>
                    <p className="text-muted-foreground mb-2">{product.category}</p>
                    <p className="text-2xl font-bold">${product.price}</p>
                    {!product.inStock && (
                      <p className="mt-2 text-sm text-muted-foreground">OUT OF STOCK</p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
