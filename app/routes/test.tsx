import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import styled from "styled-components";
import { getCurrentPrice } from "~/utils/firebase.server";
import { checkChannel } from "~/utils/kakao";

const TestPageBox = styled.div`
  overflow: hidden;
  width: inherit;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const loader: LoaderFunction = async () => {
  const price = await getCurrentPrice({ itemIndex: 0 });
  if (price !== undefined) {
    return price;
  } else {
    return null;
  }
};

export const action: ActionFunction = async () => {
  // createDatabase();
  return null;
};

export default function Index() {
  const submit = useSubmit();
  const data = useLoaderData();

  useEffect(() => {
    printChannel();
  }, []);

  async function printChannel(){
    const result = await checkChannel();
    console.log(result);
  }

  return (
    <TestPageBox>
      <button
        onClick={() => {
          submit(null, { method: "post" });
        }}
      >
        {data}
      </button>
    </TestPageBox>
  );
}
