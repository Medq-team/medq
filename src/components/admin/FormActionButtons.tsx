
import { Button } from '@/components/ui/button';

interface FormActionButtonsProps {
  isLoading: boolean;
  onCancel: () => void;
  isEdit: boolean;
}

export function FormActionButtons({ isLoading, onCancel, isEdit }: FormActionButtonsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : (isEdit ? "Update Question" : "Create Question")}
      </Button>
    </div>
  );
}
