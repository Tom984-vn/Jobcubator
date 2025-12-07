import { useLocation } from "react-router-dom";

export default function ProfilePage() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div>
      <h1>Chat Page</h1>
      {message && <p>You sent: {message}</p>}
    </div>
  );
}
