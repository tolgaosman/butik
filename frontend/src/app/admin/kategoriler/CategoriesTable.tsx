"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Edit2, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import type { Category } from "@/lib/products";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { apiMutate } from "@/lib/api";
import { revalidateStore } from "../actions";

// Recursive component to render a category and its children
function CategoryRow({
  category,
  level = 0,
  onEdit,
  onDelete,
}: {
  category: Category;
  level?: number;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.subcategories && category.subcategories.length > 0;

  return (
    <>
      <tr className="transition-colors duration-200 hover:bg-cream/30">
        <td className="py-4 pl-6 pr-3">
          <div
            className="flex items-center gap-3"
            style={{ paddingLeft: `${level * 2}rem` }}
          >
            <div className="w-5 flex-shrink-0">
              {hasChildren ? (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-cream text-ink-soft hover:bg-sand hover:text-ink transition-colors"
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <div className="w-5" /> // spacing placeholder
              )}
            </div>
            
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden border border-border bg-cream">
              {category.image && (
                <Image src={category.image} alt="" fill sizes="40px" className="object-cover" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-ink flex items-center gap-2">
                {category.name}
              </div>
              <div className="text-xs text-ink-soft">{category.id}</div>
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-ink-soft">{category.href}</td>
        <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium text-ink">{category.itemCount}</td>
        <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right">
          <div className="flex items-center justify-end gap-3">
            <Link
              href={category.href}
              className="inline-flex items-center gap-1 text-xs text-ink-soft transition-colors duration-200 hover:text-olive"
              title="Mağazada aç"
            >
              <ArrowUpRight size={16} />
            </Link>
            <button 
              onClick={() => onEdit(category)} 
              className="text-ink-soft hover:text-olive transition-colors" 
              title="Düzenle"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => onDelete(category)} 
              className="text-ink-soft hover:text-red-600 transition-colors" 
              title="Sil"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
      
      {isExpanded && hasChildren && (
        category.subcategories!.map((sub) => (
          <CategoryRow
            key={sub.id}
            category={sub}
            level={level + 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </>
  );
}

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [nameInput, setNameInput] = useState("");

  // Inject mock subcategories on mount to demonstrate the tree view
  useEffect(() => {
    const withMockData = categories.map((c) => {
      // Sadece 'giyim' kategorisine örnek alt kategoriler ekleyelim
      if (c.id === "giyim" || c.name.toLowerCase() === "giyim") {
        return {
          ...c,
          subcategories: [
            {
              id: "ust-giyim",
              name: "Üst Giyim",
              itemCount: 45,
              href: "/giyim/ust-giyim",
              image: "",
              subcategories: [
                { id: "tisort", name: "T-Shirt", itemCount: 20, href: "/giyim/ust-giyim/tisort", image: "" },
                { id: "gomlek", name: "Gömlek", itemCount: 25, href: "/giyim/ust-giyim/gomlek", image: "" }
              ]
            },
            {
              id: "alt-giyim",
              name: "Alt Giyim",
              itemCount: 30,
              href: "/giyim/alt-giyim",
              image: "",
              subcategories: [
                { id: "pantolon", name: "Pantolon", itemCount: 15, href: "/giyim/alt-giyim/pantolon", image: "" },
                { id: "etek", name: "Etek", itemCount: 15, href: "/giyim/alt-giyim/etek", image: "" }
              ]
            }
          ]
        };
      }
      return c;
    });
    setLocalCategories(withMockData);
  }, [categories]);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNameInput(category.name);
  };

  const handleSave = async () => {
    if (!editingCategory) return;
    
    try {
      // Call Laravel Backend API
      await apiMutate(`/admin/categories/${editingCategory.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: nameInput })
      });

      // Clear Next.js cache so the public site updates instantly
      await revalidateStore();

      // Recursive function to update category name in the tree
      const updateCategoryInTree = (cats: Category[]): Category[] => {
        return cats.map(c => {
          if (c.id === editingCategory.id) {
            return { ...c, name: nameInput };
          }
          if (c.subcategories) {
            return { ...c, subcategories: updateCategoryInTree(c.subcategories) };
          }
          return c;
        });
      };

      setLocalCategories((prev) => updateCategoryInTree(prev));
      setEditingCategory(null);
    } catch (error) {
      console.error("Kategori güncellenemedi:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`"${category.name}" kategorisini ve alt kategorilerini kalıcı olarak silmek istediğinize emin misiniz?`)) return;

    try {
      await apiMutate(`/admin/categories/${category.id}`, { method: "DELETE" });
      await revalidateStore();
      
      const removeCategoryFromTree = (cats: Category[]): Category[] => {
        return cats.filter(c => c.id !== category.id).map(c => {
          if (c.subcategories) {
            return { ...c, subcategories: removeCategoryFromTree(c.subcategories) };
          }
          return c;
        });
      };
      
      setLocalCategories((prev) => removeCategoryFromTree(prev));
    } catch (error) {
      console.error("Kategori silinemedi:", error);
      alert("Silme işlemi sırasında hata oluştu.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">Kategoriler</h1>
          <p className="mt-1 text-sm text-ink-soft">Mağazada yayında olan kategoriler ve ürün sayıları.</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-ink-soft">
            {localCategories.length} ana kategori
          </p>
          <Button variant="solid" onClick={() => {
            alert("Yeni kategori ekleme özelliği backend entegrasyonu ile aktif edilecektir.");
          }}>
            Yeni Kategori
          </Button>
        </div>
      </div>

      <div className="overflow-hidden border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-cream/50">
                <th scope="col" className="whitespace-nowrap py-3.5 pl-6 pr-3 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Kategori</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Bağlantı</th>
                <th scope="col" className="whitespace-nowrap px-3 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-ink-soft">Ürün Sayısı</th>
                <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-6"><span className="sr-only">İşlemler</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {localCategories.map((category) => (
                <CategoryRow 
                  key={category.id} 
                  category={category} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Kategori Düzenle"
      >
        {editingCategory && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-ink">Kategori Adı</label>
              <input
                id="name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none"
              />
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingCategory(null)}>İptal</Button>
              <Button variant="solid" onClick={handleSave}>Kaydet</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
