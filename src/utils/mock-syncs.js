export default async () => {
  const res = await fetch(
    `https://192.168.2.23:5000/interop-manager/synchronizations`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("malu:malu")}`
      }
    }
  );

  const data = await res.json();
  return data;
};
