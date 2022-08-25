import { FC, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";

export const TokenInput: FC<{ onChange: (token: string) => void }> = ({
  onChange
}) => {
  const [token, setToken] = useState<string>();

  return (
    <form className="p-3 block" onSubmit={(e) => {
      e.preventDefault();
      if (token) {
        onChange(token)
      }
    }}>
      <Label htmlFor="token">Token</Label>
      <TextInput name="token" id="token" type="password" autoComplete="password" value={token} onChange={(e) => setToken(e.target.value)} />
      <Button type="submit" style={{ marginTop: 16 }} disabled={!token}>
        Set Authentication Token
      </Button>
    </form>
  )
}
