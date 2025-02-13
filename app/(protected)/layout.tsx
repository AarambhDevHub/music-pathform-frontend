import { Header } from "@/components/header";
import MusicPlayer from "@/components/music/MusicPlayer";
import { MusicProvider } from "@/components/music/musicProvider";
import { SideBar } from "@/components/sideBar";


const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <Header />
        <MusicProvider>
          <main className="relative flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
          <MusicPlayer />
        </MusicProvider>
      </div>
    </div>
  );
};

export default ProtectedLayout;
