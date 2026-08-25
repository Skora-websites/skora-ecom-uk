"use client";

import { useState } from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addresses as seedAddresses, type Address } from "@/lib/account";

const addressSchema = z.object({
  label: z.string().min(1, "Choose a label"),
  name: z.string().min(1, "Full name is required"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().min(1, "Town or city is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const LABEL_OPTIONS = ["Home", "Work", "Studio", "Other"];

const EMPTY_FORM: AddressFormValues = {
  label: "",
  name: "Emma Hartley",
  line1: "",
  line2: "",
  postcode: "",
  country: "United Kingdom",
  isDefault: false,
};

interface AddressFormProps {
  isEditing: boolean;
  initialValues: AddressFormValues;
  onSubmit: (values: AddressFormValues) => void;
  onCancel: () => void;
}

function AddressForm({ isEditing, initialValues, onSubmit, onCancel }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValues,
  });

  const label = watch("label");
  const isDefault = watch("isDefault");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-3xl border-2 border-dashed border-primary/30 bg-card p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
        <div className="flex flex-col gap-2 sm:w-48">
          <Label htmlFor="address-label">Label</Label>
          <Select value={label} onValueChange={(value) => setValue("label", value)}>
            <SelectTrigger id="address-label" className="h-11 rounded-full">
              <SelectValue placeholder="Choose a label" />
            </SelectTrigger>
            <SelectContent>
              {LABEL_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.label && (
            <p className="text-xs text-destructive">{errors.label.message}</p>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="address-name">Full name</Label>
          <Input
            id="address-name"
            className="h-11 rounded-full"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address-line1">Address line 1</Label>
        <Input
          id="address-line1"
          className="h-11 rounded-full"
          placeholder="Street and number"
          {...register("line1")}
        />
        {errors.line1 && (
          <p className="text-xs text-destructive">{errors.line1.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="address-line2">Town / city</Label>
          <Input id="address-line2" className="h-11 rounded-full" {...register("line2")} />
          {errors.line2 && (
            <p className="text-xs text-destructive">{errors.line2.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:w-48">
          <Label htmlFor="address-postcode">Postcode</Label>
          <Input
            id="address-postcode"
            className="h-11 rounded-full"
            {...register("postcode")}
          />
          {errors.postcode && (
            <p className="text-xs text-destructive">{errors.postcode.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:w-72">
        <Label htmlFor="address-country">Country</Label>
        <Input id="address-country" className="h-11 rounded-full" {...register("country")} />
        {errors.country && (
          <p className="text-xs text-destructive">{errors.country.message}</p>
        )}
      </div>

      <label className="flex w-fit items-center gap-2.5 text-sm font-medium">
        <Checkbox
          checked={isDefault}
          onCheckedChange={(checked) => setValue("isDefault", checked === true)}
        />
        Make this my default delivery address
      </label>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">{isEditing ? "Save changes" : "Add address"}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(seedAddresses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const editingAddress = editingId
    ? addresses.find((a) => a.id === editingId)
    : undefined;

  const formValues: AddressFormValues = editingAddress
    ? {
        label: editingAddress.label,
        name: editingAddress.name,
        line1: editingAddress.line1,
        line2: editingAddress.line2,
        postcode: editingAddress.postcode,
        country: editingAddress.country,
        isDefault: editingAddress.isDefault,
      }
    : EMPTY_FORM;

  const startAdd = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (address: Address) => {
    setEditingId(address.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (values: AddressFormValues) => {
    setAddresses((prev) => {
      const makeDefault = values.isDefault || (!editingId && prev.length === 0);
      const cleared = prev.map((a) =>
        makeDefault && a.id !== editingId ? { ...a, isDefault: false } : a
      );
      if (editingId) {
        return cleared.map((a) =>
          a.id === editingId ? { ...a, ...values, isDefault: makeDefault } : a
        );
      }
      return [...cleared, { id: `addr-${Date.now()}`, ...values, isDefault: makeDefault }];
    });
    toast.success(editingId ? "Address updated" : "Address added");
    cancelForm();
  };

  const handleDelete = (address: Address) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== address.id);
      if (!next.some((a) => a.isDefault) && next.length > 0) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
    toast.success("Address removed");
  };

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success("Default address updated");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Address book</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the addresses we deliver to.
          </p>
        </div>
        {!showForm && (
          <Button onClick={startAdd}>
            <Plus className="size-4" /> Add address
          </Button>
        )}
      </div>

      {showForm && (
        <AddressForm
          key={editingId ?? "new"}
          isEditing={Boolean(editingId)}
          initialValues={formValues}
          onSubmit={handleSubmit}
          onCancel={cancelForm}
        />
      )}

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border bg-card p-10 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <MapPin className="size-7" />
          </span>
          <p className="font-medium">No addresses yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Add a delivery address to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex flex-col gap-3 rounded-3xl border bg-card p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{address.label}</p>
                {address.isDefault ? (
                  <Badge variant="secondary" className="rounded-full">
                    Default
                  </Badge>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDefault(address.id)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Set default
                  </button>
                )}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {address.name}
                <br />
                {address.line1}
                <br />
                {address.line2}
                <br />
                {address.postcode}
                <br />
                {address.country}
              </p>
              <div className="mt-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(address)}
                >
                  <Pencil className="size-3.5" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove this address?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {address.label} — {address.line1} will be removed from
                        your address book.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(address)}>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
