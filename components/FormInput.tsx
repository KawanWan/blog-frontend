interface FormInputProps {
  label: string;
  type: string;
  placeholder?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({ label, type, placeholder, name, value, onChange }: FormInputProps) {
  return (
    <div className="mb-4 w-full">
      <label className="block text-sm mb-1">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-black"
      />
    </div>
  );
}
