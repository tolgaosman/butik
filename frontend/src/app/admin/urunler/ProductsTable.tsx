"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, Edit2, Trash2, X, Plus } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { AdminProduct, AdminCategory, AdminProductVariant, AdminProductImage } from "@/lib/admin";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { apiMutate, ApiError } from "@/lib/api";
import { revalidateStore } from "../actions";
import { iconButtonDanger, iconButtonNeutral } from "@/lib/adminIconButton";
import { toast } from "@/lib/toast";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" });

const FIXED_SIZES = ["XS", "S", "M", "L", "XL"];
const FALLBACK_IMAGE = "/sevgiBrowserLogo.png";

type SizeRow = { size: string; stock: number };
type Gender = "kadin" | "erkek" | "unisex";

function priceOf(product: AdminProduct): number {
  return product.price_minor / 100;
}

function compareAtOf(product: AdminProduct): number | null {
  return product.compare_at_price_minor != null ? product.compare_at_price_minor / 100 : null;
}

function discountOf(product: AdminProduct): number {
  const compare = compareAtOf(product);
  const price = priceOf(product);
  if (!compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
}

function stockOf(product: AdminProduct): number | null {
  if (!product.variants.length) return null;
  return product.variants.reduce((total, variant) => total + variant.stock, 0);
}

function deriveProductRow(product: AdminProduct) {
  return {
    variants: product.variants,
    productCategories: product.categories,
    compareAt: compareAtOf(product),
    discount: discountOf(product),
    totalStock: stockOf(product),
    isActive: product.is_active,
    createdAt: product.created_at ? new Date(product.created_at) : null,
  };
}

type FormState = {
  name: string;
  description: string;
  price: number;
  discount: number;
  isNew: boolean;
  isActive: boolean;
  gender: Gender;
  categories: number[];
  sizeRows: SizeRow[];
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  price: 0,
  discount: 0,
  isNew: false,
  isActive: true,
  gender: "unisex",
  categories: [],
  sizeRows: [],
};

function formFromProduct(product: AdminProduct): FormState {
  return {
    name: product.name,
    description: product.description ?? "",
    price: compareAtOf(product) ?? priceOf(product),
    discount: discountOf(product),
    isNew: product.is_new,
    isActive: product.is_active,
    gender: product.gender ?? "unisex",
    categories: product.categories.map((c) => c.id),
    sizeRows: product.variants.map((v) => ({ size: v.size ?? "", stock: v.stock })),
  };
}

export function ProductsTable({ products, categories }: { products: AdminProduct[]; categories: AdminCategory[] }) {
  const [localProducts, setLocalProducts] = useState<AdminProduct[]>(products);
  const [query, setQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sizeInput, setSizeInput] = useState("");
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const isOpen = creating || editingProduct !== null;

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr");
    if (!term) return localProducts;

    const matches = (value: string | null | undefined) => !!value && value.toLocaleLowerCase("tr").includes(term);

    return localProducts.filter(
      (p) =>
        matches(p.name) ||
        matches(p.slug) ||
        matches(String(p.id)) ||
        p.categories.some((c) => matches(c.name)) ||
        p.variants.some((v) => matches(v.sku) || matches(v.size)),
    );
  }, [localProducts, query]);

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<AdminProductImage[]>([]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setSizeInput("");
    setImageFile(null);
    setGalleryFiles([]);
    setImagePreview(null);
    setGalleryPreviews([]);
    setCreating(true);
  }

  function openEdit(product: AdminProduct) {
    setEditingProduct(product);
    setForm(formFromProduct(product));
    setSizeInput("");
    setImageFile(null);
    setGalleryFiles([]);
    setImagePreview(product.image || null);
    setGalleryPreviews(product.images);
  }

  function closeModal() {
    setCreating(false);
    setEditingProduct(null);
  }

  function requestDelete(product: AdminProduct) {
    setDeletingProduct(product);
  }

  async function confirmDelete() {
    if (!deletingProduct) return;
    setDeleting(true);
    try {
      await apiMutate(`/admin/products/${deletingProduct.id}`, { method: "DELETE" });
      await revalidateStore();
      setLocalProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      toast.success("Ürün silindi", { description: `"${deletingProduct.name}" kaldırıldı.` });
      setDeletingProduct(null);
    } catch (error) {
      toast.error("Silme işlemi başarısız oldu", {
        description: error instanceof ApiError ? error.message : "Lütfen tekrar deneyin.",
      });
    } finally {
      setDeleting(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setGalleryFiles((prev) => [...prev, ...files]);
  }

  async function handleRemoveExistingGalleryImage(image: AdminProductImage) {
    if (!editingProduct) return;
    try {
      await apiMutate(`/admin/products/${editingProduct.id}/images/${image.id}`, { method: "DELETE" });
      setGalleryPreviews((prev) => prev.filter((img) => img.id !== image.id));
      toast.success("Görsel silindi");
    } catch (error) {
      toast.error("Görsel silinemedi", {
        description: error instanceof ApiError ? error.message : "Lütfen tekrar deneyin.",
      });
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", String(form.price));
      formData.append("discount", String(form.discount));
      formData.append("isNew", form.isNew ? "1" : "0");
      formData.append("isActive", form.isActive ? "1" : "0");
      formData.append("gender", form.gender);
      form.categories.forEach((id) => formData.append("categories[]", String(id)));
      formData.append("sizes", JSON.stringify(form.sizeRows));

      if (imageFile) formData.append("image", imageFile);
      galleryFiles.forEach((file) => formData.append("gallery_images[]", file));

      let saved: AdminProduct;
      if (creating) {
        saved = await apiMutate<AdminProduct>("/admin/products", { method: "POST", body: formData });
        setLocalProducts((prev) => [saved, ...prev]);
        toast.success("Ürün eklendi", { description: `"${form.name}" mağazaya eklendi.` });
      } else if (editingProduct) {
        formData.append("_method", "PUT");
        saved = await apiMutate<AdminProduct>(`/admin/products/${editingProduct.id}`, {
          method: "POST",
          body: formData,
        });
        setLocalProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? saved : p)));
        toast.success("Ürün güncellendi", { description: `"${form.name}" kaydedildi.` });
      } else {
        return;
      }

      await revalidateStore();
      closeModal();
    } catch (error) {
      toast.error(creating ? "Ürün eklenemedi" : "Ürün güncellenemedi", {
        description: error instanceof ApiError ? error.message : "Lütfen tekrar deneyin.",
      });
    } finally {
      setSaving(false);
    }
  }

  const calculatedNewPrice = form.discount > 0 ? form.price - form.price * (form.discount / 100) : form.price;

  function handleAddSize(size?: string) {
    const val = (size ?? sizeInput).trim();
    if (val && !form.sizeRows.some((r) => r.size === val)) {
      setForm((f) => ({ ...f, sizeRows: [...f.sizeRows, { size: val, stock: 0 }] }));
      if (!size) setSizeInput("");
    }
  }

  function handleRemoveSize(index: number) {
    setForm((f) => ({ ...f, sizeRows: f.sizeRows.filter((_, i) => i !== index) }));
  }

  function handleStockChange(index: number, stock: number) {
    setForm((f) => ({
      ...f,
      sizeRows: f.sizeRows.map((r, i) => (i === index ? { ...r, stock: Math.max(0, stock) } : r)),
    }));
  }

  function handleSortSizes() {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const rows = [...form.sizeRows];
    const [dragged] = rows.splice(dragItem.current, 1);
    rows.splice(dragOverItem.current, 0, dragged);
    dragItem.current = null;
    dragOverItem.current = null;
    setForm((f) => ({ ...f, sizeRows: rows }));
  }

  const missingFixedSizes = FIXED_SIZES.filter((s) => !form.sizeRows.some((r) => r.size === s));

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
          <Button variant="solid" onClick={openCreate}>
            <Plus size={16} /> Yeni Ürün
          </Button>
        </div>
      </div>

      <div className="overflow-hidden border border-border bg-surface shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full table-fixed divide-y divide-border">
            <thead>
              <tr className="bg-cream/50">
                <th scope="col" className="w-[20%] py-3.5 px-3 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Ürün</th>
                <th scope="col" className="w-[13%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Kategoriler</th>
                <th scope="col" className="w-[20%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Bedenler / Stok</th>
                <th scope="col" className="w-[11%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Toplam Stok</th>
                <th scope="col" className="w-[12%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Fiyat</th>
                <th scope="col" className="w-[10%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Durum</th>
                <th scope="col" className="w-[10%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Eklendi</th>
                <th scope="col" className="w-[9%] py-3.5 px-3 text-center"><span className="sr-only">İşlemler</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filtered.map((product) => {
                const { variants, productCategories, compareAt, discount, totalStock, isActive, createdAt } =
                  deriveProductRow(product);

                return (
                <tr key={product.id} className="transition-colors duration-200 hover:bg-cream/30">
                  <td className="py-4 pl-6 pr-3">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden border border-border bg-cream">
                        <Image src={product.image || FALLBACK_IMAGE} alt="" fill sizes="48px" className="object-cover" />
                        {product.images.length > 0 && (
                          <span className="absolute bottom-0 right-0 bg-ink/70 px-1 text-[10px] leading-4 text-cream">
                            {product.images.length + 1}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-ink">{product.name}</span>
                          {product.is_new && (
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
                  <td className="px-3 py-4 text-center text-sm">
                    {productCategories.length ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        {productCategories.slice(0, 2).map((c) => (
                          <span key={c.id} className="whitespace-nowrap border border-border bg-cream px-2 py-0.5 text-xs text-ink-soft">
                            {c.name}
                          </span>
                        ))}
                        {productCategories.length > 2 && (
                          <span
                            title={productCategories.slice(2).map((c) => c.name).join(", ")}
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
                  <td className="px-3 py-4 text-center text-sm">
                    {variants.length ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        {variants.slice(0, 4).map((v: AdminProductVariant) => (
                          <span
                            key={v.id ?? v.size}
                            title={`${v.size ?? "Tek beden"} — ${v.stock} adet${v.sku ? ` · ${v.sku}` : ""}`}
                            className={`whitespace-nowrap border px-2 py-0.5 text-xs transition-colors duration-200 ${
                              v.stock === 0
                                ? "border-border bg-surface text-ink-soft/60 line-through"
                                : "border-border bg-cream text-ink-soft"
                            }`}
                          >
                            {v.size ?? "Tek"} <span className="text-ink/70">{v.stock}</span>
                          </span>
                        ))}
                        {variants.length > 4 && (
                          <span className="px-1 py-0.5 text-xs text-ink-soft">+{variants.length - 4}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs italic text-ink-soft">Beden yok</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center text-sm">
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
                  <td className="whitespace-nowrap px-3 py-4 text-center text-sm">
                    <div className="font-medium text-ink">{formatPrice(priceOf(product))}</div>
                    {discount > 0 && compareAt && (
                      <div className="mt-0.5 flex items-center justify-center gap-1.5">
                        <span className="text-xs text-ink-soft line-through">{formatPrice(compareAt)}</span>
                        <span className="bg-sand px-1.5 py-0.5 text-[10px] font-medium text-ink">-%{discount}</span>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center text-sm">
                    <span className="inline-flex items-center gap-2 text-xs text-ink-soft">
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-olive" : "bg-ink-soft/40"}`} />
                      {isActive ? "Yayında" : "Pasif"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center text-xs text-ink-soft">
                    {createdAt ? dateFormatter.format(createdAt) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        href={`/urun/${product.slug ?? product.id}`}
                        className={iconButtonNeutral}
                        title="Mağazada aç"
                      >
                        <ArrowUpRight size={16} />
                      </Link>
                      <button onClick={() => openEdit(product)} className={iconButtonNeutral} title="Düzenle">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => requestDelete(product)} className={iconButtonDanger} title="Sil">
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
                    {query ? `"${query}" için ürün bulunamadı.` : "Henüz ürün yok. Yeni Ürün ile ekleyin."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border md:hidden">
          {filtered.map((product) => {
            const { variants, productCategories, compareAt, discount, totalStock, isActive, createdAt } =
              deriveProductRow(product);

            return (
              <div key={product.id} className="space-y-3 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden border border-border bg-cream">
                    <Image src={product.image || FALLBACK_IMAGE} alt="" fill sizes="48px" className="object-cover" />
                    {product.images.length > 0 && (
                      <span className="absolute bottom-0 right-0 bg-ink/70 px-1 text-[10px] leading-4 text-cream">
                        {product.images.length + 1}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-ink">{product.name}</span>
                      {product.is_new && (
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

                <div>
                  <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Kategoriler</div>
                  {productCategories.length ? (
                    <div className="flex flex-wrap gap-1">
                      {productCategories.slice(0, 4).map((c) => (
                        <span key={c.id} className="whitespace-nowrap border border-border bg-cream px-2 py-0.5 text-xs text-ink-soft">
                          {c.name}
                        </span>
                      ))}
                      {productCategories.length > 4 && (
                        <span className="px-1 py-0.5 text-xs text-ink-soft">+{productCategories.length - 4}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs italic text-ink-soft">Kategorisiz</span>
                  )}
                </div>

                <div>
                  <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Bedenler</div>
                  {variants.length ? (
                    <div className="flex flex-wrap gap-1">
                      {variants.map((v) => (
                        <span
                          key={v.id ?? v.size}
                          className={`whitespace-nowrap border px-2 py-0.5 text-xs transition-colors duration-200 ${
                            v.stock === 0
                              ? "border-border bg-surface text-ink-soft/60 line-through"
                              : "border-border bg-cream text-ink-soft"
                          }`}
                        >
                          {v.size ?? "Tek"} <span className="text-ink/70">{v.stock}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs italic text-ink-soft">Beden yok</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Toplam Stok</div>
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
                  </div>
                  <div>
                    <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Fiyat</div>
                    <div className="font-medium text-ink">{formatPrice(priceOf(product))}</div>
                    {discount > 0 && compareAt && (
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="text-xs text-ink-soft line-through">{formatPrice(compareAt)}</span>
                        <span className="bg-sand px-1.5 py-0.5 text-[10px] font-medium text-ink">-%{discount}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Durum</div>
                    <span className="inline-flex items-center gap-2 text-xs text-ink-soft">
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-olive" : "bg-ink-soft/40"}`} />
                      {isActive ? "Yayında" : "Pasif"}
                    </span>
                  </div>
                  <div>
                    <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-soft">Eklendi</div>
                    <span className="text-xs text-ink-soft">{createdAt ? dateFormatter.format(createdAt) : "—"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 border-t border-border pt-3">
                  <Link href={`/urun/${product.slug ?? product.id}`} className={iconButtonNeutral} title="Mağazada aç">
                    <ArrowUpRight size={16} />
                  </Link>
                  <button onClick={() => openEdit(product)} className={iconButtonNeutral} title="Düzenle">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => requestDelete(product)} className={iconButtonDanger} title="Sil">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-ink-soft">
              {query ? `"${query}" için ürün bulunamadı.` : "Henüz ürün yok. Yeni Ürün ile ekleyin."}
            </p>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} title={creating ? "Yeni Ürün" : "Ürün Düzenle"}>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* İSİM & AÇIKLAMA & YENİ/AKTİF */}
          <div className="space-y-4 rounded border border-border p-4 bg-cream/30">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">Temel Bilgiler</h3>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-ink">Ürün Adı</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-ink">Açıklama</label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={form.isNew}
                  onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))}
                  className="rounded border-border accent-olive focus:ring-olive"
                />
                Yeni Sezon Etiketi
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="rounded border-border accent-olive focus:ring-olive"
                />
                Yayında
              </label>
            </div>
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="block text-sm font-medium text-ink">Cinsiyet</label>
              <div className="flex gap-4">
                {(["kadin", "erkek", "unisex"] as const).map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-ink">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={() => setForm((f) => ({ ...f, gender: g }))}
                      className="accent-olive focus:ring-olive border-border"
                    />
                    {g === "kadin" ? "Kadın" : g === "erkek" ? "Erkek" : "Unisex"}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* RESİM YÜKLEME */}
          <div className="space-y-4 rounded border border-border p-4 bg-cream/30">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">Resimler</h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink">
                Ana Resim (Kapak){creating && <span className="text-red-500"> *</span>}
              </label>
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
              {(galleryPreviews.length > 0 || galleryFiles.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {galleryPreviews.map((img) => (
                    <div key={img.id} className="group relative h-16 w-16 overflow-hidden border border-border rounded">
                      <Image src={img.url} alt="Gallery" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingGalleryImage(img)}
                        aria-label="Görseli sil"
                        className="absolute inset-0 flex items-center justify-center bg-ink/60 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  {galleryFiles.map((file, idx) => (
                    <div key={idx} className="relative h-16 w-16 overflow-hidden border border-dashed border-olive/50 rounded">
                      <Image src={URL.createObjectURL(file)} alt="Yeni galeri görseli" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* KATEGORİLER */}
          <div className="space-y-3 rounded border border-border p-4 bg-cream/30">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">Kategoriler</h3>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto sm:grid-cols-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`cat-${cat.id}`}
                    checked={form.categories.includes(cat.id)}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        categories: e.target.checked
                          ? [...f.categories, cat.id]
                          : f.categories.filter((id) => id !== cat.id),
                      }))
                    }
                    className="rounded border-border accent-olive focus:ring-olive"
                  />
                  <label htmlFor={`cat-${cat.id}`} className="text-sm text-ink">{cat.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* BEDEN / SİZE SEÇİMİ */}
          <div className="space-y-4 rounded border border-border p-4 bg-cream/30">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider">Beden Seçimi</h3>
            <p className="text-xs text-ink-soft">Herhangi bir metin beden olarak eklenebilir — XS/S/M/L/XL, sayı (36) veya yaş grubu (4-5 Yaş).</p>

            {missingFixedSizes.length > 0 && (
              <div className="mb-4">
                <p className="mb-1.5 text-xs text-ink-soft">Hızlı ekle:</p>
                <div className="flex flex-wrap gap-2">
                  {missingFixedSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleAddSize(size)}
                      className="border border-dashed border-border px-2.5 py-1 text-xs text-ink-soft transition-colors duration-200 hover:border-olive hover:text-olive"
                    >
                      + {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSize();
                  }
                }}
                placeholder="Örn: XS, 36, 4-5 Yaş"
                className="flex-1 rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
              />
              <Button variant="solid" onClick={() => handleAddSize()} type="button">Ekle</Button>
            </div>

            {form.sizeRows.length > 0 ? (
              <div className="space-y-2">
                {form.sizeRows.map((row, index) => (
                  <div
                    key={row.size}
                    draggable
                    onDragStart={() => (dragItem.current = index)}
                    onDragEnter={() => (dragOverItem.current = index)}
                    onDragEnd={handleSortSizes}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex items-center justify-between border border-border bg-surface p-2 rounded cursor-move hover:border-olive transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-ink-soft cursor-grab">⋮⋮</span>
                      <span className="text-sm font-medium text-ink">{row.size}</span>
                      <label className="flex items-center gap-1.5 text-xs text-ink-soft">
                        Stok:
                        <input
                          type="number"
                          min="0"
                          value={row.stock}
                          onChange={(e) => handleStockChange(index, Number(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 rounded border border-border bg-cream px-2 py-1 text-xs text-ink focus:border-olive focus:outline-none"
                        />
                      </label>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium text-ink">Normal Fiyat (TL)</label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
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
                    value={form.discount}
                    onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) }))}
                    className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft text-sm">%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded bg-surface p-3 border border-olive/20">
              <span className="text-sm font-medium text-ink">Müşterinin Göreceği Satış Fiyatı:</span>
              <div className="flex items-center gap-3">
                {form.discount > 0 && <span className="text-sm text-ink-soft line-through">{form.price} TL</span>}
                <span className="text-lg font-bold text-olive">{calculatedNewPrice.toFixed(2)} TL</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-surface border-t border-border mt-4 pb-2">
            <Button variant="outline" onClick={closeModal}>İptal</Button>
            <Button variant="solid" onClick={handleSave} loading={saving} disabled={creating && !imageFile}>
              {creating ? "Ürünü Ekle" : "Kaydet"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={deletingProduct !== null} onClose={() => setDeletingProduct(null)} title="Ürünü Sil">
        <div className="space-y-4">
          <p className="text-sm text-ink">
            <strong>&ldquo;{deletingProduct?.name}&rdquo;</strong> ürününü kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeletingProduct(null)}>İptal</Button>
            <Button variant="solid" className="bg-red-600 hover:bg-red-700" onClick={confirmDelete} loading={deleting}>
              Sil
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
