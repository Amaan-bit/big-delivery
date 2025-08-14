"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import GlobalModals from "@/app/components/GlobalModals";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GlobalModals />
      {children}
    </Provider>
  );
}
