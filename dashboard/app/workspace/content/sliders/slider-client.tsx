"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Drawer } from "@/components/ui/Drawer";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  Trash2,
  Edit,
  Plus,
  Clapperboard,
  Globe,
  Radio,
  AlertTriangle,
  ExternalLink,
  Users,
  User,
} from "lucide-react";
import {
  createSliderAction,
  updateSliderAction,
  deleteSliderAction,
} from "@/app/actions/inventory";
import type { SliderItem } from "@/lib/types";

export function SliderClient({
  initialSliders,
  totalRows,
  currentPage,
  pageSize,
  q,
  userPermissions = [],
}: {
  initialSliders: SliderItem[];
  totalRows: number;
  currentPage: number;
  pageSize: number;
  q: string;
  userPermissions?: string[];
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const canAdd =
    userPermissions.includes("*") ||
    userPermissions.includes("home.add_slider");
  const canChange =
    userPermissions.includes("*") ||
    userPermissions.includes("home.change_slider");
  const canDelete =
    userPermissions.includes("*") ||
    userPermissions.includes("home.delete_slider");

  // Drawers and dialogs
  const [activeSlider, setActiveSlider] = useState<SliderItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form State - Create
  const [createHeading, setCreateHeading] = useState("");
  const [createFile, setCreateFile] = useState<File | null>(null);

  // Form State - Edit
  const [editHeading, setEditHeading] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateParams(newParams: Record<string, string | number | undefined>) {
    const url = new URL(window.location.href);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === undefined || v === "") {
        url.searchParams.delete(k);
      } else {
        url.searchParams.set(k, String(v));
      }
    });
    if (!("page" in newParams)) {
      url.searchParams.delete("page");
    }
    router.push(url.pathname + url.search);
  }

  function handleOpenDetail(slider: SliderItem) {
    setActiveSlider(slider);
    setDetailOpen(true);
  }

  function handleOpenCreate() {
    setCreateHeading("");
    setCreateFile(null);
    setErrors({});
    setCreateOpen(true);
  }

  function handleOpenEdit(slider: SliderItem) {
    setActiveSlider(slider);
    setEditHeading(slider.heading);
    setEditFile(null);
    setErrors({});
    setEditOpen(true);
  }

  function handleOpenDelete(slider: SliderItem) {
    setActiveSlider(slider);
    setDeleteDialogOpen(true);
  }

  async function handleSaveCreate(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!createHeading.trim()) newErrors.heading = "Heading is required.";
    if (!createFile) newErrors.file = "Video or banner image file is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    const formData = new FormData();
    formData.append("heading", createHeading.trim());
    if (createFile) {
      formData.append("image", createFile);
    }

    const res = await createSliderAction(formData);
    setSubmitting(false);

    if (!res.ok) {
      showToast(res.error.message || "Failed to create slider banner.", "error");
    } else {
      showToast("Slider video banner created successfully.", "success");
      setCreateOpen(false);
      router.refresh();
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeSlider) return;

    if (!editHeading.trim()) {
      setErrors({ heading: "Heading is required." });
      return;
    }

    setSubmitting(true);
    setErrors({});

    const formData = new FormData();
    formData.append("heading", editHeading.trim());
    if (editFile) {
      formData.append("image", editFile);
    }

    const res = await updateSliderAction(activeSlider.id, formData);
    setSubmitting(false);

    if (!res.ok) {
      showToast(res.error.message || "Failed to update slider.", "error");
    } else {
      showToast(`Slider #${activeSlider.id} updated successfully.`, "success");
      setEditOpen(false);
      setActiveSlider(res.data);
      router.refresh();
    }
  }

  async function handleConfirmDelete() {
    if (!activeSlider) return;

    setSubmitting(true);
    const res = await deleteSliderAction(activeSlider.id);
    setSubmitting(false);

    if (!res.ok) {
      showToast(res.error.message || "Failed to delete slider item.", "error");
    } else {
      showToast(`Slider item '${activeSlider.heading}' deleted.`, "success");
      setDeleteDialogOpen(false);
      setDetailOpen(false);
      setActiveSlider(null);
      router.refresh();
    }
  }

  const columns: ColumnDef<SliderItem>[] = [
    {
      id: "id",
      header: "ID",
      sortable: true,
      accessor: (slider) => (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-xs)" }}>
          #{slider.id}
        </span>
      ),
    },
    {
      id: "heading",
      header: "Headline / Title",
      isIdentifying: true,
      sortable: true,
      accessor: (slider) => (
        <button
          type="button"
          onClick={() => handleOpenDetail(slider)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            fontWeight: 600,
            color: "var(--text)",
            cursor: "pointer",
            textAlign: "left",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          {slider.heading}
        </button>
      ),
    },
    {
      id: "status",
      header: "Public Selection",
      accessor: (slider) =>
        slider.is_public_active ? (
          <span
            className="badge"
            style={{
              background: "var(--success-bg, rgba(46, 125, 50, 0.15))",
              color: "var(--success, #2e7d32)",
              border: "1px solid var(--success-border, rgba(46, 125, 50, 0.3))",
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--font-size-xs)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600,
            }}
          >
            <Radio size={12} /> Active (Last Record)
          </span>
        ) : (
          <span className="muted" style={{ fontSize: "var(--font-size-xs)" }}>
            Archived
          </span>
        ),
    },
    {
      id: "image",
      header: "Media Asset",
      accessor: (slider) =>
        slider.image ? (
          <a
            href={slider.image}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--accent)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              textDecoration: "none",
            }}
          >
            View File <ExternalLink size={12} />
          </a>
        ) : (
          <span className="muted" style={{ fontSize: "var(--font-size-xs)" }}>
            No file
          </span>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (slider) => (
        <div style={{ display: "flex", gap: "var(--space-1)", justifyContent: "flex-end" }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpenDetail(slider)}
            aria-label={`View slider ${slider.heading}`}
          >
            Detail
          </Button>
          {canChange && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleOpenEdit(slider)}
              aria-label={`Edit slider ${slider.heading}`}
            >
              <Edit size={12} /> Edit
            </Button>
          )}
          {canDelete && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleOpenDelete(slider)}
              aria-label={`Delete slider ${slider.heading}`}
            >
              <Trash2 size={12} /> Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {/* Content Tabs Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "var(--space-2)",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Link
            href="/workspace/content/sliders"
            className="button button--primary"
            style={{
              fontSize: "var(--font-size-sm)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Clapperboard size={16} /> Slider Videos
          </Link>
          <Link
            href="/workspace/content/social-media"
            className="button button--ghost"
            style={{
              fontSize: "var(--font-size-sm)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Globe size={16} /> Social Links
          </Link>
          <Link
            href="/workspace/content/social-features"
            className="button button--ghost"
            style={{
              fontSize: "var(--font-size-sm)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Users size={16} /> Social Features
          </Link>
          <Link
            href="/workspace/content/sales-representatives"
            className="button button--ghost"
            style={{
              fontSize: "var(--font-size-sm)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <User size={16} /> Sales Reps
          </Link>
        </div>

        {canAdd && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}
          >
            <Plus size={16} /> New Slider Banner
          </Button>
        )}
      </div>

      {/* Info notice about selection rule */}
      <div
        style={{
          padding: "var(--space-3)",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          fontSize: "var(--font-size-xs)",
          color: "var(--text-muted)",
        }}
      >
        <strong>Public Selection Behavior:</strong> The public website homepage API (<code>GET /api/v1/home/slider/</code>) strictly selects the <strong>newest created record</strong> (<code>Slider.objects.last()</code>). Creating a new slider video automatically becomes the active live banner, while preserving older configurations for historical rollback.
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchValue={q}
        onSearchChange={(newQ) => updateParams({ q: newQ })}
        searchPlaceholder="Search slider headline..."
      />

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={initialSliders}
        identifyingColumnIndex={1}
        totalRows={totalRows}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => updateParams({ page })}
      />

      {/* Detail Slide-over Drawer */}
      <Drawer
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={activeSlider ? `Slider #${activeSlider.id}` : "Slider Details"}
      >
        {activeSlider && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "var(--space-3)",
                padding: "var(--space-3)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div>
                <span className="muted" style={{ fontSize: "var(--font-size-xs)" }}>
                  Heading
                </span>
                <p style={{ margin: "2px 0 0 0", fontWeight: 600, fontSize: "var(--font-size-md)" }}>
                  {activeSlider.heading}
                </p>
              </div>

              <div>
                <span className="muted" style={{ fontSize: "var(--font-size-xs)" }}>
                  Public Status
                </span>
                <p style={{ margin: "4px 0 0 0" }}>
                  {activeSlider.is_public_active ? (
                    <span
                      className="badge"
                      style={{
                        background: "var(--success-bg, rgba(46, 125, 50, 0.15))",
                        color: "var(--success, #2e7d32)",
                        border: "1px solid var(--success-border, rgba(46, 125, 50, 0.3))",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "var(--font-size-xs)",
                        fontWeight: 600,
                      }}
                    >
                      Active on Public Website
                    </span>
                  ) : (
                    <span className="muted" style={{ fontSize: "var(--font-size-xs)" }}>
                      Inactive (superseded by newer record)
                    </span>
                  )}
                </p>
              </div>

              <div>
                <span className="muted" style={{ fontSize: "var(--font-size-xs)" }}>
                  Media Asset
                </span>
                <div style={{ marginTop: "6px" }}>
                  {activeSlider.image ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      <a
                        href={activeSlider.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button--secondary button--sm"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", width: "fit-content" }}
                      >
                        Open Asset File <ExternalLink size={12} />
                      </a>
                    </div>
                  ) : (
                    <p className="muted" style={{ margin: 0, fontSize: "var(--font-size-xs)" }}>
                      No media uploaded
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
              {canChange && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setDetailOpen(false);
                    handleOpenEdit(activeSlider);
                  }}
                >
                  <Edit size={12} style={{ marginRight: "4px" }} /> Edit Slider
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setDetailOpen(false);
                    handleOpenDelete(activeSlider);
                  }}
                >
                  <Trash2 size={12} style={{ marginRight: "4px" }} /> Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Drawer */}
      <Drawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Slider Video Banner"
      >
        <form onSubmit={handleSaveCreate} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <FormField label="Headline Heading" required error={errors.heading}>
            <Input
              value={createHeading}
              onChange={(e) => setCreateHeading(e.target.value)}
              placeholder="e.g. Elevate Your Journey"
              required
              maxLength={100}
              disabled={submitting}
            />
          </FormField>

          <FormField label="Banner Video / Image File" required error={errors.file}>
            <input
              type="file"
              onChange={(e) => setCreateFile(e.target.files?.[0] || null)}
              accept="video/mp4,video/webm,image/jpeg,image/png,image/webp"
              required
              className="input"
              disabled={submitting}
            />
            <span className="muted" style={{ fontSize: "var(--font-size-xs)", marginTop: "4px", display: "block" }}>
              Supported: .mp4, .webm, .jpg, .png, .webp (max 10MB)
            </span>
          </FormField>

          <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end", marginTop: "var(--space-2)" }}>
            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Uploading..." : "Publish Banner"}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={activeSlider ? `Edit Slider #${activeSlider.id}` : "Edit Slider"}
      >
        {activeSlider && (
          <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <FormField label="Headline Heading" required error={errors.heading}>
              <Input
                value={editHeading}
                onChange={(e) => setEditHeading(e.target.value)}
                required
                maxLength={100}
                disabled={submitting}
              />
            </FormField>

            <FormField label="Replace Video / Image File (Optional)" error={errors.file}>
              <input
                type="file"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                accept="video/mp4,video/webm,image/jpeg,image/png,image/webp"
                className="input"
                disabled={submitting}
              />
              <span className="muted" style={{ fontSize: "var(--font-size-xs)", marginTop: "4px", display: "block" }}>
                Leave empty to retain existing uploaded file.
              </span>
            </FormField>

            <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end", marginTop: "var(--space-2)" }}>
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Confirm Slider Deletion"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
            <AlertTriangle size={20} style={{ color: "var(--danger)", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p style={{ margin: "0 0 var(--space-2) 0", fontWeight: 500 }}>
                Are you sure you want to delete this slider item?
              </p>
              <p className="muted" style={{ margin: 0, fontSize: "var(--font-size-sm)" }}>
                Heading: <strong>{activeSlider?.heading}</strong>
              </p>
              {activeSlider?.is_public_active && (
                <p style={{ margin: "var(--space-2) 0 0 0", color: "var(--danger)", fontSize: "var(--font-size-xs)", fontWeight: 500 }}>
                  ⚠️ This is currently the active public homepage banner! Deleting it will fall back to the preceding record, or empty if none exist.
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end", marginTop: "var(--space-2)" }}>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
