import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProducts } from "@/lib/storage";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentImage, setCurrentImage] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const products = getProducts();
    const found = products.find(p => p.id === id);
    setProduct(found || null);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4">PRODUCT NOT FOUND</h1>
          <Link to="/shop">
            <Button>BACK TO SHOP</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      toast({
        title: "SELECT SIZE",
        description: "Please select a size before adding to cart",
      });
      return;
    }
    toast({
      title: "ADDED TO CART",
      description: `${product.name} - Size ${selectedSize}`,
    });
  };

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
        <Link to="/shop" className="inline-block mb-8 hover:opacity-60">← BACK</Link>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-muted mb-4">
              {product.images[currentImage] ? (
                <img 
                  src={product.images[currentImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  NO IMAGE
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-20 h-20 border-2 ${currentImage === idx ? 'border-foreground' : 'border-border'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl mb-2">{product.name}</h1>
              <p className="text-muted-foreground mb-4">{product.category}</p>
              <p className="text-3xl font-bold">${product.price}</p>
            </div>

            <p className="text-lg">{product.description}</p>

            {product.sizes.length > 0 && (
              <div>
                <p className="mb-2 font-bold">SELECT SIZE:</p>
                <div className="flex gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 border-2 ${selectedSize === size ? 'bg-foreground text-background' : 'border-border hover:border-foreground'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="lg"
              className="w-full text-lg py-6 border-2"
            >
              {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
