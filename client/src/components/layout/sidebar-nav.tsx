
import { Link } from "wouter";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  isHeader?: boolean;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  return (
    <div className="w-full">
      <nav className="grid items-start gap-2">
        {items.map((item, index) => {
          if (item.isHeader) {
            return (
              <div key={index} className="px-4 py-2">
                <h4 className="text-xs font-semibold text-muted-foreground">{item.title}</h4>
              </div>
            );
          }
          
          return (
            <Link key={index} href={item.href}>
              <a
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                  item.active ? "bg-muted" : "transparent"
                }`}
              >
                {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
                <span>{item.title}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
