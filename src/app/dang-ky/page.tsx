"use client";

import { useState } from "react";
import { RegistrationForm } from "./components/registration-form";
import { TicketDisplay } from "./components/ticket-display";

export default function EventRegistrationPage() {
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<{
    fullName: string;
    phone: string;
    organization: string;
    attendeeType: string;
  } | null>(null);

  const handleRegistrationSuccess = (
    data: {
      fullName: string;
      phone: string;
      organization: string;
      attendeeType: string;
    },
    ticket: string
  ) => {
    setRegistrationData(data);
    setTicketNumber(ticket);
  };

  const handleBackToForm = () => {
    setTicketNumber(null);
    setRegistrationData(null);
  };

  return (
    <main className="min-h-screen bg-background">
      {!ticketNumber ? (
        <RegistrationForm onSuccess={handleRegistrationSuccess} />
      ) : (
        <TicketDisplay
          ticketNumber={ticketNumber}
          registrationData={registrationData!}
          onBack={handleBackToForm}
        />
      )}
    </main>
  );
}
