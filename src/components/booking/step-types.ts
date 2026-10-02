import type { BookingDraft, FieldErrors } from "@/lib/booking/schema";

export interface StepProps {
  draft: BookingDraft;
  errors: FieldErrors;
  update: (patch: Partial<BookingDraft>) => void;
}
