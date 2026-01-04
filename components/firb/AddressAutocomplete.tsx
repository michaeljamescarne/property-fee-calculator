/**
 * Address Autocomplete Component
 * Google Places Autocomplete for Australian addresses
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { AustralianState } from "@/lib/firb/constants";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onStateChange?: (state: AustralianState) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onStateChange,
  placeholder = "Start typing an address...",
  disabled = false,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // If no API key, just use regular input
    if (!apiKey) {
      // Note: Setting error state in effect is acceptable here as it's a one-time initialization check

      setTimeout(
        () => setError("Google Maps API key not configured. Using regular text input."),
        0
      );
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      initializeAutocomplete();
      return;
    }

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=Function.prototype`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
      initializeAutocomplete();
    };

    script.onerror = () => {
      console.error("Error loading Google Maps");
      setError("Failed to load address autocomplete. Using regular text input.");
    };

    document.head.appendChild(script);

    function initializeAutocomplete() {
      if (inputRef.current && !autocompleteRef.current && window.google) {
        // Initialize autocomplete with Australian address restrictions
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "au" }, // Restrict to Australia
          fields: ["formatted_address", "address_components", "geometry"],
        });

        // Listen for place selection
        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();

          if (place && place.formatted_address) {
            onChange(place.formatted_address);

            // Extract state from address components
            if (place.address_components && onStateChange) {
              const stateComponent = place.address_components.find((component) =>
                component.types.includes("administrative_area_level_1")
              );

              if (stateComponent) {
                // Map state names to abbreviations
                const stateMap: Record<string, string> = {
                  "New South Wales": "NSW",
                  Victoria: "VIC",
                  Queensland: "QLD",
                  "South Australia": "SA",
                  "Western Australia": "WA",
                  Tasmania: "TAS",
                  "Australian Capital Territory": "ACT",
                  "Northern Territory": "NT",
                  NSW: "NSW",
                  VIC: "VIC",
                  QLD: "QLD",
                  SA: "SA",
                  WA: "WA",
                  TAS: "TAS",
                  ACT: "ACT",
                  NT: "NT",
                };

                const stateName = stateComponent.long_name || stateComponent.short_name;
                const stateAbbr = stateMap[stateName];

                if (stateAbbr) {
                  onStateChange(stateAbbr as AustralianState);
                }
              }
            }
          }
        });
      }
    }

    // Cleanup
    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange, onStateChange]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      {error && !isLoaded && <p className="text-xs text-muted-foreground mt-1">{error}</p>}
    </div>
  );
}
