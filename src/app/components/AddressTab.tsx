'use client';

import { useState } from 'react';
import { PencilLine } from 'lucide-react';

interface Address {
  name: string;
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
  ];

  const [states] = useState<StateOption[]>(dummyStates);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [user, setUser] = useState({
    id: 100123,
    name: 'John Doe',
    email: 'john@example.com',
    addresses: [
      {
        name: 'Amaan Ansari',
        address: '2 floor, Street Road, USA, FL, us, 32003',
        checked: true,
      },
      {
        name: 'Amaan Ansari',
        address: '99 florance st, Malden, MA, us, 02148',
        checked: false,
      },
    ] as Address[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const newAddress = {
      name: `${data.get('first_name')} ${data.get('last_name')}`,
      address: `${data.get('addA')}, ${data.get('addB')}, ${data.get('city')}, ${data.get('state')}, us, ${data.get('zip')}`,
      checked: true,
    };

    if (editingIndex !== null) {
      // Update existing address
      setUser((prev) => ({
        ...prev,
        addresses: prev.addresses.map((a, idx) =>
          idx === editingIndex ? newAddress : { ...a, checked: false }
        ),
      }));
    } else {
      // Add new address
      setUser((prev) => ({
        ...prev,
        addresses: prev.addresses.map((a) => ({ ...a, checked: false })).concat(newAddress),
      }));
    }

    alert(editingIndex !== null ? 'Address updated!' : 'Address saved!');
    setShowAddressForm(false);
    setEditingIndex(null);
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setShowAddressForm(true);
  };

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

      {user.addresses.map(({ name, address, checked }, i) => (
        <label
          key={`${name}-${i}`}
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
          {/* Pencil icon */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault(); // prevent label selection
              handleEditClick(i);
            }}
            className="absolute right-4 top-4 text-black-500 hover:text-orange-500"
            aria-label="Edit address"
          >
            <PencilLine className='mt-2' size={20} />
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
            <select name="country" className="w-full border rounded px-3 py-2 text-sm" defaultValue="us" disabled>
              <option value="us">USA</option>
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

            {editingIndex !== null && (
              <AddressFieldsDefaults
                addressString={user.addresses[editingIndex].address}
                states={states}
              />
            )}
            {editingIndex === null && (
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
  addressString: string;
  states: StateOption[];
}

// Helper component to render fields with default values for edit mode
function AddressFieldsDefaults({ addressString, states }: AddressFieldsDefaultsProps) {
  // parse address string to parts
  const parts = addressString.split(',').map((p) => p.trim());
  console.log(parts)
  const addA = parts[0] || '';
  const addB = parts[1] || '';
  const city = parts[2] || '';
  const stateCode = parts[3] || '';
  const zip = parts[4] || '';

  return (
    <>
      <input
        name="addA"
        placeholder="Apt, Suite..."
        required
        className="border rounded px-3 py-2 w-full"
        defaultValue={addA}
      />
      <input
        name="addB"
        placeholder="Street Address"
        className="border rounded px-3 py-2 w-full"
        defaultValue={addB}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="city"
          placeholder="County"
          required
          className="border rounded px-3 py-2"
          defaultValue={city}
        />
        <select
          name="state"
          required
          className="border rounded px-3 py-2"
          defaultValue={stateCode}
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
          defaultValue={zip}
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
  );
}
