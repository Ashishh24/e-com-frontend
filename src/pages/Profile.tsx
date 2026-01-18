import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@/utils/url";
import { updateUser } from "@/utils/userSlice";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import toast from "react-hot-toast";

/* ===================== TYPES ===================== */
interface Address {
  _id: string;
  name: string;
  phone: string;
  street: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

/* ===================== COMPONENT ===================== */
const Profile = () => {
  const user = useSelector((store: any) => store.user);
  const dispatch = useDispatch();

  const [addresses, setAddresses] = useState<Address[]>(user?.address || []);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ----- address fields (separate states = no cursor jump) ----- */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");

  useEffect(() => {
    setAddresses(user?.address || []);
  }, [user]);

  /* ===================== HELPERS ===================== */
  const resetForm = () => {
    setName("");
    setPhone("");
    setStreet("");
    setPincode("");
    setCity("");
    setState("");
    setCountry("India");
    setEditingId(null);
  };

  /* ===================== PINCODE ===================== */
  const handlePincodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    setPincode(value);

    if (value.length !== 6) {
      setCity("");
      setState("");
      return;
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/pincode/${value}`,
        { withCredentials: true }
      );

      if (res.data?.length > 0) {
        setCity(res.data[0].city);
        setState(res.data[0].state);
      }
    } catch {
      toast.error("Invalid pincode");
    }
  };

  /* ===================== SAVE ADDRESS ===================== */
  const handleSaveAddress = async () => {
    const payload = {
      name,
      phone,
      street,
      pincode,
      city,
      state,
      country,
    };

    try {
      let res;

      if (editingId) {
        res = await axios.patch(
          `${BASE_URL}/address/${editingId}`,
          payload,
          { withCredentials: true }
        );
      } else {
        res = await axios.post(
          `${BASE_URL}/address`,
          payload,
          { withCredentials: true }
        );
      }

      dispatch(updateUser({ address: res.data.addresses }));
      setAddresses(res.data.addresses);

      toast.success("Address saved successfully");

      resetForm();
      setShowAddressForm(false);
    } catch (err: any) {
      toast.error(`Failed to save address ${err.response?.data?.message}`);
      console.log(err);
    }
  };

  /* ===================== EDIT ===================== */
  const handleEdit = (addr: Address) => {
    setEditingId(addr._id);
    setName(addr.name);
    setPhone(addr.phone);
    setStreet(addr.street);
    setPincode(addr.pincode);
    setCity(addr.city);
    setState(addr.state);
    setCountry(addr.country);
    setShowAddressForm(true);
  };

  /* ===================== DELETE ===================== */
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/address/${id}`,
        { withCredentials: true }
      );

      dispatch(updateUser({ address: res.data.addresses }));
      setAddresses(res.data.addresses);

      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  /* ===================== JSX ===================== */
  return (
    <div className="min-h-screen bg-gradient-radial from-candle-cream via-candle-warm to-candle-deep">
      <Header />

      <div className="py-5 container mx-auto space-y-8">
        {/* BASIC DETAILS */}
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </CardContent>
        </Card>

        {/* ADD ADDRESS BUTTON */}
        <Button
          onClick={() => {
            resetForm();
            setShowAddressForm(true);
          }}
        >
          + Add Address
        </Button>

        {/* SAVED ADDRESSES */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Addresses</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {addresses.length === 0 && (
              <p className="text-muted-foreground">No saved addresses</p>
            )}

            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="border rounded p-4 flex justify-between"
              >
                <div>
                  <p className="font-medium">{addr.name}</p>
                  <p>{addr.street}</p>
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p>{addr.country}</p>
                  <p>{addr.phone}</p>
                </div>

                <div className="space-x-2">
                  <Button size="sm" onClick={() => handleEdit(addr)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(addr._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>

          
        </Card>

        
        {/* ADD / EDIT FORM */}
        {showAddressForm && (
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>
                {editingId ? "Edit Address" : "Add New Address"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Input placeholder="Address" value={street} onChange={(e) => setStreet(e.target.value)} />
                <Input placeholder="Pincode" value={pincode} onChange={handlePincodeChange} maxLength={6} />
                <Input placeholder="City" value={city} readOnly />
                <Input placeholder="State" value={state} readOnly />
                <Input placeholder="Country" value={country} readOnly />
              </div>

              <div className="mt-5 flex justify-end gap-4">
                <Button onClick={handleSaveAddress} className="max-w-25">
                  {editingId ? "Update Address" : "Save Address"}
                </Button>
                <Button 
                  onClick={() => {
                  resetForm();
                  setShowAddressForm(false);
                }} 
                  className="max-w-25 border"
                  variant="ghost">
                   Cancel
                </Button>
            </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
