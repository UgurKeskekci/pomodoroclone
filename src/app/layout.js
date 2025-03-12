import "@/styles/variables.css";
import "@/styles/global.css";

export const metadata = {
  title: "Pomofocus - Pomodoro Timer",
  description: "Pomodoro tekniği ile verimli çalışın",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
