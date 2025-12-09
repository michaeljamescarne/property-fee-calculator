/**
 * Comparison Row Component
 * Individual row in comparison table
 */

interface ComparisonRowProps {
  label: string;
  values: string[];
  highlight?: boolean;
  valueStyles?: Array<{ textColor?: string; bgColor?: string; fontWeight?: string }>;
}

export default function ComparisonRow({ label, values, highlight = false, valueStyles }: ComparisonRowProps) {
  // Check if we're using green styling (for Total Investment Cost or best value highlighting)
  const hasGreenStyling = valueStyles && valueStyles.some((style) => style?.bgColor?.includes("green"));
  const rowBgColor = highlight ? "bg-blue-50" : "";
  const labelColor = highlight ? "text-blue-900" : "text-gray-900";

  return (
    <tr className={`border-b border-gray-100 ${rowBgColor}`}>
      <td className={`py-3 px-4 font-medium text-sm w-[200px] ${labelColor}`}>
        {label}
      </td>
      {values.map((value, index) => {
        const style = valueStyles?.[index];
        const textColor = style?.textColor || (highlight ? "text-blue-900" : "text-gray-700");
        const bgColor = style?.bgColor || "";
        const fontWeight = style?.fontWeight || (highlight ? "font-semibold" : "");

        return (
          <td
            key={index}
            className={`py-3 px-4 text-center text-sm w-[200px] ${textColor} ${bgColor} ${fontWeight}`}
          >
            {value}
          </td>
        );
      })}
    </tr>
  );
}



