import SecondaryHeader from "@/components/SecondaryHeader";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <SecondaryHeader />
            {children}
        </div>
    );
}
