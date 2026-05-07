import GuestRegistrationView from "./shared/GuestRegistrationView";

export default function GuestRegistrationPage() {
  return (
    <div className="frontdesk-registration">
      <GuestRegistrationView title="Front Desk Guest Registration" source="server_registration" />
    </div>
  );
}
