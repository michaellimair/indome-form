import { Label, TextInput, Button } from 'flowbite-react';
import { FC, FormEventHandler, useCallback, useState } from 'react';

export const ManualInputForm: FC<{ setEmail: (value: string) => void; setPhone: (value: string) => void }> = ({
  setEmail,
  setPhone
}) => {
  const [emailField, setEmailField] = useState<string>('');
  const [phoneField, setPhoneField] = useState<string>('');

  const handleEmailLookup: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    e.preventDefault();
    setEmail(emailField);
    setEmailField('');
  }, [emailField]);

  const handlePhoneLookup: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    e.preventDefault();
    setPhone(phoneField);
    setPhoneField('');
  }, [phoneField]);

  return (
    <div className='px-3'>
      <form className="flex flex-col gap-4" onSubmit={handleEmailLookup}>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="email"
              value="Email"
            />
          </div>
          <TextInput
            id="email"
            type="email"
            value={emailField}
            onChange={(e) => setEmailField(e.target.value)}
            placeholder="email@email.com"
          />
        </div>
        <Button type="submit">
          Lookup by Email
        </Button>
      </form>
      <form className="flex flex-col gap-4 mt-4" onSubmit={handlePhoneLookup}>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="phone"
              value="Phone Number"
            />
          </div>
          <TextInput
            id="phone"
            type="tel"
            value={phoneField}
            onChange={(e) => setPhoneField(e.target.value)}
            placeholder="55881234 or +85255881234"
          />
        </div>
        <Button type="submit">
          Lookup by Phone Number
        </Button>
      </form>
    </div>
  )
}