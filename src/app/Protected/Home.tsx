import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const get = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/funcionarios/all`,
          { credentials: "include" }
        );
        if (!response.ok)
          throw new Error(response.status + " " + response.statusText);

        console.log(await response.json());
      } catch (error) {
        console.error(error);
      }
    };
    get();
  }, []);
  return <div>Home</div>;
}
