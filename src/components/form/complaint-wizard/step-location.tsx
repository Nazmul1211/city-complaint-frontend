"use client";

import { Compass, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetWards } from "@/hooks";
import type { Ward } from "@/types";

const FALLBACK_WARDS: Ward[] = [
  {
    id: "ward-01",
    wardNumber: "01",
    name: "Ward 01 - Uttara Sector 1 to 9",
    city: "Dhaka",
    isActive: true,
  },
  {
    id: "ward-08",
    wardNumber: "08",
    name: "Ward 08 - Gulshan & Baridhara",
    city: "Dhaka",
    isActive: true,
  },
  {
    id: "ward-12",
    wardNumber: "12",
    name: "Ward 12 - Mirpur 1, 2 & 10",
    city: "Dhaka",
    isActive: true,
  },
  {
    id: "ward-15",
    wardNumber: "15",
    name: "Ward 15 - Dhanmondi & Kalabagan",
    city: "Dhaka",
    isActive: true,
  },
  {
    id: "ward-19",
    wardNumber: "19",
    name: "Ward 19 - Banani & Mohakhali",
    city: "Dhaka",
    isActive: true,
  },
  {
    id: "ward-24",
    wardNumber: "24",
    name: "Ward 24 - Tejgaon Industrial Area",
    city: "Dhaka",
    isActive: true,
  },
  {
    id: "ward-32",
    wardNumber: "32",
    name: "Ward 32 - Old Dhaka (Lalbagh)",
    city: "Dhaka",
    isActive: true,
  },
  {
    id: "ward-40",
    wardNumber: "40",
    name: "Ward 40 - Badda & Rampura",
    city: "Dhaka",
    isActive: true,
  },
];

interface StepLocationProps {
  wardId: string;
  addressLine: string;
  landmark: string;
  latitude?: number;
  longitude?: number;
  onChange: (fields: {
    wardId?: string;
    addressLine?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
}

export function StepLocation({
  wardId,
  addressLine,
  landmark,
  latitude,
  longitude,
  onChange,
}: StepLocationProps) {
  const [isLocating, setIsLocating] = useState(false);
  const { data } = useGetWards();

  const wards = useMemo(() => {
    if (data?.data && data.data.length > 0) {
      return data.data;
    }
    return FALLBACK_WARDS;
  }, [data]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.add({
        title: "Geolocation Unsupported",
        description: "Your browser does not support GPS geolocation.",
        type: "error",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        onChange({ latitude: lat, longitude: lng });
        toast.add({
          title: "Location Detected",
          description: `GPS coordinates captured: ${lat}, ${lng}`,
          type: "success",
        });
      },
      (err) => {
        setIsLocating(false);
        toast.add({
          title: "Location Error",
          description:
            err.message || "Failed to retrieve your GPS coordinates.",
          type: "error",
        });
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Step 2: Incident Location & Ward
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Pinpoint where the problem is located so the responsible zonal field
          crew can be dispatched directly to the site.
        </p>
      </div>

      <div className="space-y-4">
        {/* Ward Selection */}
        <div className="space-y-1.5">
          <label
            htmlFor="ward-select"
            className="text-xs font-medium text-foreground"
          >
            Municipal Ward <span className="text-destructive">*</span>
          </label>
          <select
            id="ward-select"
            value={wardId}
            onChange={(e) => onChange({ wardId: e.target.value })}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
          >
            <option value="">-- Select Municipal Ward --</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.city})
              </option>
            ))}
          </select>
        </div>

        {/* Address Line */}
        <div className="space-y-1.5">
          <label
            htmlFor="address-line"
            className="text-xs font-medium text-foreground"
          >
            Street Address / Exact Location{" "}
            <span className="text-destructive">*</span>
          </label>
          <input
            id="address-line"
            type="text"
            required
            value={addressLine}
            onChange={(e) => onChange({ addressLine: e.target.value })}
            placeholder="e.g. Road 11, Block D, House 42 or Intersection of Mirpur-10"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Landmark */}
        <div className="space-y-1.5">
          <label
            htmlFor="landmark-input"
            className="text-xs font-medium text-foreground"
          >
            Prominent Landmark (Optional)
          </label>
          <input
            id="landmark-input"
            type="text"
            value={landmark}
            onChange={(e) => onChange({ landmark: e.target.value })}
            placeholder="e.g. Opposite City Hospital or adjacent to Metro Rail Pillar #24"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* GPS Coordinates Section */}
        <div className="rounded-md border bg-muted/30 p-4 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-medium text-foreground">
                GPS Geo-Coordinates (Optional)
              </span>
              <p className="text-[11px] text-muted-foreground">
                Helps technicians navigate with precision maps during dispatch.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="gap-1.5 shrink-0"
            >
              {isLocating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Compass className="size-3.5 text-primary" />
              )}
              {isLocating ? "Acquiring GPS..." : "Detect Current Location"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label
                htmlFor="lat-input"
                className="text-[11px] text-muted-foreground"
              >
                Latitude
              </label>
              <input
                id="lat-input"
                type="number"
                step="any"
                value={latitude ?? ""}
                onChange={(e) =>
                  onChange({
                    latitude: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="23.810331"
                className="mt-1 h-8 w-full rounded border border-input bg-background px-2.5 text-xs text-foreground outline-none focus:border-ring"
              />
            </div>
            <div>
              <label
                htmlFor="lng-input"
                className="text-[11px] text-muted-foreground"
              >
                Longitude
              </label>
              <input
                id="lng-input"
                type="number"
                step="any"
                value={longitude ?? ""}
                onChange={(e) =>
                  onChange({
                    longitude: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="90.412521"
                className="mt-1 h-8 w-full rounded border border-input bg-background px-2.5 text-xs text-foreground outline-none focus:border-ring"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
