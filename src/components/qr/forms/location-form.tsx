import { useCallback, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationFormData {
  type: 'location';
  latitude: number;
  longitude: number;
  name: string;
}

function LocationForm({ 
  initialData, 
  onChange 
}: {
  initialData?: LocationFormData;
  onChange: (data: LocationFormData) => void;
}) {
  const [data, setData] = useState<LocationFormData>({
    type: 'location',
    latitude: initialData?.latitude ?? 0,
    longitude: initialData?.longitude ?? 0,
    name: initialData?.name ?? '',
  });

  const handleChange = useCallback((
    updates: Partial<LocationFormData>
  ) => {
    const newData = { ...data, ...updates };
    setData(newData);
    onChange(newData);
  }, [data, onChange]);

  const handleNumberInput = useCallback((
    field: 'latitude' | 'longitude',
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      handleChange({ [field]: numValue });
    }
  }, [handleChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumberInput('latitude', e.target.value)}
            type="number"
            step="0.000001"
            value={data.latitude}
            min="-90"
            max="90"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNumberInput('longitude', e.target.value)}
            type="number"
            step="0.000001"
            value={data.longitude}
            min="-180"
            max="180"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Location Name (Optional)</Label>
        <Input
          id="name"
          placeholder="e.g., My Office"
          value={data.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({ name: e.target.value })}
          maxLength={100}
        />
      </div>

      {/* You could add a map component here for visual selection */}
      <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
        Map selection coming soon...
      </div>
    </div>
    );
  }
