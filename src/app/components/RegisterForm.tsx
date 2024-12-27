import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistrationForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (storedEmail) {
      setEmail(storedEmail);
      localStorage.removeItem("email");
    }

    if (storedPassword) {
      setPassword(storedPassword);
      localStorage.removeItem("password");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        address,
        city,
      }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        className="input"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        className="input"
      />
      <input
        type="email"
        placeholder="Email"
        value={email as string}
        readOnly
        className="input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password as string}
        readOnly
        className="input"
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="input"
      />
      <button type="submit" className="btn">
        Register
      </button>
    </form>
  );
}
