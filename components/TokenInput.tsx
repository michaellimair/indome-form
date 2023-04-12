import { FC, useState } from "react";
import { Button, Label } from "flowbite-react";
import { TextInput } from "./TextInput";

export const TokenInput: FC<{ onChange: (token: string) => void }> = ({
  onChange
}) => {
  const [token, setToken] = useState<string>();

  return (
    <form className="p-3 block sticky top-0 bg-white dark:bg-black z-50" onSubmit={(e) => {
      e.preventDefault();
      if (token) {
        onChange(token)
      }
    }}>
      <Label htmlFor="token">Token</Label>
      <div className="flex flex-row mt-2">
        <TextInput className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 flex-1 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-2" name="token" id="token" type="password" autoComplete="password" value={token} onChange={(e) => setToken(e.target.value)} />
        <Button type="submit" disabled={!token}>
          Set Authentication Token
        </Button>
      </div>
    </form>
  )
}
