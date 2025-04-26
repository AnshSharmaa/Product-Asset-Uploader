'use client';


interface FormData {
  title: string;
  category: string;
  tags: string;
}

interface ProductFormProps {
  formData: FormData;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const categories = ['T-shirt', 'Dress', 'Hoodie', 'Jeans', 'Shoes', 'Accessory'];

export default function ProductForm({
  formData,
  onFormChange,
  onTagsChange,
}: ProductFormProps) {
  return (
    <>
      <div>
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-foreground"
        >
          Product Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={onFormChange}
          required
          className="bg-card border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors duration-200 ease-in-out"
          placeholder="e.g., Cool Graphic Tee"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block mb-2 text-sm font-medium text-foreground"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={onFormChange}
          required
          className="bg-card border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors duration-200 ease-in-out appearance-none pr-8 bg-no-repeat bg-right"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}

        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block mb-2 text-sm font-medium text-foreground"
        >
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={onTagsChange}
          className="bg-card border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors duration-200 ease-in-out"
          placeholder="e.g., summer, casual, cotton (comma-separated)"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Separate tags with commas.
        </p>
      </div>
    </>
  );
}
