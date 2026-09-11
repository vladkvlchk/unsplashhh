import type { Metadata } from "next";

import { Providers } from "@/app/providers";
import { UNSPLASH_IMAGE_CDN_URL } from "@/constants/api";
import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";

import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} | Beautiful Free Images & Photos`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href={UNSPLASH_IMAGE_CDN_URL} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
