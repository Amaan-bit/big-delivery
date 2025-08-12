'use client';

import { useState, useEffect } from 'react';
import { PencilLine } from 'lucide-react';
import { fetchAddresses } from '@/app/lib/api';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { BASE_URL } from '@/app/lib/config';

interface ApiAddress {
  id: number;
  user_id: number;
  label: string;
  name: string;
  street: string;
  landmark: string | null;
  area: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
  latitude: string | null;
  longitude: string | null;
  is_default: number;
  created_at: string;
  updated_at: string;
}

// Local Address interface with id
interface Address {
  id: number;
  name: string;
  street: string;
  area: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
  address: string;
  checked: boolean;
}

interface StateOption {
  code: string;
  name: string;
}

export default function AddressTab() {
  const dummyStates: StateOption[] = [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'MA', name: 'Massachusetts' }, // Added since your data has MA
  ];

  const [states] = useState<StateOption[]>(dummyStates);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [user, setUser] = useState({
    id: 100123,
    name: 'John Doe',
    email: 'john@example.com',
    addresses: [] as Address[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load addresses on mount
  useEffect(() => {
    async function loadAddresses() {
      setLoading(true);
      setError(null);
      try {
        const addressesFromApi = await fetchAddresses();

        // Map API response to your Address type and format address string
        const addresses: Address[] = addressesFromApi.map((addr: ApiAddress) => ({
          id: addr.id,
          name: addr.name,
          street: addr.street || '',
          area: addr.area || '',
          city: addr.city || '',
          state: addr.state || '',
          country: addr.country || '',
          postal_code: addr.postal_code || '',
          phone: addr.phone || '',
          address: `${addr.street}, ${addr.area}, ${addr.city}, ${addr.state}, ${addr.country}, ${addr.postal_code}`,
          checked: addr.is_default === 1, // mark checked if is_default=1
        }));

        // If none is default, mark first one as checked
        const anyChecked = addresses.some((a) => a.checked);
        if (!anyChecked && addresses.length > 0) {
          addresses[0].checked = true;
        }

        setUser((prev) => ({
          ...prev,
          addresses,
        }));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    loadAddresses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const street = data.get('addA')?.toString().trim() || '';
    const area = data.get('addB')?.toString().trim() || '';
    const city = data.get('city')?.toString().trim() || '';
    const state = data.get('state')?.toString().trim() || '';
    const country = 'USA'; // fixed
    const postal_code = data.get('zip')?.toString().trim() || '';
    const phone = data.get('phone')?.toString().trim() || '';
    const firstName = data.get('first_name')?.toString().trim() || '';
    const lastName = data.get('last_name')?.toString().trim() || '';
    const name = `${firstName} ${lastName}`.trim();

    // For simplicity: make currently checked radio address default
    // You can enhance to set is_default properly, or add a checkbox in form
    const is_default = true;

    // Common body payload for both add and update
    const body = {
      label: '', // optionally extend your form to include label
      name,
      street,
      landmark: '', // optional, extend your form if needed
      area,
      city,
      state,
      country,
      postal_code,
      phone,
      latitude: null, // optional, extend your form if needed
      longitude: null, // optional
      is_default,
    };

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token found');

      let response;

      if (editingIndex !== null) {
        // Update existing address
        const addressToUpdate = user.addresses[editingIndex];

        response = await fetch(`${BASE_URL}/addresses/${addressToUpdate.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      } else {
        // Add new address
        response = await fetch(`${BASE_URL}/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to ${editingIndex !== null ? 'update' : 'add'} address. Status: ${response.status}`);
      }

      const resData = await response.json();

      if (resData.status === 'success') {
        if (editingIndex !== null) {
          // Update address in state
          setUser((prev) => ({
            ...prev,
            addresses: prev.addresses.map((addr, idx) =>
              idx === editingIndex
                ? {
                    ...addr,
                    ...body,
                    address: `${street}, ${area}, ${city}, ${state}, ${country}, ${postal_code}`,
                    checked: true,
                  }
                : { ...addr, checked: false }
            ),
          }));
        } else {
          // Add new address to state and uncheck others
          // Ideally use resData.data or the returned new address from backend
          const newAddress = {
            id: resData.data?.id || Date.now(), // fallback id if not returned
            ...body,
            address: `${street}, ${area}, ${city}, ${state}, ${country}, ${postal_code}`,
            checked: true,
          };

          setUser((prev) => ({
            ...prev,
            addresses: prev.addresses.map((addr) => ({ ...addr, checked: false })).concat(newAddress),
          }));
        }

        setShowAddressForm(false);
        setEditingIndex(null);
      } else {
        throw new Error('API responded with failure status');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setShowAddressForm(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Address</h3>
        <button
          onClick={() => {
            setShowAddressForm(true);
            setEditingIndex(null);
          }}
          className="text-blue-500 px-4 py-2 cursor-pointer rounded-md text-sm"
        >
          Add +
        </button>
      </div>

      {user.addresses.map(({ id, name, address, checked }, i) => (
        <label
          key={id}
          className={`relative flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition ${
            checked ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input
            type="radio"
            name="address"
            checked={checked}
            onChange={() => {
              setUser((prev) => ({
                ...prev,
                addresses: prev.addresses.map((addr, idx) => ({
                  ...addr,
                  checked: idx === i,
                })),
              }));
            }}
            className="mt-1 accent-blue-600"
          />
          <div className="flex-1">
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-700">{address}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleEditClick(i);
            }}
            className="absolute right-4 top-4 text-black-500 hover:text-orange-500"
            aria-label="Edit address"
          >
            <PencilLine className="mt-2" size={20} />
          </button>
        </label>
      ))}

      {showAddressForm && (
        <div className="border p-4 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-md font-semibold">{editingIndex !== null ? 'Edit Address' : 'Add Address'}</h5>
            <button
              onClick={() => {
                setShowAddressForm(false);
                setEditingIndex(null);
              }}
              className="text-red-600 text-xl font-bold"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" key={editingIndex ?? 'new'}>
            <select name="country" className="w-full border rounded px-3 py-2 text-sm" defaultValue="USA" disabled>
              <option value="USA">USA</option>
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                required
                className="border rounded px-3 py-2"
                defaultValue={
                  editingIndex !== null
                    ? user.addresses[editingIndex].name.split(' ')[0]
                    : ''
                }
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                required
                className="border rounded px-3 py-2"
                defaultValue={
                  editingIndex !== null
                    ? user.addresses[editingIndex].name.split(' ').slice(1).join(' ')
                    : ''
                }
              />
            </div>

            {editingIndex !== null ? (
              <AddressFieldsDefaults
                address={user.addresses[editingIndex]}
                states={states}
              />
            ) : (
              <>
                <input
                  name="addA"
                  placeholder="Apt, Suite..."
                  required
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  name="addB"
                  placeholder="Street Address"
                  className="border rounded px-3 py-2 w-full"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="County"
                    required
                    className="border rounded px-3 py-2"
                  />
                  <select
                    name="state"
                    required
                    className="border rounded px-3 py-2"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <input
                    name="zip"
                    placeholder="ZIP Code"
                    required
                    className="border rounded px-3 py-2"
                    onKeyDown={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                  />
                </div>
                <input
                  name="phone"
                  placeholder="Phone"
                  required
                  className="border rounded px-3 py-2 w-full"
                  onKeyDown={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                />
              </>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-orange-400 text-white px-6 py-2 rounded hover:bg-orange-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

interface AddressFieldsDefaultsProps {
  address: Address;
  states: StateOption[];
}

function AddressFieldsDefaults({ address, states }: AddressFieldsDefaultsProps) {
  return (
    <>
      <input
        name="addA"
        placeholder="Apt, Suite..."
        required
        className="border rounded px-3 py-2 w-full"
        defaultValue={address.street}
      />
      <input
        name="addB"
        placeholder="Street Address"
        className="border rounded px-3 py-2 w-full"
        defaultValue={address.area}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="city"
          placeholder="County"
          required
          className="border rounded px-3 py-2"
          defaultValue={address.city}
        />
        <select
          name="state"
          required
          className="border rounded px-3 py-2"
          defaultValue={address.state}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
        <input
          name="zip"
          placeholder="ZIP Code"
          required
          className="border rounded px-3 py-2"
          defaultValue={address.postal_code}
          onKeyDown={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
        />
      </div>
      <input
        name="phone"
        placeholder="Phone"
        required
        className="border rounded px-3 py-2 w-full"
        defaultValue={address.phone}
        onKeyDown={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
      />
    </>
  );
}
