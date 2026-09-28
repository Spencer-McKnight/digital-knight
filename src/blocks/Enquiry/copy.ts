export type EnquiryCopy = {
  name: string;
  email: string;
  message: string;
  honeypot: string;
  submit: string;
  submitting: string;
  errors: { details: string; server: string; retry: string };
  success: {
    title: string;
    body: string;
    offer: string;
    book: string;
    loading: string;
    back: string;
    bookingAs: string;
    calendarError: string;
  };
};
