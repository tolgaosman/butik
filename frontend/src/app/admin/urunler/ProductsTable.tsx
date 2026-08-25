"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, Edit2, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { apiMutate } from "@/lib/api";
import { revalidateStore } from "../actions";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" });

function priceOf(product: any): number {
  return product.price_minor != null ? product.price_minor / 100 : (product.price ?? 0);
}

function compareAtOf(product: any): number | null {
  if (product.compare_at_price_minor != null) return product.compare_at_price_minor / 100;
  return product.originalPrice ?? null;
}

function discountOf(product: any): number {
  const compare = compareAtOf(product);
  const price = priceOf(product);
  if (!compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
}

function stockOf(product: any): number | null {
  const variants = product.variants ?? [];
  if (!variants.length) return null;
  return variants.reduce((total: number, variant: any) => total + (variant.stock ?? 0), 0);
}

export function ProductsTable({ products, categories }: { products: any[], categories: any[] }) {
  const [localProducts, setLocalProducts] = useState<any[]>(products);
  const [query, setQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form state
  const [nameInput, setNameInput] = useState("");
  const [priceInput, setPriceInput] = useState(0);
  const [discountInput, setDiscountInput] = useState(0);
  const [isNewInput, setIsNewInput] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  
  // Size Form State
  const [sizeType, setSizeType] = useState<"yas" | "sayi" | "harf">("harf");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr");
    if (!term) return localProducts;

    const matches = (value: unknown) =>
      typeof value === "string" && value.toLocaleLowerCase("tr").includes(term);

    return localProducts.filter(
      (p) =>
        matches(p.name) ||
        matches(p.slug) ||
        matches(String(p.id)) ||
        (p.categories ?? []).some((c: any) => matches(c?.name)) ||
        (p.variants ?? []).some((v: any) => matches(v?.sku) || matches(v?.size)),
    );
  }, [localProducts, query]);

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setNameInput(product.name);
    
    const priceTL = product.compare_at_price_minor ? product.compare_at_price_minor / 100 : (product.price_minor ? product.price_minor / 100 : product.price);
    setPriceInput(priceTL || 0);
    
    if (product.compare_at_price_minor && product.compare_at_price_minor > product.price_minor) {
      const original = product.compare_at_price_minor;
      const current = product.price_minor;
      const diff = original - current;
      setDiscountInput(Math.round((diff / original) * 100));
    } else if (product.originalPrice && product.originalPrice > product.price) {
      const original = product.originalPrice;
      const current = product.price;
      const diff = original - current;
      setDiscountInput(Math.round((diff / original) * 100));
    } else {
      setDiscountInput(0);
    }
    
    setIsNewInput(!!product.isNew || !!product.is_new);
    
    setSelectedCategories(product.categories ? product.categories.map((c: any) => c.id) : []);
    
    const variantSizes = product.variants ? product.variants.map((v: any) => v.size) : [];
    setSelectedSizes(variantSizes);
    setSizeInput("");

    // Reset image states
    setImageFile(null);
    setGalleryFiles([]);
    setImagePreview(product.image || null);
    setGalleryPreviews(product.images ? product.images.map((img: any) => img.url) : []);
  };

  const handleDelete = async (product: any) => {
    if (!window.confirm(`"${product.name}" ürününü kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;

    try {
      await apiMutate(`/admin/products/${product.id}`, { method: "DELETE" });
      await revalidateStore();
      setLocalProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (error) {
      console.error("Ürün silinemedi:", error);
      alert("Silme işlemi sırasında hata oluştu.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    
    try {
      const formData = new FormData();
      formData.append("_method", "PUT"); // Laravel PUT fake via POST
      formData.append("name", nameInput);
      formData.append("price", String(priceInput));
      formData.append("discount", String(discountInput));
      formData.append("isNew", isNewInput ? "1" : "0");

      selectedCategories.forEach(id => formData.append("categories[]", String(id)));
      selectedSizes.forEach(size => formData.append("sizes[]", size));

      if (imageFile) {
        formData.append("image", imageFile);
      }
      
      galleryFiles.forEach((file) => {
        formData.append("gallery_images[]", file);
      });

      const res = (await apiMutate(`/admin/products/${editingProduct.id}`, {
        method: "POST", // Use POST for FormData, _method takes care of PUT
        body: formData
      })) as any;

      await revalidateStore();

      setLocalProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...res }
            : p
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Ürün güncellenemedi:", error);
      alert("Bir hata oluştu.");
    }
  };

  const calculatedNewPrice = discountInput > 0 ? priceInput - (priceInput * (discountInput / 100)) : priceInput;

  const handleAddSize = () => {
    const val = sizeInput.trim();
    if (val && !selectedSizes.includes(val)) {
      setSelectedSizes([...selectedSizes, val]);
      setSizeInput("");
    }
  };

  const handleRemoveSize = (index: number) => {
    setSelectedSizes(selectedSizes.filter((_, i) => i !== index));
  };

  const handleSortSizes = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const _sizes = [...selectedSizes];
    const draggedItemContent = _sizes.splice(dragItem.current, 1)[0];
    _sizes.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setSelectedSizes(_sizes);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün adı, kod, kategori veya beden ara..."
            aria-label="Ürün ara"
            className="w-full border border-border bg-cream py-2 pl-9 pr-4 text-sm text-ink transition-colors duration-200 placeholder:text-ink-soft focus:border-olive focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-ink-soft">
            {filtered.length} / {localProducts.length} ürün
          </p>
          <Button variant="solid" onClick={() => {
            alert("Yeni ürün ekleme özelliği backend entegrasyonu ile aktif edilecektir.");
          }}>
            Yeni Ürün
          </Button>
        </div>
      </div>

      <div className="overflow-hidden border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-cream/50">
                <th scope="col" className="whitespace-nowrap py-3.5 pl-6 pr-3 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Ürün</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Kategoriler</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Bedenler / Stok</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-ink-soft">Toplam Stok</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-ink-soft">Fiyat</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Durum</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Eklendi</th>
                <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-6"><span className="sr-only">İşlemler</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filtered.map((product: any) => {
                const variants = product.variants ?? [];
                const productCategories = product.categories ?? [];
                const compareAt = compareAtOf(product);
                const discount = discountOf(product);
                const totalStock = stockOf(product);
                const isActive = product.is_active !== false;
                const createdAt = product.created_at ? new Date(product.created_at) : null;

                return (
                <tr key={product.id} className="transition-colors duration-200 hover:bg-cream/30">
                  <td className="py-4 pl-6 pr-3">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden border border-border bg-cream">
                        <Image src={product.image} alt="" fill sizes="48px" className="object-cover" />
                        {(product.images ?? []).length > 0 && (
                          <span className="absolute bottom-0 right-0 bg-ink/70 px-1 text-[10px] leading-4 text-cream">
                            {(product.images ?? []).length + 1}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-ink">{product.name}</span>
                          {(product.isNew || product.is_new) && (
                            <span className="whitespace-nowrap bg-sand px-1.5 py-0.5 text-[10px] font-medium tracking-[0.05em] text-ink">
                              YENİ
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-ink-soft">
                          #{product.id} · {product.slug ?? "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {productCategories.length ? (
                      <div className="flex max-w-[14rem] flex-wrap gap-1">
                        {productCategories.slice(0, 2).map((c: any) => (
                          <span key={c.id} className="whitespace-nowrap border border-border bg-cream px-2 py-0.5 text-xs text-ink-soft">
                            {c.name}
                          </span>
                        ))}
                        {productCategories.length > 2 && (
                          <span
                            title={productCategories.slice(2).map((c: any) => c.name).join(", ")}
                            className="px-1 py-0.5 text-xs text-ink-soft"
                          >
                            +{productCategories.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs italic text-ink-soft">Kategorisiz</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {variants.length ? (
                      <div className="flex max-w-[16rem] flex-wrap gap-1">
                        {variants.slice(0, 4).map((v: any) => {
                          const stock = v.stock ?? 0;
                          return (
                            <span
                              key={v.id ?? v.size}
                              title={`${v.size ?? "Tek beden"} — ${stock} adet${v.sku ? ` · ${v.sku}` : ""}`}
                              className={`whitespace-nowrap border px-2 py-0.5 text-xs transition-colors duration-200 ${
                                stock === 0
                                  ? "border-border bg-surface text-ink-soft/60 line-through"
                                  : "border-border bg-cream text-ink-soft"
                              }`}
                            >
                              {v.size ?? "Tek"} <span className="text-ink/70">{stock}</span>
                            </span>
                          );
                        })}
                        {variants.length > 4 && (
                          <span className="px-1 py-0.5 text-xs text-ink-soft">+{variants.length - 4}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs italic text-ink-soft">Beden yok</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right text-sm">
                    {totalStock === null ? (
                      <span className="text-ink-soft">—</span>
                    ) : (
                      <span
                        className={
                          totalStock === 0
                            ? "font-medium text-olive-dark"
                            : totalStock <= 5
                              ? "font-medium text-gold"
                              : "text-ink"
                        }
                      >
                        {totalStock === 0 ? "Tükendi" : `${totalStock} adet`}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-right text-sm">
                    <div className="font-medium text-ink">{formatPrice(priceOf(product))}</div>
                    {discount > 0 && compareAt && (
                      <div className="mt-0.5 flex items-center justify-end gap-1.5">
                        <span className="text-xs text-ink-soft line-through">{formatPrice(compareAt)}</span>
                        <span className="bg-sand px-1.5 py-0.5 text-[10px] font-medium text-ink">-%{discount}</span>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className="inline-flex items-center gap-2 text-xs text-ink-soft">
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-olive" : "bg-ink-soft/40"}`} />
                      {isActive ? "Yayında" : "Pasif"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-ink-soft">
                    {createdAt ? dateFormatter.format(createdAt) : "—"}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/urun/${product.slug ?? product.id}`}
                        className="inline-flex items-center gap-1 text-xs text-ink-soft transition-colors duration-200 hover:text-olive"
                        title="Mağazada aç"
                      >
                        <ArrowUpRight size={16} />
                      </Link>
                      <button 
                        onClick={() => handleEdit(product)} 
                        className="text-ink-soft hover:text-olive transition-colors" 
                        title="Düzenle"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product)} 
                        className="text-ink-soft hover:text-red-600 transition-colors" 
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-ink-soft">
                    &ldquo;{query}&rdquo; için ürün bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Ürün Düzenle"
      >
        {editingProduct && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* İSİM & YENİ ETİKETİ */}
            <div className="space-y-4 rounded border border-border p-4 bg-cream/30">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">Temel Bilgiler</h3>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-ink">Ürün Adı</label>
                <input
                  id="name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="isNew"
                  type="checkbox"
                  checked={isNewInput}
                  onChange={(e) => setIsNewInput(e.target.checked)}
                  className="rounded border-border text-olive focus:ring-olive"
                />
                <label htmlFor="isNew" className="text-sm font-medium text-ink">Yeni Sezon Etiketi</label>
              </div>
            </div>

            {/* RESİM YÜKLEME */}
            <div className="space-y-4 rounded border border-border p-4 bg-cream/30">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">Resimler</h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink">Ana Resim (Kapak)</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative h-16 w-16 overflow-hidden border border-border rounded">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-ink-soft file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-olive file:text-surface hover:file:bg-olive/90"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <label className="block text-sm font-medium text-ink">Galeri Resimleri</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryChange}
                  className="text-sm text-ink-soft file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-olive file:text-surface hover:file:bg-olive/90"
                />
                {galleryPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {galleryPreviews.map((preview, idx) => (
                      <div key={idx} className="relative h-16 w-16 overflow-hidden border border-border rounded">
                        <Image src={preview} alt="Gallery Preview" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* KATEGORİLER */}
            <div className="space-y-3 rounded border border-border p-4 bg-cream/30">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">Kategoriler</h3>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`cat-${cat.id}`}
                      checked={selectedCategories.includes(cat.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedCategories([...selectedCategories, cat.id]);
                        else setSelectedCategories(selectedCategories.filter(id => id !== cat.id));
                      }}
                      className="rounded border-border text-olive focus:ring-olive"
                    />
                    <label htmlFor={`cat-${cat.id}`} className="text-sm text-ink">{cat.name}</label>
                  </div>
                ))}
              </div>
            </div>


            {/* BEDEN / SİZE SEÇİMİ */}
            <div className="space-y-4 rounded border border-border p-4 bg-cream/30">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">Beden Seçimi</h3>
              
              <div className="flex gap-6 mb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
                  <input type="radio" name="sizeType" value="yas" checked={sizeType === 'yas'} onChange={() => setSizeType('yas')} className="text-olive focus:ring-olive border-border" />
                  Yaş Grubu
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
                  <input type="radio" name="sizeType" value="sayi" checked={sizeType === 'sayi'} onChange={() => setSizeType('sayi')} className="text-olive focus:ring-olive border-border" />
                  Sayı
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
                  <input type="radio" name="sizeType" value="harf" checked={sizeType === 'harf'} onChange={() => setSizeType('harf')} className="text-olive focus:ring-olive border-border" />
                  Harf
                </label>
              </div>
              
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={sizeInput} 
                  onChange={(e) => setSizeInput(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSize();
                    }
                  }}
                  placeholder={
                    sizeType === 'yas' ? "Örn: 4-5 Yaş, 6-7 Yaş" :
                    sizeType === 'sayi' ? "Örn: 36, 38, 40" :
                    "Örn: XS, S, M, L"
                  }
                  className="flex-1 rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
                />
                <Button variant="solid" onClick={handleAddSize} type="button">Ekle</Button>
              </div>
              
              {selectedSizes.length > 0 ? (
                <div className="space-y-2">
                  {selectedSizes.map((size, index) => (
                    <div 
                      key={size}
                      draggable
                      onDragStart={() => (dragItem.current = index)}
                      onDragEnter={() => (dragOverItem.current = index)}
                      onDragEnd={handleSortSizes}
                      onDragOver={(e) => e.preventDefault()}
                      className="flex items-center justify-between border border-border bg-surface p-2 rounded cursor-move hover:border-olive transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-ink-soft cursor-grab">⋮⋮</span>
                        <span className="text-sm font-medium text-ink">{size}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSize(index)}
                        className="text-ink-soft hover:text-red-500 transition-colors px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-soft italic">Henüz beden eklenmedi. (Beden Yok)</p>
              )}
            </div>

            {/* FİYAT & İNDİRİM */}
            <div className="space-y-4 rounded border border-border p-4 bg-cream/30">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">Fiyatlandırma</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="block text-sm font-medium text-ink">Normal Fiyat (TL)</label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    value={priceInput}
                    onChange={(e) => setPriceInput(Number(e.target.value))}
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="discount" className="block text-sm font-medium text-ink">İndirim Oranı (%)</label>
                  <div className="relative">
                    <input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={discountInput}
                      onChange={(e) => setDiscountInput(Number(e.target.value))}
                      className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft text-sm">%</span>
                  </div>
                </div>
              </div>

              {/* HESAPLANAN FİYAT ÖNİZLEMESİ */}
              <div className="mt-4 flex items-center justify-between rounded bg-surface p-3 border border-olive/20">
                <span className="text-sm font-medium text-ink">Müşterinin Göreceği Satış Fiyatı:</span>
                <div className="flex items-center gap-3">
                  {discountInput > 0 && (
                    <span className="text-sm text-ink-soft line-through">{priceInput} TL</span>
                  )}
                  <span className="text-lg font-bold text-olive">{calculatedNewPrice.toFixed(2)} TL</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-surface border-t border-border mt-4 pb-2">
              <Button variant="outline" onClick={() => setEditingProduct(null)}>İptal</Button>
              <Button variant="solid" onClick={handleSave}>Kaydet</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
