/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";

export function useAuthUser() {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => setUser(user))
      .catch(() => router.push("/app"))
      .finally(() => setIsLoading(false));
  }, []);
  return { isLoading, user };
}

let timeTakenOnMachine: any = 0;
