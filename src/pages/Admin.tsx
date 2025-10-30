import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getAdminPassword, setAdminPassword, addProduct, updateProduct, deleteProduct } from "@/lib/storage";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit } from "lucide-react";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    sizes: "",
    images: "",
    description: "",
    inStock: true,
  });

  useEffect(() => {
    const savedPassword = getAdminPassword();
    if (!savedPassword) {
      const newPassword = "SHOP";
      setAdminPassword(newPassword);
      toast({
        title: "ADMIN PASSWORD SET",
        description: `Your admin password is: ${newPassword}`,
        duration: 10000,
      });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setProducts(getProducts());
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    const savedPassword = getAdminPassword();
    if (password === savedPassword) {
      setIsAuthenticated(true);
      toast({ title: "AUTHENTICATED" });
    } else {
      toast({ title: "INCORRECT PASSWORD", variant: "destructive" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product: Product = {
      id: editingId || Date.now().toString(),
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean),
      images: form.images.split(",").map(s => s.trim()).filter(Boolean),
      description: form.description,
      inStock: form.inStock,
    };

    if (editingId) {
      updateProduct(editingId, product);
      toast({ title: "PRODUCT UPDATED" });
    } else {
      addProduct(product);
      toast({ title: "PRODUCT ADDED" });
    }

    setProducts(getProducts());
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      sizes: product.sizes.join(", "),
      images: product.images.join(", "),
      description: product.description,
      inStock: product.inStock,
    });
    setEditingId(product.id);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setProducts(getProducts());
    toast({ title: "PRODUCT DELETED" });
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      category: "",
      sizes: "",
      images: "",
      description: "",
      inStock: true,
    });
    setEditingId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 w-full max-w-md border-2">
          <h1 className="text-4xl mb-6">ADMIN LOGIN</h1>
          <Input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="mb-4 border-2"
          />
          <Button onClick={handleLogin} className="w-full border-2">LOGIN</Button>
          <Link to="/" className="block mt-4 text-center hover:opacity-60">← BACK TO STORE</Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter">ADMIN PANEL</Link>
          <Link to="/shop" className="hover:opacity-60 transition-opacity">VIEW SHOP</Link>
        </nav>
      </header>

      <main className="container mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl mb-6">{editingId ? "EDIT PRODUCT" : "ADD PRODUCT"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="PRODUCT NAME"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="border-2"
              />
              <Input
                type="number"
                step="0.01"
                placeholder="PRICE"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="border-2"
              />
              <Input
                placeholder="CATEGORY"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
                className="border-2"
              />
              <Input
                placeholder="SIZES (comma separated: S, M, L, XL)"
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                className="border-2"
              />
              <Input
                placeholder="IMAGE URLS (comma separated)"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="border-2"
              />
              <Textarea
                placeholder="DESCRIPTION"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border-2 min-h-[100px]"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>IN STOCK</span>
              </label>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 border-2">
                  {editingId ? "UPDATE" : "ADD"} PRODUCT
                </Button>
                {editingId && (
                  <Button type="button" onClick={resetForm} variant="secondary" className="border-2">
                    CANCEL
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div>
            <h2 className="text-3xl mb-6">PRODUCTS ({products.length})</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="p-4 border-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{product.name}</h3>
                      <p className="text-muted-foreground">{product.category}</p>
                      <p className="text-lg mt-2">${product.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
