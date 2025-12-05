/**
 * Comparison Row Component
 * Individual row in comparison table
 */

interface ComparisonRowProps {
  label: string;
  values: string[];
  highlight?: boolean;
}

export default function ComparisonRow({ label, values, highlight = false }: ComparisonRowProps) {
  return (
    <tr className={`border-b border-gray-100 ${highlight ? "bg-blue-50" : ""}`}>
      <td className={`py-3 px-4 font-medium text-sm ${highlight ? "text-blue-900" : "text-gray-900"}`}>
        {label}
      </td>
      {values.map((value, index) => (
        <td
          key={index}
          className={`py-3 px-4 text-center text-sm ${
            highlight ? "font-semibold text-blue-900" : "text-gray-700"
          }`}
        >
          {value}
        </td>
      ))}
    </tr>
  );
}

