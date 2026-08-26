"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Edit2, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import type { AdminCategory } from "../urunler/page";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { apiMutate, ApiError } from "@/lib/api";
import { revalidateStore } from "../actions";
import { iconButtonDanger, iconButtonNeutral } from "@/lib/adminIconButton";
import { toast } from "@/lib/toast";

type CategoryNode = AdminCategory & { subcategories: CategoryNode[] };

function buildTree(flat: AdminCategory[]): CategoryNode[] {
  const nodes = new Map<number, CategoryNode>(flat.map((c) => [c.id, { ...c, subcategories: [] }]));
  const roots: CategoryNode[] = [];

  for (const node of nodes.values()) {
    if (node.parent_id !== null && nodes.has(node.parent_id)) {
      nodes.get(node.parent_id)!.subcategories.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function CategoryRow({
  category,
  level = 0,
  onEdit,
  onDelete,
}: {
  category: CategoryNode;
  level?: number;
  onEdit: (c: CategoryNode) => void;
  onDelete: (c: CategoryNode) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.subcategories.length > 0;

  return (
    <>
      <tr className="transition-colors duration-200 hover:bg-cream/30">
        <td className="py-4 pl-6 pr-3">
          <div className="flex items-center gap-3" style={{ paddingLeft: `${level * 2}rem` }}>
            <div className="w-5 flex-shrink-0">
              {hasChildren ? (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-cream text-ink-soft hover:bg-sand hover:text-ink transition-colors"
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <div className="w-5" />
              )}
            </div>

            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden border border-border bg-cream">
              {category.image && <Image src={category.image} alt="" fill sizes="40px" className="object-cover" />}
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-ink">{category.name}</div>
              <div className="text-xs text-ink-soft">{category.slug}</div>
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-center text-sm text-ink-soft">{category.href}</td>
        <td className="whitespace-nowrap px-3 py-4 text-center text-sm font-medium text-ink">{category.itemCount}</td>
        <td className="whitespace-nowrap px-3 py-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Link href={category.href} className={iconButtonNeutral} title="Mağazada aç">
              <ArrowUpRight size={16} />
            </Link>
            <button onClick={() => onEdit(category)} className={iconButtonNeutral} title="Düzenle">
              <Edit2 size={16} />
            </button>
            <button onClick={() => onDelete(category)} className={iconButtonDanger} title="Sil">
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {isExpanded &&
        hasChildren &&
        category.subcategories.map((sub) => (
          <CategoryRow key={sub.id} category={sub} level={level + 1} onEdit={onEdit} onDelete={onDelete} />
        ))}
    </>
  );
}

function CategoryCardRow({
  category,
  level = 0,
  onEdit,
  onDelete,
}: {
  category: CategoryNode;
  level?: number;
  onEdit: (c: CategoryNode) => void;
  onDelete: (c: CategoryNode) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.subcategories.length > 0;

  return (
    <div style={{ paddingLeft: `${level * 1}rem` }}>
      <div className="flex items-center gap-3 p-4">
        <div className="w-5 flex-shrink-0">
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-cream text-ink-soft transition-colors hover:bg-sand hover:text-ink"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div className="w-5" />
          )}
        </div>

        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden border border-border bg-cream">
          {category.image && <Image src={category.image} alt="" fill sizes="40px" className="object-cover" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-ink">{category.name}</div>
          <div className="text-xs text-ink-soft">
            {category.slug} · {category.itemCount} ürün
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link href={category.href} className={iconButtonNeutral} title="Mağazada aç">
            <ArrowUpRight size={16} />
          </Link>
          <button onClick={() => onEdit(category)} className={iconButtonNeutral} title="Düzenle">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(category)} className={iconButtonDanger} title="Sil">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="divide-y divide-border border-t border-border">
          {category.subcategories.map((sub) => (
            <CategoryCardRow key={sub.id} category={sub} level={level + 1} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoriesTable({ categories }: { categories: AdminCategory[] }) {
  const [localCategories, setLocalCategories] = useState<AdminCategory[]>(categories);
  const [editingCategory, setEditingCategory] = useState<CategoryNode | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [nameInput, setNameInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const tree = useMemo(() => buildTree(localCategories), [localCategories]);
  const rootCount = useMemo(() => localCategories.filter((c) => c.parent_id === null).length, [localCategories]);

  const handleEdit = (category: CategoryNode) => {
    setEditingCategory(category);
    setNameInput(category.name);
    setImageFile(null);
    setImagePreview(category.image || null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!editingCategory) return;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", nameInput);
      if (imageFile) formData.append("image", imageFile);

      const updated = await apiMutate<AdminCategory>(`/admin/categories/${editingCategory.id}`, {
        method: "POST",
        body: formData,
      });

      await revalidateStore();

      setLocalCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, name: updated.name, image: updated.image } : c)),
      );
      setEditingCategory(null);
      toast.success("Kategori güncellendi", { description: `"${nameInput}" kaydedildi.` });
    } catch (error) {
      console.error("Kategori güncellenemedi:", error);
      toast.error("Kategori güncellenemedi", {
        description: error instanceof ApiError ? error.message : "Lütfen tekrar deneyin.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: CategoryNode) => {
    if (!window.confirm(`"${category.name}" kategorisini ve alt kategorilerini kalıcı olarak silmek istediğinize emin misiniz?`))
      return;

    try {
      await apiMutate(`/admin/categories/${category.id}`, { method: "DELETE" });
      await revalidateStore();

      const idsToRemove = new Set<number>([category.id, ...category.subcategories.map((s) => s.id)]);
      setLocalCategories((prev) => prev.filter((c) => !idsToRemove.has(c.id)));
      toast.success("Kategori silindi", { description: `"${category.name}" kaldırıldı.` });
    } catch (error) {
      console.error("Kategori silinemedi:", error);
      toast.error("Silme işlemi başarısız oldu", {
        description: error instanceof ApiError ? error.message : "Lütfen tekrar deneyin.",
      });
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
          <p className="text-xs text-ink-soft">{rootCount} ana kategori</p>
          <Button
            variant="solid"
            onClick={() => {
              toast.info("Yakında", { description: "Yeni kategori ekleme özelliği backend entegrasyonu ile aktif edilecektir." });
            }}
          >
            Yeni Kategori
          </Button>
        </div>
      </div>

      <div className="overflow-hidden border border-border bg-surface shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full table-fixed divide-y divide-border">
            <thead>
              <tr className="bg-cream/50">
                <th scope="col" className="w-[46%] py-3.5 px-3 text-left text-xs font-medium uppercase tracking-wider text-ink-soft">Kategori</th>
                <th scope="col" className="w-[24%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Bağlantı</th>
                <th scope="col" className="w-[18%] px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-ink-soft">Ürün Sayısı</th>
                <th scope="col" className="w-[12%] py-3.5 px-3 text-center"><span className="sr-only">İşlemler</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {tree.map((category) => (
                <CategoryRow key={category.id} category={category} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border md:hidden">
          {tree.map((category) => (
            <CategoryCardRow key={category.id} category={category} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      <Modal isOpen={!!editingCategory} onClose={() => setEditingCategory(null)} title="Kategori Düzenle">
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink">Kategori Görseli</label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-border">
                    <Image src={imagePreview} alt="Önizleme" fill className="object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-ink-soft file:mr-4 file:rounded file:border-0 file:bg-olive file:px-4 file:py-2 file:text-sm file:font-medium file:text-surface hover:file:bg-olive/90"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditingCategory(null)}>İptal</Button>
              <Button variant="solid" onClick={handleSave} loading={saving}>Kaydet</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
