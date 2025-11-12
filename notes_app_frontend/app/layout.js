export const metadata = {
  title: 'Simple Notes',
  description: 'Create, view, edit, and delete notes - Ocean Professional theme'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          {children}
        </div>
      </body>
    </html>
  );
}
