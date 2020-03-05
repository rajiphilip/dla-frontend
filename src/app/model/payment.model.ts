export interface Payment {
    user_id: string;
    session_id: string;
    course_id: string;
    type: string;
    amount: number;
    description: string;
    paid_by: string;
    hash?: string;
    payment_date?: string;
    reference_number?: string;
    has_prerequisite?: number;
}
