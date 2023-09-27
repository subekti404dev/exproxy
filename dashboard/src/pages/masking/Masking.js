import { Button } from "antd";
import { useState } from "react";

export const MaskingPage = () => {
  const [count, setCount] = useState(1);
  return (
    <>
      {count}
      <Button onClick={() => setCount((count) => (count += 1))}>Plus</Button>
    </>
  );
};
