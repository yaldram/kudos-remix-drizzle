type LayoutProps = {
  children: React.ReactNode;
};

export function Layout(props: LayoutProps) {
  return (
    <div className="h-screen w-full bg-blue-600 font-mono">
      {props.children}
    </div>
  );
}
