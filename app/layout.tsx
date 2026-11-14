import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Paws on Board — Good days start together.",
  description:
    "Dog travel essentials for the road, the trail and everything in between. Explore car protection, outdoor gear and thoughtfully paired bundles.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
