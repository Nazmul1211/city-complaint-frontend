import Link from "next/link";

const Header = () => {
  const routes = [
    { name: "Home", url: "/" },
    { name: "About us", url: "/about-us" },
    { name: "Login", url: "/login" },
  ];

  return (
    <header className="w-full, h-16 border border-b justify-center items-center">
      <nav className="flex gap-5">
        {routes.map((route) => (
          <Link key={route.url} href={route.url}>
            {route.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
