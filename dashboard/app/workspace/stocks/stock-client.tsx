"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Drawer } from "@/components/ui/Drawer";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Upload } from "@/components/ui/Upload";
import { useToast } from "@/components/ui/Toast";
import { Plus, Trash2, Edit } from "lucide-react";
import {
  createStockAction,
  updateStockAction,
  deleteStockAction,
} from "@/app/actions/inventory";
import type { StockItem } from "@/lib/types";

export function StockListClient({
  initialStocks,
  totalRows,
  currentPage,
  pageSize,
  q,
  status,
}: {
  initialStocks: StockItem[];
  totalRows: number;
  currentPage: number;
  pageSize: number;
  q: string;
  status: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

  const [editItem, setEditItem] = useState<StockItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStock, setDeletingStock] = useState<StockItem | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const handleSearch = (newQ: string) => {
    const params = new URLSearchParams(window.location.search);
    if (newQ) params.set("q", newQ);
    else params.delete("q");
    params.set("page", "1");
    router.push(`/workspace/stocks?${params.toString()}`);
  };

  const handleFilterChange = (key: string, val: string) => {
    const params = new URLSearchParams(window.location.search);
    if (val) params.set(key, val);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/workspace/stocks?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    router.push(`/workspace/stocks?${params.toString()}`);
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateSubmitting(true);
    setCreateErrors({});

    const formData = new FormData(e.currentTarget);
    const res = await createStockAction(formData);
    setCreateSubmitting(false);

    if (res.ok) {
      showToast("Stock record created successfully.", "success");
      setCreateOpen(false);
      router.refresh();
    } else {
      if (res.error.fieldErrors) {
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.error.fieldErrors)) {
          flat[k] = Array.isArray(v) ? (v[0] ?? "") : String(v);
        }
        setCreateErrors(flat);
      }
      showToast(res.error.message || "Failed to create stock item.", "error");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    setEditSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const res = await updateStockAction(editItem.id, formData);
    setEditSubmitting(false);

    if (res.ok) {
      showToast("Stock record updated successfully.", "success");
      setEditOpen(false);
      setEditItem(null);
      router.refresh();
    } else {
      showToast(res.error.message || "Failed to update stock item.", "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingStock) return;
    setDeleteSubmitting(true);
    const res = await deleteStockAction(deletingStock.id);
    setDeleteSubmitting(false);

    if (res.ok) {
      showToast("Stock record deleted successfully.", "success");
      setDeleteDialogOpen(false);
      setDeletingStock(null);
      router.refresh();
    } else {
      showToast(res.error.message || "Failed to delete stock item.", "error");
    }
  };

  const columns: ColumnDef<StockItem>[] = [
    {
      id: "preview",
      header: "Media",
      accessor: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          {row.image && (
            <img
              src={row.image}
              alt={row.title || "Stock banner"}
              style={{ width: "48px", height: "32px", objectFit: "cover", borderRadius: "2px" }}
            />
          )}
          <span style={{ fontWeight: 600 }}>{row.title || `Stock #${row.id}`}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: (row) => (
        <Badge tone={row.status === "PUBLISHED" ? "success" : row.status === "ARCHIVED" ? "error" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: "created_at",
      header: "Created At",
      accessor: (row) => (
        <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (row) => (
        <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setEditItem(row);
              setEditOpen(true);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <Edit size={12} /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setDeletingStock(row);
              setDeleteDialogOpen(true);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <Trash2 size={12} /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <FilterBar
        searchValue={q}
        onSearchChange={handleSearch}
        searchPlaceholder="Search stock items by title..."
        filters={[
          {
            key: "status",
            label: "Status",
            value: status,
            options: [
              { label: "Published", value: "PUBLISHED" },
              { label: "Unpublished", value: "UNPUBLISHED" },
              { label: "Archived", value: "ARCHIVED" },
              { label: "Unlisted", value: "UNLISTED" },
            ],
          },
        ]}
        onFilterChange={handleFilterChange}
        actions={
          <Button variant="primary" onClick={() => setCreateOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Plus size={14} /> New Stock Item
          </Button>
        }
      />

      <DataTable
        data={initialStocks}
        columns={columns}
        identifyingColumnIndex={0}
        totalRows={totalRows}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      {/* Create Stock Drawer */}
      <Drawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add Stock Banner"
        position="right"
        size="sm"
      >
        <form onSubmit={handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <FormField label="Title" error={createErrors.title}>
            <Input name="title" placeholder="e.g. Fresh Shipment from Japan" />
          </FormField>

          <FormField label="Stock Image" required error={createErrors.image} description="Banner image (jpg, jpeg, png, webp)">
            <Upload name="image" accept="image/*" required />
          </FormField>

          <FormField label="Status" error={createErrors.status}>
            <Select
              name="status"
              options={[
                { label: "Published", value: "PUBLISHED" },
                { label: "Unpublished", value: "UNPUBLISHED" },
                { label: "Archived", value: "ARCHIVED" },
                { label: "Unlisted", value: "UNLISTED" },
              ]}
              defaultValue="PUBLISHED"
            />
          </FormField>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={createSubmitting}>
              {createSubmitting ? "Creating..." : "Save Stock"}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Stock Drawer */}
      <Drawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Stock Banner"
        position="right"
        size="sm"
      >
        {editItem && (
          <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <FormField label="Title">
              <Input name="title" defaultValue={editItem.title || ""} />
            </FormField>

            <FormField label="Stock Image" description="Leave blank to keep existing image">
              {editItem.image && (
                <div style={{ marginBottom: "var(--space-2)" }}>
                  <img src={editItem.image} alt={editItem.title || ""} style={{ maxHeight: "80px", objectFit: "cover" }} />
                </div>
              )}
              <Upload name="image" accept="image/*" />
            </FormField>

            <FormField label="Status">
              <Select
                name="status"
                options={[
                  { label: "Published", value: "PUBLISHED" },
                  { label: "Unpublished", value: "UNPUBLISHED" },
                  { label: "Archived", value: "ARCHIVED" },
                  { label: "Unlisted", value: "UNLISTED" },
                ]}
                defaultValue={editItem.status}
              />
            </FormField>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
              <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={editSubmitting}>
                {editSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Stock Banner"
        description="Permanently delete this showroom stock media item."
      >
        <p>Are you sure you want to delete <strong>{deletingStock?.title || `Stock #${deletingStock?.id}`}</strong>?</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
          <Button variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteSubmitting}>
            {deleteSubmitting ? "Deleting..." : "Delete Stock"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
